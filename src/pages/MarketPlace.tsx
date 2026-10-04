import { useState } from "react";
import Header from '../layout/Header'

import Footer from '../layout/Footer'

import HeroSection from '../components/marketplace/HeroSection'

import FeaturedProducts from '../components/marketplace/FeaturedProducts'



export const MarketPlace = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Header />
      <HeroSection onSearch={setSearchQuery} />
      <FeaturedProducts searchQuery={searchQuery} />
      <Footer />
    </>
  )
}