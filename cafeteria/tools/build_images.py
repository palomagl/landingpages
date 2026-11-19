"""
Gera todas as imagens do site a partir do kit em design/kit/ (fotos 414 x 414).

    python3 tools/build_images.py            # gera em public/images/

Etapas aplicadas a cada foto:
  1. limpeza dos artefatos de compressão JPEG (non-local means suave);
  2. ampliação Lanczos + nitidez só na luminância, em duas frequências (sem halos de cor);
  3. composições nos formatos do layout (hero panorâmico, 4:3 e retrato; cards; categorias;
     banner), estendendo a cena com reflexo e desfoque progressivo (profundidade de campo);
  4. tratamento de cor quente e cinematográfico (contraste fílmico, split-tone, brilho
     suave nas altas luzes, vinheta) e grão fino, que mascara a ampliação.

Requer: numpy, opencv-python, pillow (WebP).
Para fotos reais em alta resolução, substitua os arquivos do kit e rode de novo.
"""
from __future__ import annotations

import os
import sys

import cv2
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KIT = os.path.join(ROOT, 'design', 'kit')
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'public', 'images')
os.makedirs(OUT, exist_ok=True)

FILES = {
    '01': '01_hero_maquina_pedra.jpg',
    '02': '02_produto_aroma_one.jpg',
    '03': '03_produto_aroma_pro.jpg',
    '04': '04_produto_aroma_office.jpg',
    '05': '05_categoria_automaticas.jpg',
    '06': '06_categoria_semiautomaticas.jpg',
    '07': '07_categoria_acessorios.jpg',
    '08': '08_categoria_insumos.jpg',
    '09': '09_banner_cafe_espresso.jpg',
}
N = 414  # lado das fotos do kit

# --------------------------------------------------------------------------- básicos

_clean: dict[str, np.ndarray] = {}


def clean(key: str) -> np.ndarray:
    """Foto limpa (uint8 RGB), sem blocos de compressão."""
    if key not in _clean:
        bgr = cv2.imread(os.path.join(KIT, FILES[key]), cv2.IMREAD_COLOR)
        bgr = cv2.fastNlMeansDenoisingColored(bgr, None, 3, 4, 5, 15)
        _clean[key] = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    return _clean[key]


def upscale(key: str, S: int) -> np.ndarray:
    """Ampliação com nitidez na luminância. Retorna float32 0..1 (S x S)."""
    a = clean(key)
    b = cv2.resize(a, (S, S), interpolation=cv2.INTER_LANCZOS4 if S > N else cv2.INTER_AREA)
    lab = cv2.cvtColor(b, cv2.COLOR_RGB2LAB).astype(np.float32)
    L = lab[..., 0]
    k = max(1.0, S / N)
    for sigma, amount in ((1.1 * k, 0.6), (0.5 * k, 0.35)):
        L = L + amount * (L - cv2.GaussianBlur(L, (0, 0), sigma))
    lab[..., 0] = np.clip(L, 0, 255)
    return cv2.cvtColor(lab.astype(np.uint8), cv2.COLOR_LAB2RGB).astype(np.float32) / 255.0


def blur(a: np.ndarray, r: float) -> np.ndarray:
    return cv2.GaussianBlur(a, (0, 0), max(0.1, r))


def lum(c: np.ndarray) -> np.ndarray:
    return c @ np.array([0.2126, 0.7152, 0.0722], np.float32)


# --------------------------------------------------------------------------- composição

