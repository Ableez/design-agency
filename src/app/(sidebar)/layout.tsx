import Header from "#/components/header";
import React, { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const SidebarLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col overflow-x-scroll md:flex-row">
      <Header />
      <div className="sticky top-0 hidden h-screen w-[7%] border-r border-r-neutral-800 transition-all duration-300 ease-in-out md:visible"></div>
      <div className="w-full">{children}</div>
    </div>
  );
};

export default SidebarLayout;
