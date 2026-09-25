import { TermsSection } from '../layout/TermsSection'
import { SecondaryHeader } from '../layout/SecondaryHeader';
import Footer from '../layout/Footer';
import { Scale } from 'lucide-react';

const disputeData = {
  title: "Dispute Resolution",
  lastUpdated: "January 28, 2026",
  icon: <Scale className="text-[#FB2C36]" />,
  intro:
    'We are committed to resolving disputes fairly and efficiently. This policy outlines the process for addressing concerns.',
  sections: [
    {
      title: "Initial Contact",
      content:
        "If a dispute arises from or relates to this contract or the breach thereof, and if the dispute cannot be settled through direct discussions, the parties agree to endeavor first to settle the dispute in an amicable manner by mediation.",
    },
    {
      title: "Formal Complaint",
      content:
        'If the matter is not resolved through initial contact, please submit a formal complaint via our Support Center. We will acknowledge receipt of your complaint within 2 business days.',
    },
    {
      title: "Arbitration",
      content:
        "Any unresolved controversy or claim arising out of or relating to this contract, or the breach thereof, shall be settled by arbitration administered by the American Arbitration Association in accordance with its Commercial Arbitration Rules.",
    },
  ],
};
export const DisputePage = () => {
  return (
    <>
      <SecondaryHeader />
      <TermsSection {...disputeData} />
      <Footer />
    </>
  )
}
