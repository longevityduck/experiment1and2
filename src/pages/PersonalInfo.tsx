
import { useEffect } from "react";
import { ProgressIndicator } from "@/components/career-guidance/ProgressIndicator";
import { FormContainer } from "@/components/career-guidance/FormContainer";
import { PersonalInfoForm } from "@/components/personal-info/PersonalInfoForm";
import { PersonalInfoIntro } from "@/components/personal-info/PersonalInfoIntro";

const PersonalInfo = () => {
  return (
    <>
      <ProgressIndicator />
      <FormContainer title="Personal Information">
        <div className="space-y-6">
          <PersonalInfoIntro />
          <PersonalInfoForm />
        </div>
      </FormContainer>
    </>
  );
};

export default PersonalInfo;
