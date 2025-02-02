import { ProgressIndicator } from "./ProgressIndicator";

interface FormContainerProps {
  title: string;
  children: React.ReactNode;
}

export const FormContainer = ({ title, children }: FormContainerProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <ProgressIndicator />
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};