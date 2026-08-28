import type { SVGProps } from 'react';

export function BuildIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M18 49V11C18 8.79086 19.7909 7 22 7H34C36.2091 7 38 8.79086 38 11V49" stroke="#0F9F90" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 49V39H32V49M25 18H25.01M31 18H31.01M25 26H25.01M31 26H31.01M25 34H25.01M31 34H31.01" stroke="#0F9F90" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
