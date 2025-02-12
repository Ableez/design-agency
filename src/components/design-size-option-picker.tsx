"use client";
import React, { ReactNode, useState } from "react";
import { DesignSizeType } from "./social-media-designs/data";

type Props = {
  designSizeOptions: DesignSizeType[];
  label: string;
  onSelect: (option: string) => void;
  selectedOption: string | null;
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
    onSelect(option);
  };

  return (
    <div className="flex flex-col gap-2">
      <h4 className="pl-2 text-xs font-medium dark:text-neutral-600">
        {label ?? "Choose aspect ratio"}
      </h4>
      <div className="flex gap-4">
        {designSizeOptions.map((option) => (
          <button
            key={option.title}
            className={`grid w-full grid-rows-2 place-items-center gap-1 rounded-2xl pt-6 align-middle ring-2 ${
              localSelectedOption === option.id ||
              selectedOption === option.id
                ? "ring-4 ring-blue-500 dark:hover:ring-blue-500"
                : "ring-transparent"
            } dark:bg-neutral-900 dark:hover:ring-blue-600/40`}
            onClick={() => handleOptionClick(option.id)}
          >
            <div
              className={`w-16 rounded-[4px] border-2 border-dashed dark:border-neutral-700`}
            />
            <h4 className={"text-sm dark:text-neutral-400"}>{option.title}</h4>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DesignSizeOptionPicker;
