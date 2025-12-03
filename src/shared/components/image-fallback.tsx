"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface ImageFallbackProps extends Omit<ImageProps, "src" | "alt"> {
  src?: string;
  alt?: string;
  fallbackSrc?: string;
}

export default function ImageFallback({
  src,
  alt = "image",
  fallbackSrc = "/fallback.jpg",
  ...props
}: ImageFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  return (
    <Image
      {...props}
      src={imgSrc || fallbackSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}
