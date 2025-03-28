
export interface ClarifyingQuestion {
  id: string;
  text: string;
}

export interface GuidanceQuestion {
  id: number;
  text: string;
  options: string[];
}

export interface CareerInfo {
  personalInfo?: Record<string, string>;
  skills?: string[];
  careerGoals?: string;
  guidanceAnswers?: Record<number, string>;
  clarificationAnswers?: Record<string, string>;
  desiredJob?: string;
  confidenceLevel?: number;
  readinessLevel?: number;
  feelingAboutCareerGoal?: string;
  customFeeling?: string;
  age?: string;
  occupation?: string;
  industry?: string;
  experience?: string;
}
