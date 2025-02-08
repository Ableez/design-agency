import { IconPaletteFilled } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

interface Job {
  title: string;
  color: string;
  link: string;
}

const jobs: Job[] = [
  {
    title: "Social media design",
    color: "#4CD964",
    link: "social-media-design",
  },
  {
    title: "Packaging supply",
    color: "#FF9500",
    link: "packaging",
  },
  {
    title: "Product design",
    color: "#007AFF",
    link: "product-design",
  },
  {
    title: "Stationaries & Merc",
    color: "#5856D6",
    link: "stationaries-and-merch",
  },
];

const Services = () => {
  return (
    <div className="flex w-full flex-col gap-2 px-6 py-4">
      {jobs.map((job) => (
        <Link href={`/${job.link}`} key={job.title}>
          <div
            className={`[32px] flex w-full cursor-pointer place-items-center justify-center gap-6 rounded-3xl bg-neutral-800/50 p-6 align-middle ring-2 ring-transparent transition-all duration-300 ease-in-out hover:scale-[0.98] hover:ring-blue-600/40`}
          >
            <div className="flex w-full place-items-center justify-start gap-4 align-middle">
              <IconPaletteFilled color={job.color} />
              <h4>{job.title}</h4>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Services;
