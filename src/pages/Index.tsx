import Logo from "../components/Logo";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center space-y-8">
        <Logo />
        <div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Your Career Journey</h1>
          <p className="text-xl text-gray-600">Let us be your North Star in finding your perfect career path</p>
        </div>
      </div>
    </div>
  );
};

export default Index;