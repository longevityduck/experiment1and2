import Logo from "./Logo";

const Header = () => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
      <Logo />
    </div>
  );
};

export default Header;