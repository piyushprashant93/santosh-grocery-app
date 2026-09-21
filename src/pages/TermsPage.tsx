import { TermsSection } from '../layout/TermsSection'
import { SecondaryHeader } from '../layout/SecondaryHeader'

const termsData = {
  title: "Terms of Service",
  lastUpdated: "January 28, 2026",
  intro:
    'Welcome to HubNepa. By accessing or using our website, mobile application, or any other services (collectively, the "Services"), you agree to be bound by these Terms of Service.',
  sections: [
    {
      title: "Acceptance of Terms",
      content:
        "By accessing and using our Services, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.",
    },
    {
      title: "Membership Eligibility",
      content:
        "Membership is limited to individuals who are eighteen (18) years of age or older. By using the Services, you represent and warrant that you are at least 18 years old and that you have the right, authority, and capacity to enter into this Agreement.",
    },
    {
      title: "Account Security",
      content:
        "You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password.",
    },
    {
      title: "Payment Terms",
      content:
        "HubNepa accepts various forms of payment. You agree to pay all charges incurred by you or any users of your account and credit card (or other applicable payment mechanism) at the prices in effect when such charges are incurred.",
    },
  ],
};
import { useState, useEffect } from "react";

export const TermsPage = () => {
  const [data, setData] = useState(termsData);

  useEffect(() => {
    fetch("https://mr-santosh-grocery-backend.onrender.com/api/v1/public/terms")
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setData({ ...termsData, ...json.data });
        }
      })
      .catch(console.error);
  }, []);
  return (
    <>
      <SecondaryHeader />
      <TermsSection {...data} />
    </>
  )
}
