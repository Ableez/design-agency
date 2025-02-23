import { DesignJobData } from "#/types/jobs";
import {
  IconBrandFacebookFilled,
  IconBrandInstagramFilled,
  IconClock,
  IconBrandSnapchatFilled,
  IconBrandTiktokFilled,
  IconTruckDelivery,
} from "@tabler/icons-react";
import { ComponentType, ReactElement, ReactNode } from "react";

export type SelectableOption = {
  title: string;
  icon?: React.ReactNode;
  image?: string;
  description?: string;
  featured?: boolean;
  aspectRatio?: string;
};

export type DesignPlatformType =
  | "instagram"
  | "tiktok"
  | "twitter"
  | "facebook"
  | "snapchat"
  | "youtube"
  | "website"
  | "other";

export interface SocialFormState {
  size: DesignSizeType | null;
  purpose: string | null;
  platform: DesignPlatformType;
  designDeliveryOption: DesignDeliveryOptionType | null;
  sizeOptions: DesignSizeType[];
}

export type DesignSizeType = {
  id: string;
  slug: string;
  title: string;
  dimensions?: string;
  description?: string;
  aspectRatio: "1:1" | "9:16" | "4:5" | "16:9";
  unit?: "PX" | "MM" | "CM" | "IN";
  icon?: ReactNode;
  image?: string;
};

export const instagramDesignSizeOptions: DesignSizeType[] = [
  {
    id: "d1ef0686-094f-4452-8fd9-ce50d25aaba2",
    title: "Portrait",
    aspectRatio: "4:5",
    dimensions: "1080x1350",
    unit: "PX",
    image:
      "https://b4b43dszid.ufs.sh/f/wGHSFKxTYo2ewNpv49xTYo2ezVpkbt37nPSHJ9vDQUrijamM",
    slug: "portrait4:5",
  },
  {
    id: "2b723175-cb97-4b5e-ab1f-0734aadddad6",
    title: "Reels",
    aspectRatio: "9:16",
    dimensions: "1080x1920",
    unit: "PX",
    image:
      "https://b4b43dszid.ufs.sh/f/wGHSFKxTYo2eoCNUZdxhPFXtGYs41w5Dm8TZAyqceuRl63Sb",
    slug: "stories&reels:1",
  },
  {
    id: "5698633e-63a5-4dae-8cf6-dfa4ab7316d4",
    title: "Square",
    aspectRatio: "1:1",
    dimensions: "1080x1080",
    unit: "PX",
    image:
      "https://b4b43dszid.ufs.sh/f/wGHSFKxTYo2e457aSZHLgFXJ2No57qBDKUdsS0T8mcVYIhlk",
    slug: "square:1",
  },
  {
    id: "93498f2a-cbc1-4b9c-9804-5c790a43f6fe",
    title: "Landscape",
    aspectRatio: "16:9",
    dimensions: "1080x566",
    unit: "PX",
    image:
      "https://b4b43dszid.ufs.sh/f/wGHSFKxTYo2eGTLWo3lZo0getUmzP423WENbpVMDfhBAlRiF",
    slug: "landscape:1",
  },
];

export const websiteDesignSizeOptions: DesignSizeType[] = [
  {
    id: "387b6cc6-9105-4188-8c08-3bbdca7ef719",
    title: "Portrait",
    aspectRatio: "1:1",
    dimensions: "1080x566",
    unit: "PX",
    image:
      "https://b4b43dszid.ufs.sh/f/wGHSFKxTYo2eVId9wEenR487aEVXgQZGtMIvj5oHNueC0scJ",
    slug: "portrait_website",
  },
  {
    id: "f636d380-3028-4e6b-8485-af7278b0e644",
    title: "Mobile Fullscreen",
    aspectRatio: "9:16",
    dimensions: "1920x1080",
    unit: "PX",
    image:
      "https://b4b43dszid.ufs.sh/f/wGHSFKxTYo2eo7cpqMhPFXtGYs41w5Dm8TZAyqceuRl63SbW",
    slug: "mobile_fullscreen_website",
  },
  {
    id: "65a6f26a-4dcc-4c02-af99-2258ac248db6",
    title: "Website Banner",
    aspectRatio: "16:9",
    dimensions: "1080x1920",
    unit: "PX",
    image:
      "https://b4b43dszid.ufs.sh/f/wGHSFKxTYo2ercP16I3WQNCq9K2htlySGifT3MoLaePkYAcB",
    slug: "desktop_banner_website",
  },
];

export const designSizeOptions = {
  instagram: instagramDesignSizeOptions,
  tiktok: websiteDesignSizeOptions,
  twitter: instagramDesignSizeOptions,
  facebook: instagramDesignSizeOptions,
  snapchat: instagramDesignSizeOptions,
  youtube: instagramDesignSizeOptions,
  website: websiteDesignSizeOptions,
  other: instagramDesignSizeOptions,
};

export const purposeOptions: SelectableOption[] = [
  {
    image:
      "https://i.pinimg.com/474x/0b/a6/f1/0ba6f158707462f47f02b231e30dbbc1.jpg",
    title: "Promotion",
  },
  {
    image:
      "https://i.pinimg.com/736x/18/22/9a/18229ab5c6a0f488cac88e51fd80442f.jpg",
    title: "Product display",
  },
  {
    image:
      "https://i.pinimg.com/736x/f8/95/89/f895894a5535252fcf8867b136c91f1c.jpg",
    title: "Infographics",
  },
  {
    image:
      "https://i.pinimg.com/736x/2f/e0/72/2fe0721ad4f523fe132eda6c1b8d2905.jpg",
    title: "Custom idea",
  },
];

