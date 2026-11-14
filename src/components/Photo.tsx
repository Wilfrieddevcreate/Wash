import Image from 'next/image';

export default function Photo({ src, alt = '', width = 800, height = 600, priority, className }: { src: string; alt?: string; width?: number; height?: number; priority?: boolean; className?: string }) {
  return <Image src={src} alt={alt} width={width} height={height} priority={priority} className={className} sizes="(max-width: 760px) 100vw, 50vw" />;
}