def outpaint(key: str, W: int, H: int, s: float, ox: int, oy: int) -> np.ndarray:
    """Coloca a foto (escala s) em (ox, oy) e estende a cena até W x H."""
    S = int(round(N * s))
    B = upscale(key, S)
    pl, pt = max(0, ox), max(0, oy)
    pr, pb = max(0, W - (ox + S)), max(0, H - (oy + S))
    P = np.pad(B, ((0, 0), (pl, pr), (0, 0)), mode='symmetric')  # lados: reflexo
    P = np.pad(P, ((pt, pb), (0, 0), (0, 0)), mode='edge')  # cima/baixo: continua parede e bancada
    cy, cx = -min(0, oy), -min(0, ox)
    C = P[cy:cy + H, cx:cx + W]
    X = np.arange(W)[None, :]
    Y = np.arange(H)[:, None]
    dx = np.maximum(np.maximum(ox - X, X - (ox + S - 1)), 0).astype(np.float32)
    dy = np.maximum(np.maximum(oy - Y, Y - (oy + S - 1)), 0).astype(np.float32)
    d = np.sqrt(dx ** 2 + dy ** 2)
    u = max(W, H) / 1000
    levels = [(0, C), (18 * u, blur(C, 3 * u)), (90 * u, blur(C, 12 * u)), (320 * u, blur(C, 34 * u))]
    out = C.copy()
    for (d0, a), (d1, b) in zip(levels, levels[1:]):
        t = np.clip((d - d0) / (d1 - d0), 0, 1)[..., None]
        out = np.where((d >= d0)[..., None], a * (1 - t) + b * t, out)
    far = d >= levels[-1][0]
    out[far] = levels[-1][1][far]
    k = np.clip(d / (260 * u), 0, 1)[..., None] * 0.16
    return out * (1 - k) + out.mean(axis=(0, 1), keepdims=True) * k


def light(c, left=0.0, top=0.0, beam=None, dark=(0.25, 0.15, 0.085), left_w=0.44, top_w=0.5, top_exp=1.5, top_x=0.5):
    """Escurece onde vai o texto (esquerda/topo) e adiciona o feixe de luz diagonal."""
    H, W, _ = c.shape
    X, Y = np.meshgrid(np.arange(W, dtype=np.float32) / W, np.arange(H, dtype=np.float32) / H)
    k = left * np.clip(1 - X / left_w, 0, 1) ** 1.25 + top * np.clip(1 - Y / top_w, 0, 1) ** top_exp * (1 - top_x * X)
    k = np.clip(k, 0, 0.92)
    c = c * (1 - k[..., None]) + np.array(dark, np.float32) * k[..., None]
    if beam:
        x0, x1, wd, a = beam
        cen = x0 + (x1 - x0) * Y
        b = np.clip(1 - np.abs(X - cen) / wd, 0, 1) ** 1.7 * a * (1 - 0.35 * Y)
        c = 1 - (1 - c) * (1 - b[..., None] * np.array([1.0, 0.85, 0.68], np.float32))
    return c


def grade(c, contrast=0.18, warmth=1.0, bloom=0.2, vignette=0.12, sat=1.07):
    """Tratamento de cor: contraste fílmico, split-tone quente, brilho nas altas luzes, vinheta."""
    c = np.clip(c, 0, 1)
    H, W, _ = c.shape
    s = c * c * (3 - 2 * c)
    c = c * (1 - contrast) + s * contrast
    l = lum(c)[..., None]
    sh = np.clip(1 - l / 0.45, 0, 1)
    hi = np.clip((l - 0.55) / 0.45, 0, 1)
    c = c + sh * np.array([0.022, 0.006, -0.014], np.float32) * warmth + hi * np.array([0.02, 0.006, -0.026], np.float32) * warmth
    c = l + (c - l) * sat
    hl = np.clip((lum(c) - 0.6) / 0.4, 0, 1)[..., None] * c
    bl = blur(hl, max(W, H) * 0.014)
    c = 1 - (1 - np.clip(c, 0, 1)) * (1 - bl * bloom)
    if vignette:
        X, Y = np.meshgrid(np.linspace(-1, 1, W, dtype=np.float32), np.linspace(-1, 1, H, dtype=np.float32))
        v = np.clip((X ** 2 * 0.8 + Y ** 2) - 0.35, 0, 1)
        c = c * (1 - vignette * v[..., None])
    return np.clip(c, 0, 1)


def save(c, name: str, widths: list[int], q: int = 84, alpha=None, grain=0.012):
    rng = np.random.default_rng(abs(hash(name)) % 2 ** 32)
    H, W, _ = c.shape
    out = []
    for w in widths:
        h = round(H * w / W)
        r = cv2.resize(c, (w, h), interpolation=cv2.INTER_AREA if w < W else cv2.INTER_LANCZOS4)
        # grão fino aplicado no tamanho final (textura de filme, esconde a ampliação)
        g = blur(rng.normal(0, grain, (h, w)).astype(np.float32), 0.6)[..., None]
        r = np.clip(r + g * (0.6 + 0.8 * (1 - lum(r)[..., None])), 0, 1)
        img = (r * 255 + 0.5).astype(np.uint8)
        if alpha is not None:
            a = cv2.resize(alpha, (w, h), interpolation=cv2.INTER_AREA)
            im = Image.fromarray(np.dstack([img, (a * 255).astype(np.uint8)]), 'RGBA')
        else:
            im = Image.fromarray(img, 'RGB')
        path = os.path.join(OUT, f'{name}-{w}.webp')
        im.save(path, 'WEBP', quality=q, method=6)
        out.append((path, os.path.getsize(path)))
    return out


