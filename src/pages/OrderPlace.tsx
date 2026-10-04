import Header from '../layout/Header'

import Footer from '../layout/Footer'

import HeroSection from '../components/orderplace/HeroSection'

import PricingPlans from '../components/orderplace/PricingPlans'

import EcosystemSection from '../components/orderplace/EcosystemSection'

import InsightsSection from '../components/orderplace/InsightsSection'

import GetStartedSection from '../components/orderplace/GetStartedSection'

import SecondaryFooter from '../layout/SecondaryFooter'

import RestaurantsHeader from '../layout/RestaurantsHeader'



export const OrderPlace = () => {
  return (
    <>
      <RestaurantsHeader />
      <HeroSection />
      <PricingPlans />
      <EcosystemSection />
      <InsightsSection />
      <GetStartedSection />
      <SecondaryFooter />
    </>
  )
}
