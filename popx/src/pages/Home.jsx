import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authStorage } from "../lib/auth";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (authStorage.getToken()) {
      navigate("/account", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    // Prefetch auth pages so button navigation feels instant.
    import("./Signin.jsx");
    import("./Signup.jsx");
  }, []);

  return (
    <div className="w-screen h-screen bg-[#f5f5f5] flex items-center justify-center overflow-hidden">
      <div className="w-full md:w-[400px] h-screen bg-[#f7f7f7] border border-gray-300 relative p-6 mb-10">
        {/* Content */}
        <div className="absolute bottom-12 left-6 right-6">
          <div className="mb-10">
            <h1 className="text-[38px] font-bold text-[#1d1d1d] leading-[60px] tracking-[-0.5px]">
              Welcome to PopX
            </h1>

            <p className="text-[#7d7d7d] text-[18px] mt-5 mb-10 leading-[26px] font-medium">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </p>
          </div>
          

          {/* Buttons Container */}
          <div className="mt-16 flex flex-col gap-4">
            {/* Create Account Button */}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="w-full h-[56px] rounded-[8px] bg-[#6C25FF] text-white font-semibold text-[18px] hover:bg-[#5a1fe0] transition duration-300 cursor-pointer"
            >
              Create Account
            </button>

            {/* Login Button */}
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="w-full h-[56px] rounded-[8px] bg-[#cebafc] text-[#1d1d1d] font-semibold text-[18px] hover:bg-[#bea5fa] transition duration-300 cursor-pointer"
            >
              Already Registered? Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
