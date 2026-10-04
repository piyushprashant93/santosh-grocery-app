import { useState } from "react";
import Header from '../layout/Header'

import Footer from '../layout/Footer'

import HeroSection from '../components/restaurants/HeroSection'

import RestaurantGrid from '../components/restaurants/RestaurantGrid'

import RestaurantPartnershipCTA from '../components/restaurants/RestaurantPartnershipCTA'



export const Restaurant = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Header />
      <HeroSection onSearch={setSearchQuery} />
      <RestaurantGrid searchQuery={searchQuery} onClearSearch={() => setSearchQuery("")} />
      <RestaurantPartnershipCTA />
      <Footer />
    </>
  )
}