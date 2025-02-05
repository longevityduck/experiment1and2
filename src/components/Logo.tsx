import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0">
          {/* Main star shape */}
          <div className="absolute inset-0 bg-primary transform rotate-45">
            <div className="absolute inset-0 transform -rotate-45">
              <div className="w-full h-full animate-pulse">
                {/* Star points */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary transform -translate-y-1/2 rotate-45"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary transform translate-y-1/2 rotate-45"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary transform -translate-x-1/2 rotate-45"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary transform translate-x-1/2 rotate-45"></div>
              </div>
            </div>
          </div>
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
      <span className="text-2xl font-bold text-primary">Own Goal</span>
    </div>
  );
};

export default Logo;