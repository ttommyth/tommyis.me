import Image from 'next/image';
import { PiArrowBendLeftUpBold } from 'react-icons/pi';
// Render the default Next.js 404 page when a route
// is requested that doesn't match the middleware and
// therefore doesn't have a locale associated with it.

export default function NotFound() {
  return (
    <div className="h-[100dvh] w-full flex  flex-col items-center justify-center gap-8 relative">
      <span className="absolute top-appbar left-0 text-xs flex items-end ml-8 lg:-ml-16">
        <PiArrowBendLeftUpBold className="w-icon h-icon inline-block mb-1" />
        Click here to back to homepage
      </span>
      <Image
        src="/image/404_not_found.png"
        alt={'not found'}
        width={0}
        height={0}
        sizes="100vw"
        className="w-auto h-64"
      />
      <h1 className="text-xl ">Page Not Found</h1>
    </div>
  );
}
