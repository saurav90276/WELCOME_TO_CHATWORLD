const AuthImagePattern = ({ title, subtitle, img}) => {
  return <>
  <div className="hidden lg:flex items-center justify-center p-12 ">
    <div className="max-w-md text-center">
    {/* GRID PATTERN */}
      <div>
        <img src={img} alt="login" />
      </div>
      <h2 className="text-transparent text-3xl font-bold mb-4 bg-clip-text bg-gradient-to-r from-red-300 to-gray-300">{title}</h2>
      <p className="text-slate-200 ">{subtitle}</p>
    </div>
  </div>
  </>;
};

export default AuthImagePattern;