# --------------------------------------------------------------------------- hero 1 (desktop)

def hero01_desktop():
    W, H, s, ox, oy = 2400, 1200, 2.7, 1094, 54
    S = int(N * s)
    B = upscale('01', S)
    x1, y1 = ox + S, oy + S
    X, Y = np.arange(W), np.arange(H)
    rows = np.clip(Y - oy, 0, S - 1)
    Bb = blur(B, 6)
    prof = Bb[rows, int(6 * s):int(30 * s)].mean(axis=1)
    far = blur(Bb[:, :int(60 * s)], 18)[rows].mean(axis=1)
    t = np.clip((X - (ox - 600)) / 600.0, 0, 1)[None, :, None]
    c = far[:, None, :] * (1 - t) + prof[:, None, :] * t
    ph = np.zeros((H, W, 3), np.float32)
    ph[:, ox:x1] = B[rows]
    ramp = (np.clip((X - ox) / 70.0, 0, 1) * (X < x1))[None, :, None]
    c = c * (1 - ramp) + ph * ramp
    # direita: ripado limpo (sem folhas) e bloco de pedra contínuo
    slat = B[:int(88 * s), int(380 * s):]
    tile = np.concatenate([slat, slat[:, ::-1]], axis=1)
    need = W - x1
    rep = np.tile(tile, (int(np.ceil(H / slat.shape[0])) + 1, int(np.ceil(need / tile.shape[1])) + 1, 1))[:H, :need]
    pl = B[:, S - int(70 * s):S]
    pt = np.concatenate([pl[:, ::-1], pl], axis=1)
    prep = np.tile(pt, (1, int(np.ceil(need / pt.shape[1])) + 1, 1))[:, :need][rows]
    low = (rows >= int(277 * s) - 2)[:, None, None]
    c[:, x1:] = np.where(low, prep, rep)
    c[:, x1 - 20:x1 + 20] = blur(c[:, x1 - 40:x1 + 40], 5)[:, 20:60]
    c[:oy, ox:x1] = blur(B[:24], 16).mean(axis=0)[None]
    c[y1:, ox:x1] = blur(B[-30:], 22).mean(axis=0)[None]
    d = np.maximum(oy - Y, Y - (y1 - 1)).clip(0)[:, None]
    k = np.clip(d / 60.0, 0, 1)[..., None]
    c = c * (1 - k) + blur(c, 14) * k
    c = light(c, left=0.80, top=0.42, beam=(0.50, 0.26, 0.075, 0.30), left_w=0.46)
    return grade(c, bloom=0.24)


# --------------------------------------------------------------------------- tarefas

def main_banner(log):
    # banner panorâmico com transparência à esquerda
    # xícara um pouco menor e mais baixa que no mockup, deixando espaço para o vapor
    W, H, s, ox, oy = 2400, 620, 1.75, 1560, 30
    S = int(N * s)
    B = upscale('09', S)
    rows = np.clip(np.arange(H) - oy, 0, S - 1)
    edge = blur(blur(B[:, 0:30], 8).mean(axis=1)[:, None, :], 14)[:, 0, :]
    c = np.repeat(edge[rows][:, None, :], W, axis=1)
    x1 = min(W, ox + S)
    c[:, ox:x1] = B[rows, :x1 - ox]
    if x1 < W:
        right = blur(B[:, S - 6:S], 4).mean(axis=1)
        c[:, x1:] = right[rows][:, None, :]
        for i in range(40):
            a = i / 40
            c[:, x1 - 40 + i] = c[:, x1 - 40 + i] * (1 - a) + right[rows] * a
    for i in range(80):
        a = i / 80
        c[:, ox + i] = c[:, ox + i] * a + edge[rows] * (1 - a)
    xn = np.arange(W, dtype=np.float32)[None, :] / W
    alpha = np.repeat(np.clip((xn - 0.47) / 0.2, 0, 1) ** 1.3, H, axis=0)
    log += save(grade(c, bloom=0.26, vignette=0.0), 'banner', [1280, 1920, 2560], q=84, alpha=alpha)



