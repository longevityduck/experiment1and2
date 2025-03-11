
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { storage } from "@/utils/storage";
import { supabase } from "@/integrations/supabase/client";
import { CareerInfo } from "@/types/career";
import { toast } from "sonner";

const SavedResults = () => {
  const [loading, setLoading] = useState(true);
  const [careerInfo, setCareerInfo] = useState<CareerInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      setLoading(true);
      try {
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
        
        if (user) {
          // Try to load from Supabase first
          const supabaseData = await storage.getCareerInfoFromSupabase();
          if (supabaseData) {
            setCareerInfo(supabaseData);
          } else {
            // Fall back to local storage
            const localData = storage.getCareerInfo();
            if (Object.keys(localData).length > 0) {
              setCareerInfo(localData);
              // Save local data to Supabase
              await storage.saveCareerInfo(localData);
              toast.success("Synced local data to your account");
            }
          }
        } else {
          // Not authenticated, just use local storage
          const localData = storage.getCareerInfo();
          if (Object.keys(localData).length > 0) {
            setCareerInfo(localData);
          }
        }
      } catch (error) {
        console.error("Error loading saved results:", error);
        toast.error("Failed to load your saved results");
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthAndLoadData();
  }, []);

  if (loading) {
    return (
      <div className="container py-10 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-1/3 mb-6" />
        <div className="space-y-6">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!careerInfo || Object.keys(careerInfo).length === 0) {
    return (
      <div className="container py-10 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Saved Results</h1>
        <Card>
          <CardHeader>
            <CardTitle>No saved results found</CardTitle>
            <CardDescription>
              You haven't completed any career assessments yet.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link to="/">
              <Button>Start Career Assessment</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Saved Results</h1>
        <div className="space-x-4">
          <Link to="/">
            <Button variant="outline">Start New Assessment</Button>
          </Link>
          {isAuthenticated ? (
            <Button variant="outline" className="text-red-500 hover:text-red-700" 
              onClick={async () => {
                if (confirm("Are you sure you want to delete your saved results?")) {
                  await storage.resetAllResponses();
                  toast.success("Results deleted successfully");
                  setCareerInfo(null);
                }
              }}
            >
              Delete Results
            </Button>
          ) : (
            <Button variant="secondary">
              Sign in to save results
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Age</dt>
                <dd className="mt-1 text-lg">{careerInfo.age || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Occupation</dt>
                <dd className="mt-1 text-lg">{careerInfo.occupation || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Industry</dt>
                <dd className="mt-1 text-lg">{careerInfo.industry || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Experience</dt>
                <dd className="mt-1 text-lg">{careerInfo.experience ? `${careerInfo.experience} years` : "Not provided"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Career Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Career Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              {careerInfo.careerGoals || "No career goals specified"}
            </p>
          </CardContent>
        </Card>

        {/* Confidence Assessment */}
        <Card>
          <CardHeader>
            <CardTitle>Confidence Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-md font-medium">Confidence in determining next career steps</h3>
                <div className="flex items-center mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(careerInfo.confidenceLevel || 0) * 10}%` }}
                    ></div>
                  </div>
                  <span className="ml-4 text-lg font-medium">{careerInfo.confidenceLevel || 0}/10</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium">Readiness to take next career step</h3>
                <div className="flex items-center mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${(careerInfo.readinessLevel || 0) * 10}%` }}
                    ></div>
                  </div>
                  <span className="ml-4 text-lg font-medium">{careerInfo.readinessLevel || 0}/10</span>
                </div>
              </div>
              
              {careerInfo.feelingAboutCareerGoal && (
                <div className="mt-4">
                  <h3 className="text-md font-medium">Feelings about career goals</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {careerInfo.feelingAboutCareerGoal.split(", ").map((feeling, index) => (
                      <li key={index}>{feeling}</li>
                    ))}
                  </ul>
                  {careerInfo.customFeeling && (
                    <div className="mt-2 pl-5">
                      <p className="italic">{careerInfo.customFeeling}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Guidance Answers */}
        {careerInfo.guidanceAnswers && Object.keys(careerInfo.guidanceAnswers).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Career Guidance Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(careerInfo.guidanceAnswers).map(([questionId, answer]) => (
                  <AccordionItem key={questionId} value={questionId}>
                    <AccordionTrigger>
                      Question {questionId}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mt-2">{answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SavedResults;
