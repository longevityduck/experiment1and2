
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const MeetTheTeam = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/80 to-white">
      <Header />
      <main className="px-4 py-8 sm:py-12 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <Button
              variant="outline"
              onClick={() => navigate('/introduction')}
              className="mb-4"
            >
              ← Back to Introduction
            </Button>
            
            <h1 className="text-3xl font-semibold text-gray-800 text-center mb-8">
              Meet Our Team
            </h1>
            
            <div className="space-y-6">
              <div className="text-center">
                <img
                  src="/path-to-coach-image.jpg"
                  alt="Career Coach Max Hamilton"
                  className="mx-auto rounded-lg shadow-md mb-4 max-w-md"
                />
                <h2 className="text-xl font-semibold text-gray-800">
                  Career Coach - Max Hamilton
                </h2>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MeetTheTeam;
