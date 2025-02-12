"use client";
import { IconStarsFilled, IconTruckDelivery } from "@tabler/icons-react";
import React, { ReactNode, useState } from "react";
import { DeliveryOptionType } from "./social-media-designs/data";

type Props = {
  deliveryOptions: DeliveryOptionType[];
  onSelect: (option: string) => void;
  selectedOption: string | null;
};

const DeliveryOptionPicker = ({
  deliveryOptions,
  onSelect,
  selectedOption,
}: Props) => {
  const [localSelectedOption, setlocalSelectedOption] = useState<string | null>(
    null,
  );

  const handleOptionClick = (option: string) => {
    setlocalSelectedOption(option);
    onSelect(option);
  };

  return (
    <div className="flex flex-col gap-2">
      <h4 className="pl-2 text-xs font-medium dark:text-neutral-600">
        How fast do you need it?
      </h4>
      <div className="grid grid-rows-2 gap-4">
        {deliveryOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.title}
              className={`relative flex w-full place-items-start gap-4 rounded-2xl ${
                localSelectedOption === option.id ||
                selectedOption === option.id
                  ? "ring-4 ring-blue-500 dark:hover:ring-blue-500"
                  : "ring-transparent"
              } px-6 py-4 dark:bg-neutral-900 dark:hover:ring-blue-600/40`}
              onClick={() => handleOptionClick(option.id)}
            >
              {/* {Icon && (typeof Icon === "function" ? <Icon /> : Icon)} */}
              <IconTruckDelivery color="#008aff" />
              <div className="flex flex-col text-left">
                <h4>{option.title}</h4>
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

export default DeliveryOptionPicker;
