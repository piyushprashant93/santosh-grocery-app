import { TermsSection } from '../layout/TermsSection'
import { SecondaryHeader } from '../layout/SecondaryHeader';
import Footer from '../layout/Footer';
import { Shield } from "lucide-react";

const privacyPolicyData = {
  title: "Privacy Policy",
  lastUpdated: "January 28, 2026",
  icon: <Shield className="text-[#155DFC]" />,
  intro:
    "Your privacy is critically important to us. This policy details how we collect, use, and protect your personal information when you use HubNepa.",

  sections: [
    {
      title: "Information We Collect",
      list: [
        {
          label: "Personal Information",
          text: "Name, email address, phone number, delivery address.",
        },
        {
          label: "Payment Information",
          text: "Credit card details (encrypted and processed by secure third-party providers).",
        },
        {
          label: "Usage Data",
          text: "Information on how you interact with our website and app.",
        },
      ],
    },
    {
      title: "How We Use Your Information",
      content:
        "We use the information we collect to process your orders, communicate with you, improve our services, and detect and prevent fraud.",
    },
    {
      title: "Data Security",
      content:
        "We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights.",
    },
  ],
};

import { useState, useEffect } from "react";

export const PolicyPage = () => {
  const [data, setData] = useState(privacyPolicyData);

  useEffect(() => {
    fetch("https://mr-santosh-grocery-backend.onrender.com/api/v1/public/policy")
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setData({ ...privacyPolicyData, ...json.data });
        }
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <SecondaryHeader />
      <TermsSection {...data} />
      <Footer />
    </>
  )
}
