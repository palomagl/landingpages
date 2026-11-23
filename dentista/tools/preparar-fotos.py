"""Prepara as fotos do site: recorta na proporção certa e gera WebP em 800 e 1600 px de largura.

Uso:
    python3 tools/preparar-fotos.py pasta-com-as-fotos-originais

A pasta deve ter um arquivo para cada foto, com estes nomes (jpg, png, webp ou avif):
    retrato, consultorio, conversa, exame, prevencao, atendimento
Os arquivos prontos vão para public/fotos/. Precisa do Pillow 11.2 ou mais novo (pip install -U pillow),
que é o que abre AVIF.
"""

import sys
from pathlib import Path

from PIL import Image, ImageOps

# nome: (largura, altura, onde manter o foco na vertical: 0 = topo, 0.5 = centro)
FOTOS = {
    "retrato": (4, 5, 0.3),
    "consultorio": (3, 2, 0.5),
    "conversa": (4, 5, 0.3),
    "exame": (4, 3, 0.5),
    "prevencao": (4, 3, 0.5),
    "atendimento": (1, 1, 0.3),
}
LARGURAS = (800, 1600)
DESTINO = Path(__file__).resolve().parent.parent / "public" / "fotos"


def recortar(img: Image.Image, w: int, h: int, foco_y: float) -> Image.Image:
    alvo = w / h
    largura, altura = img.size
    if largura / altura > alvo:  # sobra largura: corta dos lados
        nova = round(altura * alvo)
        x = (largura - nova) // 2
        return img.crop((x, 0, x + nova, altura))
    nova = round(largura / alvo)  # sobra altura: corta em cima/embaixo, respeitando o foco
    y = round((altura - nova) * foco_y)
    return img.crop((0, y, largura, y + nova))


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    origem = Path(sys.argv[1])
    DESTINO.mkdir(parents=True, exist_ok=True)
    faltando = []
    for nome, (w, h, foco) in FOTOS.items():
        arquivos = [p for p in origem.glob(f"{nome}.*") if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp", ".avif"}]
        if not arquivos:
            faltando.append(nome)
            continue
        img = ImageOps.exif_transpose(Image.open(arquivos[0])).convert("RGB")
        img = recortar(img, w, h, foco)
        if img.width < LARGURAS[-1]:
            print(f"Atenção: {arquivos[0].name} tem só {img.width} px de largura depois do recorte; "
                  "em telas de alta resolução vai ficar menos nítida. Use o arquivo original, se tiver.")
        for largura in LARGURAS:
            altura = round(largura * h / w)
            saida = DESTINO / f"{nome}-{largura}.webp"
            img.resize((largura, altura), Image.LANCZOS).save(saida, "WEBP", quality=80, method=6)
            print(f"{saida.relative_to(DESTINO.parent.parent)}  {saida.stat().st_size // 1024} KB")
    if faltando:
        print("Faltaram:", ", ".join(faltando))


if __name__ == "__main__":
    main()
