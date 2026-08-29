import type { SVGProps } from 'react';

export function BuildIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} fill="none" {...props}>
      <path
        stroke="#0D9488"
        strokeLinecap="round"
        strokeWidth={2}
        d="M24 20h.02M24 28h.02M24 12h.02M32 20h.02M32 28h.02M32 12h.02M16 20h.02M16 28h.02M16 12h.02M18 44.001v-6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6M12 3.999H36a4 4 0 0 1 4 4V40a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Z"
      />
    </svg>
  );
}
