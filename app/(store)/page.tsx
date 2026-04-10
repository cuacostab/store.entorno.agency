import { Hero } from "@/components/landing/Hero";
import { FeaturedCategories } from "@/components/landing/FeaturedCategories";
import { FeaturedBrands } from "@/components/landing/FeaturedBrands";
import { Cta } from "@/components/landing/Cta";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <FeaturedBrands />
      <Cta />
    </>
  );
}
