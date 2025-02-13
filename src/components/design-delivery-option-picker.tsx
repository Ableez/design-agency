"use client";
import { IconStarsFilled, IconTruckDelivery } from "@tabler/icons-react";
import React, { useState } from "react";
import { DesignDeliveryOptionType } from "./social-media-designs/data";

type Props = {
  designDeliveryOptions: DesignDeliveryOptionType[];
  onSelect: (option: DesignDeliveryOptionType) => void;
  selectedOption: DesignDeliveryOptionType | null;
};

const DesignDeliveryOptionPicker = ({
  designDeliveryOptions,
  onSelect,
  selectedOption,
}: Props) => {
  const [localSelectedOption, setlocalSelectedOption] =
    useState<DesignDeliveryOptionType | null>(null);

  const handleOptionClick = (option: DesignDeliveryOptionType) => {
    setlocalSelectedOption(option);
    onSelect(option);
  };

  return (
    <div className="flex flex-col gap-2">
      <h4 className="pl-2 text-xs font-medium dark:text-neutral-600">
        How fast do you need it?
      </h4>
      <div className="grid grid-rows-2 gap-4">
        {designDeliveryOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.title}
              className={`relative flex w-full place-items-start gap-4 rounded-2xl ${
                localSelectedOption?.id === option.id ||
                selectedOption?.id === option.id
                  ? "ring-4 ring-blue-500 dark:hover:ring-blue-500"
                  : "ring-transparent"
              } px-6 py-4 dark:bg-neutral-900 dark:hover:ring-blue-600/40`}
              onClick={() => handleOptionClick(option)}
            >
              {/* {Icon && (typeof Icon === "function" ? <Icon /> : Icon)} */}
              <IconTruckDelivery color="#008aff" />
              <div className="flex flex-col text-left">
                <h4 className="text-sm font-medium">{option.title}</h4>
                <h4 className="text-xs text-neutral-500">
                  {option.description}
                </h4>
              </div>
              {option.featured && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <IconStarsFilled color="#eb0" size={16} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DesignDeliveryOptionPicker;
