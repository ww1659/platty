import Image from "next/image";

type UnsplashImageProps = {
  imageSrc: string;
  imageDesc: string;
  height: number;
};

export function UnsplashImage({
  imageSrc,
  imageDesc,
  height,
}: UnsplashImageProps) {
  return (
    <Image
      src={imageSrc}
      alt={`${imageDesc}`}
      height={height}
      width={1000}
      className="rounded-lg"
    />
  );
}
