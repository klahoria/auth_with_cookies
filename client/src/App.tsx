import React, { useEffect, useRef, useContext } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ArrowRight, LogIn, LogOut, type LucideProps } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { BsApple } from "react-icons/bs";
import { SiBinance } from "react-icons/si";
import { RiWallet3Fill } from "react-icons/ri";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import UserContext, { type View } from "./store/UserContext";

type Inputs = {
  email: string;
  password: string;
};

type TabItem = {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  label: string;
  view: View;
};

const socialButtons = [
  { icon: FaGoogle, label: "Continue with Google" },
  { icon: BsApple, label: "Continue with Apple" },
  { icon: SiBinance, label: "Continue with Binance" },
  { icon: RiWallet3Fill, label: "Continue with Wallet" },
];

const tabItems: TabItem[] = [
  { icon: LogIn, label: "Login", view: "login" },
  { icon: LogOut, label: "Signup", view: "register" },
];

const inputs = [
  {
    id: "email",
    type: "text",
    label: "Email address",
    placeholder: "Enter your email address",
  },
  {
    id: "password",
    type: "password",
    label: "Password",
    placeholder: "Enter your password",
    labelRight: "Forgot Password?",
  },
];

function App() {
  const { register, handleSubmit } = useForm<Inputs>();
  const { values, setView } = useContext(UserContext);
  const tabRefs = useRef<(HTMLElement | null)[]>([]);

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  useEffect(() => {
    console.log(values, "User context values");
  }, [values]);

  const handleForgotPassword = (password: unknown) => {
    console.log("Forgot password for:", password);
  };

  return (
    <div className="flex items-center justify-around w-lvw h-lvh bg-[radial-gradient(circle,rgba(212,216,217,1)_31%,rgba(255,255,255,1)_100%)]">
      <div className="bg-[#f8f8f8] overflow-hidden shadow-md rounded-2xl">
        <div className="rounded-2xl shadow-md p-8 w-full max-w-[500px] bg-white">
          {/* Tabs */}
          <div className="flex justify-center gap-x-3">
            <div className="bg-gray-300 grid grid-cols-2 place-content-center rounded-sm p-1 relative transition-all duration-150">
              <div
                className={`bg-white rounded-sm absolute top-1 left-1 w-[94px] h-[32px] z-[1] transform transition-transform duration-500 ${values.view === "login" ? "translate-x-0" : "translate-x-full"
                  }`}
              />
              {tabItems.map(({ icon: Icon, label, view }, i) => (
                <div
                  key={label}
                  ref={(el) => (tabRefs.current[i] = el)}
                  onClick={() => setView(view)}
                  className={`${values.view === view ? "text-black" : "text-gray-600"
                    } cursor-pointer px-2 py-1 rounded flex items-center gap-x-1 col-span-1 z-[2]`}
                >
                  <Icon height={16} />
                  <span className="text-base">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Section */}
          <form
            className="flex flex-col items-center justify-around my-5 px-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Inputs */}
            <div
              className={`${values.view === "login" ? "order-1" : "order-3"
                } min-w-full [&>div:not(:first-child)]:mt-5`}
            >
              {inputs.map(
                ({ id, type, label, placeholder, labelRight }, i) => (
                  <div key={id}>
                    <label htmlFor={id}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-base text-[#2B2D30] font-medium">
                          {label}
                        </p>
                        {labelRight && (
                          <p
                            className="text-base text-[#2B2D30] font-medium cursor-pointer"
                            onClick={() => handleForgotPassword("test")}
                          >
                            {labelRight}
                          </p>
                        )}
                      </div>
                      <Input
                        id={id}
                        type={type}
                        placeholder={placeholder}
                        className="py-2 h-[46px] text-[#2B2D30]"
                        style={{ fontSize: "16px" }}
                        {...register(id as keyof Inputs)}
                      />
                    </label>
                  </div>
                )
              )}

              <div className="mt-5">
                <Button className="bg-black border rounded-xl h-[46px] hover:text-black hover:bg-gray-400 text-white w-full cursor-pointer">
                  {values.view === "login" ? "Login" : "Signup"}
                  <ArrowRight />
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="order-2 w-full my-3">
              <div className="flex items-center gap-2 relative">
                <span className="flex-1 h-px bg-gray-400" />
                <p className="text-gray-500">or</p>
                <span className="flex-1 h-px bg-gray-400" />
              </div>
            </div>

            {/* Social Buttons */}
            <div
              className={`${values.view === "login" ? "order-3" : "order-1"
                } mt-3 min-w-full space-y-3`}
            >
              {socialButtons.map(({ icon: Icon, label }) => (
                <Button
                  type="button"
                  key={label}
                  className="bg-white border rounded-xl h-[46px] hover:bg-black hover:text-white text-black w-full cursor-pointer"
                >
                  <div className="flex items-center gap-x-2 min-w-[192px] justify-center">
                    <Icon className="h-[25px] w-[25px]" />
                    <span className="text-base">{label}</span>
                  </div>
                </Button>
              ))}
            </div>
          </form>
        </div>

        <div className="text-center p-4">
          <p>
            {values.view === "login"
              ? "Don't have an account yet?"
              : "Already have an account?"}
            &nbsp;
            <span
              className="underline cursor-pointer font-medium"
              onClick={() =>
                setView(values.view === "login" ? "register" : "login")
              }
            >
              {values.view === "login" ? "Sign up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
