
import "@/app/globals.css";
import Hero from "@/app/(main)/components/Hero";
import FoodCategories from "@/app/(main)/components/Foodcategories";
import Todaysmenu from "@/app/(main)/components/Todaysmenu";
import HowItWorks from "@/app/(main)/components/Howitworks";
import WhyDabba from "@/app/(main)/components/Whydabba";
import OfferBanner from "@/app/(main)/components/Offerbanner";
import Testimonials from "@/app/(main)/components/Testimonials";


export default function Home() {
  return(
  <>
  <Hero />
  <FoodCategories />
  <Todaysmenu />
  <HowItWorks />
  <WhyDabba />
  <OfferBanner />
  <Testimonials />
  </> 
  )
}
  

 

 