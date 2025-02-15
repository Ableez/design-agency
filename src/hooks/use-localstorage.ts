import { BrandSelect } from "#/server/db/schema-types";
import { useEffect, useState } from "react";

type FormDataState = {
  description: string;
  images: ImageData[];
  selectedBrand: BrandSelect | null;
  deliveryEmail: string | null;
};

export const useFormLocalStorage = (
  key: string,
  initialValue: FormDataState,
) => {
  const [state, setState] = useState<FormDataState>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (error) {
      console.error("Error loading form data:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
};
