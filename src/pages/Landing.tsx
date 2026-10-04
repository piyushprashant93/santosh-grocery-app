import HeroSection from '../components/landingpage/HeroSection'

import Header from '../layout/Header'

import Footer from '../layout/Footer'

import WhyHubnepa from '../components/landingpage/WhyHubnepa'

import CTASection from '../components/landingpage/CTASection'

import ExploreSection from '../components/landingpage/ExploreSection'



export const Landing = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <ExploreSection />
      <WhyHubnepa />
      <CTASection />
      <Footer />
    </>
  )
}