def main():
    log = []
    # hero
    log += save(hero01_desktop(), 'hero-01', [1280, 1920, 2560], q=84)
    W, H, s = 1536, 1200, 2.6
    S = int(N * s)
    c = outpaint('01', W, H, s, W - S + 40, H - S)
    log += save(grade(light(c, left=0.85, top=0.55, left_w=0.55, top_w=0.55)), 'hero-01-tablet', [1024, 1536], q=84)
    for key, name, mcx in (('01', 'hero-01', 209), ('03', 'hero-pro', 263), ('04', 'hero-office', 270)):
        W, H, s = 900, 1820, 2.3
        S = int(N * s)
        c = outpaint(key, W, H, s, int(0.5 * W - mcx * s), H - S)
        c = light(c, top=1.0, top_w=0.64, top_exp=0.85, top_x=0.15, dark=(0.14, 0.085, 0.05))
        log += save(grade(c, vignette=0.08), f'{name}-mobile', [600, 900, 1200], q=84)
    for key, name, mcx in (('03', 'hero-pro', 263), ('04', 'hero-office', 270)):
        c = outpaint(key, 2400, 1200, 2.9, int(1590 - mcx * 2.9), 0)
        log += save(grade(light(c, left=0.82, top=0.45, beam=(0.50, 0.25, 0.08, 0.28)), bloom=0.24), name, [1280, 1920, 2560], q=84)
        c = outpaint(key, 1536, 1200, 2.9, int(1536 * 0.70 - mcx * 2.9), 0)
        log += save(grade(light(c, left=0.85, top=0.55, left_w=0.55, top_w=0.55)), f'{name}-tablet', [1024, 1536], q=84)

    # cards (1000 x 570 -> exportados até 1200)
    for key, name, mcx, frac, ytop in (
        ('02', 'card-aroma-one', 230, 0.57, 28),
        ('03', 'card-aroma-pro', 263, 0.58, 28),
        ('04', 'card-aroma-office', 270, 0.60, 28),
        ('01', 'card-aroma-signature', 208, 0.56, 40),
        ('09', 'card-xicara-espresso', 230, 0.55, 40),
    ):
        W, H = 1200, 684
        s = H / 360
        c = outpaint(key, W, H, s, int(frac * W - mcx * s), int(-ytop * s))
        log += save(grade(c, vignette=0.1), name, [480, 800, 1200], q=82)

    # categorias: panorâmicas (desktop) e quadradas (celular)
    for key, name, s, ox, oy in (
        ('05', 'cat-automaticas', 1.6, 384, -68),
        ('06', 'cat-semiautomaticas', 1.9, 212, -101),
        ('07', 'cat-acessorios', 1.55, 228, -92),
        ('08', 'cat-insumos', 1.4, 420, -48),
    ):
        f = 1.2  # trabalha em 1200 x 624
        c = outpaint(key, 1200, 624, s * f, int(ox * f), int(oy * f))
        c = light(c, left=0.4, left_w=0.55, dark=(0.20, 0.12, 0.07))
        log += save(grade(c, vignette=0.14), name, [400, 700, 1000], q=82)

    # fotos quadradas (galeria, blocos no celular, banner no celular)
    if os.environ.get('ONLY') == 'banner':
        main_banner(log)
        print(len(log))
        return
    for key, name in (
        ('01', 'hero-maquina-pedra'), ('02', 'produto-aroma-one'), ('03', 'produto-aroma-pro'), ('04', 'produto-aroma-office'),
        ('05', 'categoria-automaticas'), ('06', 'categoria-semiautomaticas'), ('07', 'categoria-acessorios'),
        ('08', 'categoria-insumos'), ('09', 'banner-cafe-espresso'),
    ):
        log += save(grade(upscale(key, 1400), vignette=0.1), name, [600, 1000, 1400], q=82)

    main_banner(log)

    total = sum(sz for _, sz in log)
    print(f'{len(log)} arquivos, {total / 1024 / 1024:.1f} MB em {OUT}')


if __name__ == '__main__':
    main()
