import Image from "next/image";

export const CustomCard = ({ id, date, title, icon2Src, icon3Src, icon2Alt, icon3Alt, stream, icon3Color, icon2Text, icon3Text }) => {
  return (
    <div className="flex flex-col min-h-min p-5 w-[20rem] space-y-1">
      <div className="flex justify-between">
        <span className="text-[#095D52] text-sm font-bold">{id}</span>
        <span className="text-sm font-medium">{date}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium text-sm">{title}</span>
        <div className="flex items-center space-x-2">
          <span>
            <Image
              src={icon2Src}
              width={15}
              height={15}
              alt={icon2Alt}
            />
          </span>
          <span className="text-xs font-medium">{icon2Text}</span>
        </div>
      </div>
      <div className="flex justify-between pb-[1rem]">
        <span className="font-bold text-sm">{stream}</span>
        <div className="flex items-center space-x-2">
          <span>
            <Image 
              src={icon3Src}
              width={20}
              height={20}
              alt={icon3Alt}
              className={`object-contain ${icon3Color}/30`}
            />
          </span>
          <span className="text-sm font-medium text-[#189FB8]">{icon3Text}</span>
        </div>
      </div>
      <span className="flex border border-1 border-[#189FB8]/30"></span>
    </div>
  );
};
