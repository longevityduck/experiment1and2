import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FormContainer } from "@/components/career-guidance/FormContainer";
import Header from "@/components/Header";

const TermsOfUse = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <Header />
      <FormContainer title="Terms of Use">
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-gray-700">
              Welcome to North Star Career Guidance. By accessing and using our services, you agree to be bound by these Terms of Use. Our platform is designed to provide career guidance and support, helping individuals navigate their professional journey. We strive to provide accurate and helpful information, but all guidance should be considered advisory in nature and should not be the sole basis for making career decisions.
            </p>
            <p className="text-gray-700">
              The content and materials available through North Star are protected by intellectual property laws and are the exclusive property of North Star and its licensors. While using our services, you agree to provide accurate information and to use the platform responsibly. We reserve the right to modify, suspend, or terminate access to our services at any time for any reason. Your privacy and data protection rights are outlined in our Privacy Policy, which should be read in conjunction with these Terms of Use.
            </p>
          </div>
          <div className="flex justify-center">
            <Button onClick={() => navigate(-1)}>Back</Button>
          </div>
        </div>
      </FormContainer>
    </div>
  );
};

export default TermsOfUse;