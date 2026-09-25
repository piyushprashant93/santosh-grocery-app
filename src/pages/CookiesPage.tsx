import { TermsSection } from '../layout/TermsSection'
import { SecondaryHeader } from '../layout/SecondaryHeader';
import Footer from '../layout/Footer';
import { FileTextIcon } from 'lucide-react';

const cookiesData = {
  title: "Cookie Policy",
  lastUpdated: "January 28, 2026",
  icon: <FileTextIcon className="text-[#FF6900]" />,
  intro:
    'This policy explains how HubNepa uses cookies and similar technologies to recognize you when you visit our website.',
  sections: [
    {
      title: "What are cookies?",
      content:
        "Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.",
    },
    {
      title: "Why do we use cookies?",
      content:
        'We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties.',
    },
    {
      title: "How can I control cookies?",
      content:
        "You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject.",
    },
  ],
};
export const CookiesPage = () => {
  return (
    <>
      <SecondaryHeader />
      <TermsSection {...cookiesData} />
      <Footer />
    </>
  )
}
