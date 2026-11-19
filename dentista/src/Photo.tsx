import { photos, type PhotoId } from "./config";

// Foto responsiva: o navegador escolhe entre 800 e 1600 px conforme a tela.
export function Photo({ id, sizes, className, priority = false }: { id: PhotoId; sizes: string; className?: string; priority?: boolean }) {
  const p = photos[id];
  return (
    <img
      className={className ? `photo ${className}` : "photo"}
      src={`fotos/${id}-800.webp`}
      srcSet={`fotos/${id}-800.webp 800w, fotos/${id}-1600.webp 1600w`}
      sizes={sizes}
      width={800}
      height={Math.round((800 * p.h) / p.w)}
      alt={p.alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      {...(priority ? { fetchPriority: "high" as const } : {})}
    />
  );
}
