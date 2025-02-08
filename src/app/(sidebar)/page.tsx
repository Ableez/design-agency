import FeaturesCarousel from "#/components/home/features-carousel";
import HomeHero from "#/components/home/hero";
import Testimonials from "#/components/home/testimonials";
import WorksCards from "#/components/home/works-cards";
import React from "react";

const Home = () => {
  return (
    <div className="dark:bg-black bg-white">
      <HomeHero />
      <div className="my-10 border-b border-dashed border-neutral-200 py-10 dark:border-neutral-800">
        <WorksCards />
      </div>
      <div className="my-10 border-b border-dashed border-neutral-200 py-10 dark:border-neutral-800">
        <FeaturesCarousel />
      </div>
      <div className="my-8 border-b border-dashed border-neutral-200 py-8 dark:border-neutral-800">
        <Testimonials />
      </div>
    </div>
  );
};

export default Home;
