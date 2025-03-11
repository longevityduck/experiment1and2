
import { ProgressIndicator } from "@/components/career-guidance/ProgressIndicator";
import { FormContainer } from "@/components/career-guidance/FormContainer";
import FormIntroduction from "@/components/career-guidance/FormIntroduction";
import PersonalInfoForm from "@/components/career-guidance/PersonalInfoForm";

const PersonalInfo = () => {
  return (
    <>
      <ProgressIndicator />
      <FormContainer title="Tell us about yourself">
        <div className="space-y-6">
          <FormIntroduction />
          <PersonalInfoForm />
        </div>
      </FormContainer>
    </>
  );
};

export default PersonalInfo;
