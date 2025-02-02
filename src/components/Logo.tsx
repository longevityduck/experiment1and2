import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 bg-primary rounded-lg transform rotate-45"></div>
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">S</div>
      </div>
      <span className="text-2xl font-bold text-primary">SkillSpire</span>
    </div>
  );
};

export default Logo;