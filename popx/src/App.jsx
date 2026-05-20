import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const Home = lazy(() => import("./pages/Home.jsx"));
const Signin = lazy(() => import("./pages/Signin.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));

const App = () => {
  return (
    <div className="app-shell px-4 pb-10 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer
        theme="dark"
        toastStyle={{
          background: "rgba(8, 15, 28, 0.96)",
          color: "#e5eefc",
          border: "1px solid rgba(148, 163, 184, 0.16)",
        }}
      />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Settings />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
