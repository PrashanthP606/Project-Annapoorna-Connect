// src/pages/HowItWorksPage.tsx
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const HowItWorksPage = () => (
  <main className="min-h-screen pt-20"> {/* pt-20 pushes content under navbar if you use one */}
    <HowItWorks />
    <Footer />
  </main>
);

export default HowItWorksPage;
