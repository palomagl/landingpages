import type { SVGProps } from 'react';

const paths = {
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 4.5 4.5" />
    </>
  ),
  close: <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  arrowL: <path d="M19 12H5m6-6-6 6 6 6" />,
  arrowR: <path d="M5 12h14m-6-6 6 6-6 6" />,
  chevronD: <path d="m6 9 6 6 6-6" />,
  filter: <path d="M4 7h10m4 0h2M4 17h4m4 0h8M14 4v6M8 14v6" />,
  bag: <path d="M6 8h12l-1 12H7L6 8Zm3 0V6.5a3 3 0 0 1 6 0V8" />,
  trash: <path d="M5 7h14M10 7V5h4v2m-7 0 1 12h8l1-12" />,
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
    </>
  ),
  /* Diferenciais */
  cup: <path d="M4 8h13v4.5a6.5 6.5 0 0 1-13 0V8Zm13 1.5h1.5a2.5 2.5 0 0 1 0 5H16.6M3 21h16" />,
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.8l1.6 2.4 2.8-.8.6 2.8 2.8.6-.8 2.8 2.4 1.6-2.4 1.6.8 2.8-2.8.6-.6 2.8-2.8-.8L12 21.2l-1.6-2.4-2.8.8-.6-2.8-2.8-.6.8-2.8L2.8 12l2.4-1.6-.8-2.8 2.8-.6.6-2.8 2.8.8L12 2.8Z" />
    </>
  ),
  layers: <path d="M12 3.5 21 8l-9 4.5L3 8l9-4.5ZM3 12l9 4.5 9-4.5M3 16l9 4.5 9-4.5" />,
  leaf: <path d="M5 19c0-8 5-13.5 14.5-14.5C19.5 14 14 19 6.5 19H5Zm0 0 8.5-8.5M3.5 21 5 19" />,
  truck: <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7M7 18.5a1.5 1.5 0 1 0 0-.01M17 18.5a1.5 1.5 0 1 0 0-.01" />,
  shield: <path d="M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6L12 3Zm-3.5 9 2.5 2.5 4.5-5" />,
  tool: <path d="M14.5 5.5a4 4 0 0 0 5 5L11 19a2 2 0 0 1-3-3l8.5-8.5" />,
  star: <path d="m12 4 2.4 5 5.4.6-4 3.7 1.1 5.4L12 16l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6L12 4Z" />,
  whatsapp: (
    <path
      d="M12 2.6a9.3 9.3 0 0 0-8 14l-1.3 4.8 4.9-1.3A9.3 9.3 0 1 0 12 2.6Zm0 1.7a7.6 7.6 0 1 1-3.9 14.1l-.3-.2-2.9.8.8-2.8-.2-.3A7.6 7.6 0 0 1 12 4.3Zm-3.2 3.9c-.2 0-.5 0-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.2 5 4.4 2.5 1 3 .8 3.5.7.6 0 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4l-.5-.3-1.8-.9c-.3-.1-.4-.1-.6.1l-.8 1c-.2.2-.3.2-.6.1a6.3 6.3 0 0 1-3.1-2.7c-.2-.4.2-.4.7-1.3l.1-.4-.1-.3-.8-2c-.2-.5-.4-.4-.6-.4h-.5Z"
      fill="currentColor"
      stroke="none"
    />
  ),
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 20, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
