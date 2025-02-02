import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";

interface FormContainerProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export const FormContainer = ({
  children,
  title,
  description,
}: FormContainerProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 relative">
      <Header />
      <div className="max-w-2xl mx-auto pt-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">{title}</CardTitle>
            {description && (
              <p className="text-muted-foreground text-center">{description}</p>
            )}
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </div>
  );
};