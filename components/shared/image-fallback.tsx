"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";

interface ImageFallbackProps extends Omit<ImageProps, "src" | "alt"> {
  src?: string;
  alt?: string;
  fallbackSrc?: string;
}

export default function ImageFallback({
  src,
  alt = "image",
  fallbackSrc = "/placeholder.jpg",
  ...props
}: ImageFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  // Update imgSrc when src prop changes (e.g., after API data loads)
  useEffect(() => {
    if (src) {
      setImgSrc(src);
    }
  }, [src]);

  return (
    <Image
      {...props}
      src={imgSrc || fallbackSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}
