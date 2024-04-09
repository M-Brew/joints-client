import React, { useState } from "react";

import Image from "next/image";

export default function ImageWithFallback(props: IImageWithFallback) {
  const { alt, src, sizes, style, fallbackSrc } = props;

  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      alt={alt}
      src={imgSrc}
      fill
      sizes={sizes}
      style={style}
      onError={() => {
        if (fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }}
      loading="eager"
      priority
      unoptimized
    />
  );
}

interface IImageWithFallback {
  alt: string;
  src: string;
  sizes?: string;
  style?: React.CSSProperties;
  fallbackSrc?: string;
}
