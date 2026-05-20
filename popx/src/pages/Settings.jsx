import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authStorage, getCurrentUser, logoutUser } from "../lib/auth";

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => authStorage.getUser());
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [refreshError, setRefreshError] = useState("");

  useEffect(() => {
    const token = authStorage.getToken();

    if (!token) {
      navigate("/signin", { replace: true });
      return;
    }

    const loadUser = async () => {
      try {
        const data = await getCurrentUser();
        authStorage.saveUser(data.user);
        setUser(data.user);
        setRefreshError("");
      } catch (err) {
        if (err.status === 401) {
          authStorage.clearSession();
          navigate("/signin", { replace: true });
          return;
        }

        setRefreshError(err.message);
      } finally {
        setIsRefreshing(false);
      }
    };

    loadUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // The local session is the source of truth for logout in this JWT flow.
    } finally {
      authStorage.clearSession();
      toast.success("Logged out successfully");
      navigate("/", { replace: true });
    }
  };

  const displayName = user?.fullName || "Account User";
  const displayEmail = user?.email || "";

  return (
    <div className="fixed inset-0 flex justify-center bg-white">
      <section className="relative h-screen w-full max-w-[468px] border border-[#d9d9d9] bg-[#f7f8fa]">
        <header className="flex h-[68px] items-center border-b border-[#eeeeee] bg-white px-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h1 className="text-[20px] font-bold text-[#3f3f46]" id="settings">
            Account Settings
          </h1>
        </header>

        <div className="px-8 pt-5">
          {isRefreshing && !user ? (
            <p className="text-[15px] font-semibold text-[#565656]">
              Loading account...
            </p>
          ) : (
            <>
              <div className="flex items-start gap-5">
                <div className="relative h-[68px] w-[68px] shrink-0">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt={displayName}
                    className="h-full w-full rounded-full object-cover"
                    id="settings"
                  />
                  <span className="absolute bottom-[4px] right-[-2px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#6C25FF]" id="settings">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-[12px] w-[12px] fill-none stroke-white stroke-[2.5]"
                    >
                      <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.8l1.2-1.7h5L15.7 6h1.8A2.5 2.5 0 0 1 20 8.5v7A2.5 2.5 0 0 1 17.5 18h-11A2.5 2.5 0 0 1 4 15.5v-7Z" />
                      <circle cx="12" cy="12" r="3.2" />
                    </svg>
                  </span>
                </div>

                <div className="pt-[2px]" id="settings">
                  <h2 className="mb-2 text-[16px] font-bold leading-[10px] text-[#4b4b4b]" id="settings">
                    {displayName}
                  </h2>
                  <p className="text-[14px] font-semibold leading-[10px] text-[#4b4b4b]" id="settings">
                    {displayEmail}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-[14px] font-semibold leading-[22px] text-[#565656]" id="settings">
                Lorem Ipsum Dolor Sit Amet, Consetetur Sadipscing Elitr, Sed Diam
                Nonumy Eirmod Tempor Invidunt Ut Labore Et Dolore Magna Aliquyam
                Erat, Sed Diam
              </p>

              {refreshError && (
                <p className="mt-4 text-[13px] font-semibold leading-[20px] text-[#b42318]">
                  {refreshError}
                </p>
              )}
            </>
          )}
        </div>

        <div className="absolute left-8 right-8 top-[264px] border-t border-dashed border-[#d7d7d7]" />
        <div className="absolute bottom-[104px] left-8 right-8 border-t border-dashed border-[#d7d7d7]" />
        <button
          type="button"
          onClick={handleLogout}
          className="absolute bottom-8 left-8 right-8 h-[52px] rounded-[7px] border border-[#6C25FF] bg-white text-[17px] font-bold text-[#6C25FF] transition duration-300 hover:bg-[#f0eaff] cursor-pointer"
        >
          Logout
        </button>
      </section>
    </div>
  );
};

export default Settings;
