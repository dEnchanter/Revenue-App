import Image from "next/image";

export function Card({ title, value, imageSrc, imageAlt }) {
  return (
    <div className="flex flex-col content-center bg-[#189FB8]/30 max-w-xs px-3 py-3 rounded-b-lg space-y-2 md:w-[20rem]">
      <span className="text-xs text-[#095D52] font-bold">{title}</span>
      <div className="flex flex-col self-center items-center">
        <span className="text-3xl font-semibold">{value}</span>
        <span className="text-xs font-medium">Active</span>
      </div>
      <div className="self-end">
        <Image
          src={imageSrc}
          width="25"
          height="25"
          alt={imageAlt}
          className="object-contain"
        />
      </div>
    </div>
  );
}