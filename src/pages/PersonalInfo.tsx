
import { ProgressIndicator } from "@/components/career-guidance/ProgressIndicator";
import { FormContainer } from "@/components/career-guidance/FormContainer";
import FormIntroduction from "@/components/career-guidance/FormIntroduction";
import PersonalInfoForm from "@/components/career-guidance/PersonalInfoForm";

const PersonalInfo = () => {
  return (
    <>
      <ProgressIndicator />
      <FormContainer title="Let's get to know you better">
        <div className="space-y-6">
          <FormIntroduction />
          <PersonalInfoForm />
        </div>
      </FormContainer>
    </>
  );
};

export default PersonalInfo;
