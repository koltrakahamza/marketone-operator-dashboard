import { useId, useState } from 'react';

// One locally served atlas keeps the light, framing and background consistent.
// These pixel boundaries match the generated asset; each SVG clips one product.
const ATLAS = '/images/catalog-atlas-v2.png';
const COLUMNS = [0, 296, 591, 887];
const ROWS = [0, 282, 569, 852, 1136, 1424, 1774];

export function ProductImage({
  image,
  name,
  className = '',
}: {
  image: string;
  name: string;
  className?: string;
}) {
  const clipId = useId();
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const match = image.match(/^\/images\/catalog-atlas-v2\.png#p(\d{2})$/);
  const index = match ? Number(match[1]) - 1 : -1;
  const atlasProduct = index >= 0 && index < 18;

  if (atlasProduct && failedSource !== image) {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = COLUMNS[col] + 3;
    const y = ROWS[row] + 3;
    const width = COLUMNS[col + 1] - x - 3;
    const height = ROWS[row + 1] - y - 3;
    return (
      <svg
        className={`product-image ${className}`}
        role="img"
        aria-label={name}
        viewBox={`${x} ${y} ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        width="480"
        height="360"
      >
        <title>{name}</title>
        <defs>
          <clipPath id={clipId}>
            <rect x={x} y={y} width={width} height={height} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <image
            href={ATLAS}
            width="887"
            height="1774"
            aria-hidden="true"
            onError={() => setFailedSource(image)}
          />
        </g>
      </svg>
    );
  }

  return (
    <img
      className={`product-image ${className}`}
      src={atlasProduct ? `/images/p${match![1]}.jpg` : image}
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