export type PlatformType = {
  id: DesignPlatformType;
  title: string;
  icon?: ReactNode;
  featured?: boolean;
};

export const platformOptions: PlatformType[] = [
  {
    id: "instagram",
    title: "Instagram",
    icon: IconBrandInstagramFilled as unknown as ReactNode,
  },
  {
    id: "website",
    title: "My Website",
    icon: IconBrandSnapchatFilled as unknown as ReactNode,
  },
  // {
  //   id: "facebook",
  //   title: "Facebook",
  //   icon: IconBrandFacebookFilled as unknown as ReactNode,
  // },
  {
    id: "tiktok",
    title: "TikTok",
    icon: IconBrandTiktokFilled as unknown as ReactNode,
  },
  // {
  //   id: "youtube",
  //   title: "YouTube",
  //   icon: IconBrandSnapchatFilled as unknown as ReactNode,
  // },
  {
    id: "other",
    title: "Others",
    icon: IconBrandSnapchatFilled as unknown as ReactNode,
  },
];

export type DesignDeliveryOptionType = {
  id: string;
  title: string;
  duration: string;
  description: string;
  durationInHours: number;
  digitalOnly?: boolean;
  price?: string;
  icon?: ComponentType<any> | ReactElement;
  featured?: boolean;
};

export const designDeliveryOptions: DesignDeliveryOptionType[] = [
  {
    title: "Standard",
    description: "Regular delivery timeline",
    duration: "In 2-3 days",
    icon: IconTruckDelivery,
    id: "standard",
    durationInHours: 48,
  },
  {
    title: "Express",
    description: "Get it right away",
    duration: "Under 24 hours",
    icon: IconTruckDelivery,
    id: "express",
    durationInHours: 24,
  },
];

export const stories = [
  "https://i.pinimg.com/736x/dc/26/c5/dc26c5d8a8b2254b4bcc5c6a48ed0eb1.jpg",
  "https://i.pinimg.com/736x/47/d8/66/47d8664e7426416888d837969a2dd832.jpg",
  "https://i.pinimg.com/736x/ec/13/39/ec/1339af7087678f6ddf653be3edd880.jpg",
  "https://b4b43dszid.ufs.sh/f/wGHSFKxTYo2ejybTJwDKA7x5dpEl9tXuZzysigv1P0HGQIoJ",
  "https://b4b43dszid.ufs.sh/f/wGHSFKxTYo2enyN1XL2Hev178sr9kRZ6205EBnYdpclV3TqW",
  "https://b4b43dszid.ufs.sh/f/wGHSFKxTYo2ezkTi5QOaGxtUsVSORL3mHE2ADC5b8dc7whl0",
  "https://b4b43dszid.ufs.sh/f/wGHSFKxTYo2eR7j6zUJyuGiFdea2YtlVjTNx7vmUkP80JKbI",
  "https://i.pinimg.com/736x/21/a1/e9/21a1e9700c2befaf7a9453600ace0292.jpg",
];

export const reelVideos = [
  {
    name: "ab5d50906702f92f53f36c74b61a1a6d.mp4",
    key: "wGHSFKxTYo2euaBgYPChv1zUsDinaPFk7Beml9HfpbGxQXCg",
    customId: null,
    url: "https://b4b43dszid.ufs.sh/f/wGHSFKxTYo2euaBgYPChv1zUsDinaPFk7Beml9HfpbGxQXCg",
    size: 1980718,
    uploadedAt: "2025-02-12T09:41:49.000Z",
  },
  {
    name: "3fd78dbe78afd13b817746f2daf1c7f5.mp4",
    key: "wGHSFKxTYo2eFuCS8uMJOP4EZBQY6fiDqmRvs1hCpGrHyTb8",
    customId: null,
    url: "https://b4b43dszid.ufs.sh/f/wGHSFKxTYo2eFuCS8uMJOP4EZBQY6fiDqmRvs1hCpGrHyTb8",
    size: 1502250,
    uploadedAt: "2025-02-12T09:41:49.000Z",
  },
  {
    name: "f45a5af0c8d5b38912a5ad7afcf2e245.mp4",
    key: "wGHSFKxTYo2eiiAHT40kchvTZMYlWVzn1i6ubCjmpULdGs3y",
    customId: null,
    url: "https://b4b43dszid.ufs.sh/f/wGHSFKxTYo2eiiAHT40kchvTZMYlWVzn1i6ubCjmpULdGs3y",
    size: 2262167,
    uploadedAt: "2025-02-12T09:41:49.000Z",
  },
  {
    name: "426508a6cdc744322242a1d65644205b_t1.mp4",
    key: "wGHSFKxTYo2eliqM8UbJYmevBPfIdTkZtEisRAxuMSy21n9L",
    customId: null,
    url: "https://b4b43dszid.ufs.sh/f/wGHSFKxTYo2eliqM8UbJYmevBPfIdTkZtEisRAxuMSy21n9L",
    size: 756582,
    uploadedAt: "2025-02-12T09:41:49.000Z",
  },
  {
    name: "c022c6406ba455b908a1735131ffc4f3.mp4",
    key: "wGHSFKxTYo2eWltbqSvr1m46CBZH8d5YhbJevRnguV72I0pN",
    customId: null,
    url: "https://b4b43dszid.ufs.sh/f/wGHSFKxTYo2eWltbqSvr1m46CBZH8d5YhbJevRnguV72I0pN",
    size: 1296711,
    uploadedAt: "2025-02-12T09:41:49.000Z",
  },
];
