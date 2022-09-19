import Image from 'next/image';
import NoImageIconStr from "../icons/noimagestr";

const LazyImage = ({ src, width, height, alt = '', className = '' }) => {

  const toBase64 = (str) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

  return (
    <Image
      className={className}
      src={src}
      width={width}
      height={height}
      placeholder='blur' 
      blurDataURL={`data:image/svg+xml;base64,${toBase64(NoImageIconStr)}`}
      alt={alt}
    />
  )
}

export default LazyImage;