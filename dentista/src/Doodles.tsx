// Desenhos de caneta para os combinados. Traço próprio, de propósito um pouco torto, como se a
// dentista tivesse rabiscado no cartão.
const common = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
  className: "doodle",
};

export function DoodleTalk() {
  return (
    <svg {...common}>
      <path d="M7.5 12.5c.2-3.1 2.2-5 5.4-5.1l22.4-.3c3 0 5.1 2 5.1 5l.1 12.6c0 3.1-2.1 5.2-5.2 5.2l-13.6.2-8.1 7.4 1.2-7.5-1.6.1c-3 0-5.2-2.1-5.3-5z" />
      <path d="M14.5 15.6c5.8-.4 11.7-.3 18.2-.2M14.7 21.4c4.2-.2 8-.2 11.6 0" />
    </svg>
  );
}

export function DoodleHand() {
  return (
    <svg {...common}>
      <path d="M17.2 26.5 17 12.6c0-1.5 1.1-2.6 2.5-2.6s2.5 1.1 2.5 2.5l.2 11" />
      <path d="M22.1 23.4 22 9.7c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5l.1 13.6" />
      <path d="M27.1 23.3 27 11.9c0-1.4 1.2-2.5 2.6-2.4 1.3 0 2.4 1.1 2.4 2.5l.1 13" />
      <path d="M32.2 25.4 32 17c0-1.4 1.1-2.5 2.5-2.5S37 15.6 37 17l.1 12.2c.1 7.9-4.8 13-11.9 13.1-6.9.1-10-3.6-12.1-7.7l-3.9-6.9c-.8-1.3-.3-2.9 1-3.5 1.1-.6 2.4-.2 3.1.7l3.9 5" />
    </svg>
  );
}

export function DoodleClock() {
  return (
    <svg {...common}>
      <path d="M24.3 9.6c8.3-.1 15.1 6.6 15.1 14.9.1 8.4-6.6 15.2-14.9 15.3-8.4.1-15.2-6.6-15.3-15 0-8.3 6.7-15.1 15.1-15.2z" />
      <path d="M24.2 15.8 24.4 25l6.3 3.7M20.2 5.3c2.7-.2 5.4-.2 8.1 0" />
    </svg>
  );
}

export function DoodleSteps() {
  return (
    <svg {...common}>
      <path d="M6 39.2h9.2l.1-8.4 9-.1.1-8.3 9-.1v-8.2l8.7-.1" />
      <path d="M36.2 8.4 42 14l-5.6 5.4" />
    </svg>
  );
}

export const doodles = [DoodleTalk, DoodleHand, DoodleClock, DoodleSteps];
