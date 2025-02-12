import CarouselShowoff from "#/components/social-media-designs/carousel-showoff";
import SocialMediaDesignOptions from "#/components/social-media-designs/options";

const SocialMediaDesign = () => {
  return (
    <div className="relative h-screen overflow-x-hidden bg-white dark:bg-black">
      <CarouselShowoff />
      <SocialMediaDesignOptions />
    </div>
  );
};

export default SocialMediaDesign;
