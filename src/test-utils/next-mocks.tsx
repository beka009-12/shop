import type { ImgHTMLAttributes } from "react";
import { vi } from "vitest";

export const routerMock = {
  push: vi.fn(),
  prefetch: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
};

export const nextNavigationMock = () => ({
  useRouter: () => routerMock,
  useParams: () => ({ id: "1" }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
});

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string };

export const nextImageMock = () => ({
  default: ({ src, alt }: ImageProps) => <img src={src} alt={alt} />,
});
