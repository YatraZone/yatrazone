import AboutUsSection from "@/components/AboutUsSection";
import Banner from "@/components/Banner";
import Destination from "@/components/Destination";
import GoToTop from "@/components/GoToTop";
import HeroSection from "@/components/HeroSection";
import InstaBlog from "@/components/InstaBlog";
import RandomTourPackageSection from "@/components/RandomTourPackageSection";
import SearchSection from "@/components/SearchSection";

export default async function Home() {
  return (
    <>
      <HeroSection />
      <SearchSection />
      <AboutUsSection />
      <RandomTourPackageSection />
      <Banner />
      <Destination/>
      <InstaBlog/>
      <GoToTop />
    </>
  );
}
