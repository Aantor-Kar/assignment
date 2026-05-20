import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authStorage, signinUser } from "../lib/auth";

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (authStorage.getToken()) {
      navigate("/account", { replace: true });
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const session = await signinUser(formData);
      authStorage.saveSession(session);
      toast.success("Signed in successfully");
      navigate("/account", { replace: true });
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex justify-center overflow-hidden">
      <div className="w-full md:w-[468px] h-screen bg-[#f7f8fa] pt-12">
        <div className="mx-auto w-full max-w-[375px] px-2">
          <h1 className="text-[34px] font-bold leading-[50px] text-[#111827]">
            Signin to your
            <br />
            PopX account
          </h1>

          <p className="mt-[14px] text-[18px] font-medium leading-[28px] text-[#777777]">
            Lorem ipsum dolor sit amet,
            <br />
            consectetur adipiscing elit,
          </p>

          <form className="mt-[31px] flex flex-col" onSubmit={handleSubmit}>
            <fieldset className="relative h-[50px] rounded-[6px] border border-[#c8c8c8]">
              <legend className="ml-[14px] px-1 text-[16px] leading-none text-[#6C25FF]">
                Email Address
              </legend>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
                className="h-full w-full bg-transparent px-5 pb-[9px] text-[20px] font-normal text-[#222222] outline-none placeholder:text-[#777777]"
              />
            </fieldset>

            <fieldset className="relative mt-[22px] h-[50px] rounded-[6px] border border-[#c8c8c8] mb-[22px]">
              <legend className="ml-[14px] px-1 text-[16px] leading-none text-[#6C25FF]">
                Password
              </legend>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
                className="h-full w-full bg-transparent px-5 pb-[9px] text-[20px] font-normal text-[#222222] outline-none placeholder:text-[#777777]"
              />
            </fieldset>

            {error && (
              <p className="mb-1 text-[14px] font-semibold text-[#dd2c2c]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-[33px] h-[55px] w-full rounded-[7px] bg-fuchsia-700 text-[19px] font-bold text-white transition duration-300 hover:bg-fuchsia-800 disabled:cursor-not-allowed disabled:bg-fuchsia-400 cursor-pointer"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
