"use client";
import React, { ReactNode, useState } from "react";
import { DesignSizeType } from "./social-media-designs/data";
import Image from "next/image";
import {
  IconLayoutNavbarExpandFilled,
  IconMaximize,
} from "@tabler/icons-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";

type Props = {
  designSizeOptions: DesignSizeType[];
  label: string;
  onSelect: (option: DesignSizeType) => void;
  selectedOption: DesignSizeType | null;
};

const DesignSizeOptionPicker = ({
  designSizeOptions,
  onSelect,
  selectedOption,
  label,
}: Props) => {
  const [localSelectedOption, setLocalSelectedOption] = useState<string | null>(
    null,
  );

  const handleOptionClick = (option: string) => {
    setLocalSelectedOption(option);
  };

  return (
    <div className={`flex flex-col gap-2 transition-all duration-300 ease-out`}>
      <h4 className="pl-2 text-xs font-medium dark:text-neutral-600">
        {label ?? "Choose aspect ratio"}
      </h4>
      <div className="columns-2 gap-2 rounded-xl p-2 dark:bg-neutral-950 sm:columns-3">
        {designSizeOptions.map((option) => (
          <button
            key={option.title}
            className={`relative mb-2 flex h-fit w-full break-inside-avoid flex-col place-items-center justify-start gap-2 rounded-xl p-2 ring-2 ${
              localSelectedOption === option.id ||
              selectedOption?.id === option.id
                ? "ring-4 ring-blue-500 dark:hover:ring-blue-500"
                : "ring-transparent"
            } dark:bg-neutral-900`}
            onClick={() => {
              handleOptionClick(option.id);
              onSelect(option);
            }}
          >
            <Dialog>
              <DialogTrigger asChild>
                <button className="absolute right-0 top-0 rounded-full p-2 hover:bg-white/10 dark:hover:bg-black/20">
                  <IconMaximize width={20} color="#aaa" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle></DialogTitle>
                <Image
                  src={
                    option.image ??
                    "https://b4b43dszid.ufs.sh/f/wGHSFKxTYo2ewNpv49xTYo2ezVpkbt37nPSHJ9vDQUrijamM"
                  }
                  alt={"Full screen view"}
                  width={800}
                  height={800}
                  className="max-h-[85dvh] w-full object-scale-down"
                  priority={true}
                />
              </DialogContent>
            </Dialog>

            <div className="h-44 w-full overflow-clip rounded-xl bg-[#ccd5ff] p-2 dark:bg-[#ccd5ff11]">
              <Image
                src={
                  option.image ??
                  "https://b4b43dszid.ufs.sh/f/wGHSFKxTYo2ewNpv49xTYo2ezVpkbt37nPSHJ9vDQUrijamM"
                }
                alt={"Eg"}
                width={600}
                height={600}
                className="h-full w-full object-contain"
              />
            </div>
            <h4 className={"text-xs font-semibold dark:text-neutral-400"}>
              <span className="text-[9.5px] font-bold uppercase">
                {option.title}
              </span>
              <span className="mx-1 text-[9.5px] font-medium">•</span>
              <span className="text-[9.5px] font-medium">
                {option.dimensions}
              </span>
              <span className="mx-1 text-[9.5px] font-medium">•</span>
              <span className="text-[9.5px] font-medium lowercase">
                {option.unit}
              </span>
            </h4>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DesignSizeOptionPicker;
