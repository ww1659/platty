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
    <div style={{ height: `${height}px`, width: "100%", marginBottom: "20px" }}>
      <Image
        src={imageSrc}
        alt={`${imageDesc}`}
        layout="responsive"
        height={height}
        width={1000}
      />
    </div>
  );
}
