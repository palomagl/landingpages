import { useEffect, useRef, useState } from "react";
import { clinic } from "./config";

// Mapa do "Onde fica". Com mapEmbedUrl preenchido, mostra o Google Maps de verdade; sem ele (como na
// demonstração), mostra um mapa ilustrado do quarteirão, desenhado aqui mesmo em SVG.

export function MapCard() {
  return (
    <figure className="map-card">
      {clinic.mapEmbedUrl ? (
        <iframe
          className="map-embed"
          src={clinic.mapEmbedUrl}
          title={`Mapa: ${clinic.address}, ${clinic.district}`}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      ) : (
        <MapScroller />
      )}
      <figcaption>
        <span>
          {clinic.mapEmbedUrl ? `${clinic.address}, ${clinic.district}` : "Mapa ilustrativo do quarteirão"}
          {!clinic.mapEmbedUrl && <span className="map-hint">. Arraste para os lados para ver a estação.</span>}
        </span>
      </figcaption>
    </figure>
  );
}

// No celular o mapa não encolhe até as ruas ficarem ilegíveis: ele mantém uma largura mínima e dá pra
// arrastar pros lados. Ao abrir, já aparece centralizado no consultório.
function MapScroller() {
  const box = useRef<HTMLDivElement>(null);
  // Só vira uma área rolável (com foco pelo teclado) quando o mapa não cabe na tela.
  const [scrolls, setScrolls] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const check = () => setScrolls(el.scrollWidth > el.clientWidth + 1);
    check();
    if (el.scrollWidth > el.clientWidth) el.scrollLeft = (el.scrollWidth * 292) / 640 - el.clientWidth / 2;
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return (
    <div
      className="map-scroll"
      ref={box}
      {...(scrolls ? { tabIndex: 0, role: "region", "aria-label": "Mapa ilustrativo. Role para os lados para ver a estação." } : {})}
    >
      <IllustratedMap />
    </div>
  );
}

const STREET = "#fbfbf8";
const LABEL = { fontFamily: "Inter, system-ui, sans-serif", fontSize: 13, fill: "#7a7180", letterSpacing: "0.01em" } as const;

function IllustratedMap() {
  return (
    <svg
      className="map-svg"
      viewBox="0 0 640 440"
      role="img"
      aria-label={`Mapa ilustrativo: o consultório fica na ${clinic.address}, entre a Rua do Comércio e a Avenida Central, em frente ao estacionamento e a 6 minutos a pé da Estação Centro.`}
    >
      <rect width="640" height="440" fill="#dfe3d9" />

      {/* praça */}
      <rect x="318" y="268" width="140" height="104" rx="10" fill="#c5d3bd" />
      {[
        [340, 290], [372, 300], [410, 288], [436, 312], [352, 334], [392, 344], [430, 352],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="9" fill="#a9bfa0" />
      ))}

      {/* ruas */}
      <g stroke={STREET} strokeLinecap="round" fill="none">
        <path d="M-10 254 H650" strokeWidth="28" />
        <path d="M-10 112 H650" strokeWidth="16" />
        <path d="M-10 390 H650" strokeWidth="14" />
        <path d="M300 -10 V450" strokeWidth="18" />
        <path d="M478 60 V450" strokeWidth="14" />
        <path d="M128 -10 V450" strokeWidth="12" />
        <path d="M-10 330 L128 254" strokeWidth="12" />
      </g>

      {/* trem */}
      <path d="M-10 46 H650" stroke="#b9b0c2" strokeWidth="6" />
      <path d="M-10 46 H650" stroke="#dfe3d9" strokeWidth="2" strokeDasharray="10 10" />
      <rect x="506" y="30" width="116" height="32" rx="16" fill="#2e1a3b" />
      <text x="564" y="51" textAnchor="middle" style={{ ...LABEL, fill: "#fbfbf8", fontWeight: 600 }}>Estação Centro</text>

      {/* caminho a pé da estação */}
      <path
        d="M548 60 V70 Q548 84 534 84 H492 Q478 84 478 98 V112 H314 Q300 112 300 126 V176"
        stroke="#137a44"
        strokeWidth="3.5"
        strokeDasharray="1 8"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="370" y="122" width="100" height="28" rx="14" fill="#fbfbf8" stroke="#137a44" strokeWidth="1.5" />
      <text x="420" y="141" textAnchor="middle" style={{ ...LABEL, fill: "#137a44", fontWeight: 600 }}>6 min a pé</text>

      {/* nomes das ruas */}
      <text x="40" y="259" style={{ ...LABEL, fontSize: 14, fontWeight: 600 }}>Av. Central</text>
      <text x="146" y="117" style={LABEL}>Rua do Comércio</text>
      <text x="496" y="395" style={LABEL}>Rua Bela Vista</text>
      <text transform="translate(304 420) rotate(-90)" style={{ ...LABEL, fill: "#2e1a3b", fontWeight: 600 }}>Rua dos Ipês</text>
      <text transform="translate(482 236) rotate(-90)" style={LABEL}>Rua das Hortênsias</text>
      <text transform="translate(132 230) rotate(-90)" style={LABEL}>Rua Sete</text>
      <text x="388" y="364" textAnchor="middle" style={{ ...LABEL, fill: "#5e7356", fontSize: 12 }}>Praça dos Imigrantes</text>

      {/* estacionamento */}
      <rect x="318" y="160" width="26" height="26" rx="6" fill="#5b4e63" />
      <text x="331" y="178" textAnchor="middle" style={{ ...LABEL, fill: "#fbfbf8", fontSize: 15, fontWeight: 600 }}>P</text>
      <text x="350" y="179" style={LABEL}>Estacionamento</text>

      {/* consultório */}
      <ellipse cx="292" cy="214" rx="10" ry="3.5" fill="rgba(46,26,59,0.25)" />
      <path d="M292 214 C278 196 270 186 270 174 a22 22 0 0 1 44 0 C314 186 306 196 292 214 Z" fill="#2e1a3b" />
      <path
        d="M284.5 166 c3.4-2.4 5.7-0.6 7.5-0.6 s4.1-1.8 7.5 0.6 c2.7 2 2.3 6.4 1 9.6 -1.2 3-1.6 8.2-3.6 8.2 -2 0-2-5.2-4.9-5.2 s-2.9 5.2-4.9 5.2 -2.4-5.2-3.6-8.2 c-1.3-3.2-1.7-7.6 1-9.6 z"
        fill="#fbfbf8"
      />
      <rect x="146" y="148" width="116" height="50" rx="10" fill="#fbfbf8" stroke="#2e1a3b" strokeWidth="1.5" />
      <text x="204" y="168" textAnchor="middle" style={{ ...LABEL, fill: "#2e1a3b", fontWeight: 600, fontSize: 14 }}>Consultório</text>
      <text x="204" y="187" textAnchor="middle" style={{ ...LABEL, fill: "#5b4e63", fontSize: 12 }}>nº 214, sala 3</text>

      {/* norte */}
      <g transform="translate(606 410)">
        <circle r="16" fill="#fbfbf8" />
        <path d="M0 -10 L6 6 L0 2 L-6 6 Z" fill="#2e1a3b" />
        <text y="-19" textAnchor="middle" style={{ ...LABEL, fontSize: 10, fontWeight: 600, fill: "#2e1a3b" }}>N</text>
      </g>
    </svg>
  );
}
