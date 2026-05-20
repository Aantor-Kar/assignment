import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authStorage, signupUser } from "../lib/auth";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    companyName: "",
    isAgency: true,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fields = [
    { label: "Full Name", name: "fullName", type: "text" },
    { label: "Phone number", name: "phone", type: "tel" },
    { label: "Email address", name: "email", type: "email" },
    { label: "Password", name: "password", type: "password" },
    { label: "Company name", name: "companyName", type: "text", required: false },
  ];

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
      const session = await signupUser(formData);
      authStorage.saveSession(session);
      toast.success("Account created successfully");
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
      <div className="relative h-screen w-full bg-[#f7f8fa] pt-[6px] md:w-[468px]">
        <div className="mx-auto w-full max-w-[390px] px-5">
          <h1 className="text-[34px] font-bold leading-[53px] text-[#111827]">
            Create your
            <br />
            PopX account
          </h1>

          <form className="mt-[34px] flex flex-col" onSubmit={handleSubmit}>
            {fields.map((field, index) => (
              <fieldset
                key={field.name}
                className={`${index === 0 ? "" : "mt-[29px]"} relative h-[50px] rounded-[6px] border border-[#c8c8c8]`}
              >
                <legend className="ml-[14px] px-1 text-[16px] leading-none text-[#6C25FF]">
                  {field.label}
                  {field.required !== false && (
                    <span className="text-[#dd2c2c]">*</span>
                  )}
                </legend>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required !== false}
                  minLength={field.name === "password" ? 6 : undefined}
                  className="h-full w-full bg-transparent px-5 pb-[9px] text-[20px] font-normal text-black outline-none"
                />
              </fieldset>
            ))}

            <div className="mt-[31px]">
              <p className="text-[16px] font-medium text-black">
                Are you an Agency?<span className="text-[#dd2c2c]">*</span>
              </p>
              <div className="mt-[14px] flex items-center gap-[27px] text-[18px] text-black">
                <label className="flex items-center gap-[9px]">
                  <input
                    type="radio"
                    name="isAgency"
                    checked={formData.isAgency}
                    onChange={() =>
                      setFormData((current) => ({ ...current, isAgency: true }))
                    }
                    className="h-[22px] w-[22px] accent-[#4a4a4a]"
                  />
                  Yes
                </label>
                <label className="flex items-center gap-[9px]">
                  <input
                    type="radio"
                    name="isAgency"
                    checked={!formData.isAgency}
                    onChange={() =>
                      setFormData((current) => ({ ...current, isAgency: false }))
                    }
                    className="h-[22px] w-[22px] accent-[#4a4a4a]"
                  />
                  No
                </label>
              </div>
            </div>

            {error && (
              <p className="mt-4 text-[14px] font-semibold text-[#dd2c2c]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="absolute bottom-[15px] left-1/2 h-[55px] w-[calc(100%-80px)] max-w-[350px] -translate-x-1/2 rounded-[6px] bg-[#6C25FF] text-[20px] font-bold text-white transition duration-300 hover:bg-[#5a1fe0] disabled:cursor-not-allowed disabled:bg-[#9b7dff] cursor-pointer"
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
