export function ProductImage({
  image,
  name,
  className = '',
}: {
  image: string;
  name: string;
  className?: string;
}) {
  return (
    <img
      className={className}
      src={image}
      alt={name}
      loading="lazy"
      width="480"
      height="360"
      onError={(event) => {
        if (!event.currentTarget.src.endsWith('/images/fallback.svg'))
          event.currentTarget.src = '/images/fallback.svg';
      }}
    />
  );
}
