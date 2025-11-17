import React, { useEffect, useRef, useContext } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, LogIn, LogOut, type LucideProps } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { BsApple } from "react-icons/bs";
import { SiBinance } from "react-icons/si";
import { RiWallet3Fill } from "react-icons/ri";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import UserContext, { type View } from "./store/UserContext";
import ExitAnimation from "./components/other/ExitAnimation";
import StackedButtons from "./components/other/StackedButtons";

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
  const handleForgotPassword = (password: unknown) =>
    console.log("Forgot password for:", password);

  const isLogin = values.view === "login";

  // Define motion variants that change direction depending on the view
  const formVariants = {
    initial: (isLogin: boolean) => ({
      opacity: 1,
      y: isLogin ? -280 : 80, // Move up on signup, down on login
    }),
    animate: { opacity: 1, y: 0 },
    exit: (isLogin: boolean) => ({
      opacity: 1,
      y: isLogin ? 0 : -200, // Opposite exit direction
    }),
  };

  const socialVariants = {
    initial: (isLogin: boolean) => ({
      opacity: 0,
      y: isLogin ? 80 : -80, // Opposite of form
    }),
    animate: { opacity: 1, y: 0 },
    exit: (isLogin: boolean) => ({
      opacity: 0,
      y: isLogin ? -80 : 80, // Opposite exit direction
    }),
  };

  return (
    <div className="flex items-center justify-around w-lvw h-lvh bg-[radial-gradient(circle,rgba(212,216,217,1)_31%,rgba(255,255,255,1)_100%)]">
      <div className="bg-[#f8f8f8] overflow-hidden shadow-md rounded-2xl">
        <div className="rounded-2xl shadow-md p-8 w-full max-w-[500px] bg-white">
          {/* Tabs */}
          <div className="flex justify-center gap-x-3 mb-6">
            <div className="bg-gray-300 grid grid-cols-2 place-content-center rounded-sm p-1 relative">
              {/* Animated tab indicator */}
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-white rounded-sm absolute top-1 left-1 w-[94px] h-[32px] z-[1]"
                animate={{ x: isLogin ? 0 : 94 }}
              />
              {tabItems.map(({ icon: Icon, label, view }, i) => (
                <div
                  key={label}
                  ref={(el) => (tabRefs.current[i] = el)}
                  onClick={() => setView(view)}
                  className={`${values.view === view
                    ? "text-black font-medium"
                    : "text-gray-600"
                    } cursor-pointer px-2 py-1 rounded flex items-center gap-x-1 col-span-1 z-[2]`}
                >
                  <Icon height={16} />
                  <span className="text-base">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Animated Form + Social Sections */}
          <form
            className="flex flex-col items-center justify-around my-5 px-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <AnimatePresence mode="wait" custom={isLogin}>
              {/* Form section */}
              <motion.div
                key={values.view + "-form"}
                animate={{
                  y: isLogin ? 0 : 280,
                  animationDirection: 2,     // 👈 move up/down
                  scale: isLogin ? 1 : 1,    // 👈 scale transform
                  rotate: isLogin ? 0 : 0,    // 👈 optional rotation
                }}
                transition={{
                  type: "tween",
                  stiffness: 120,
                  ease: "easeInOut",
                  damping: 15,
                }}
                initial={{ y: isLogin ? 280 : -280 }}
                className="min-w-full space-y-5"
              >
                {inputs.map(({ id, type, label, placeholder, labelRight }) => (
                  <div key={id}>
                    <label htmlFor={id}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-base text-[#2B2D30] font-medium">
                          {label}
                        </p>
                        {labelRight && isLogin && (
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
                ))}
                <Button className="bg-black border rounded-xl h-[46px] hover:text-black hover:bg-gray-400 text-white w-full cursor-pointer">
                  {isLogin ? "Login" : "Signup"} <ArrowRight />
                </Button>
              </motion.div>

              {/* Divider */}
              <motion.div
                key={values.view + "-divider"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full my-5"

              >
                <div className="flex items-center gap-2 relative">
                  <span className="flex-1 h-px bg-gray-400" />
                  <p className="text-gray-500">or</p>
                  <span className="flex-1 h-px bg-gray-400" />
                </div>
              </motion.div>

              {/* Social buttons */}
              <motion.div
                key={values.view + "-social"}
                animate={{
                  y: isLogin ? 0 : -280,     // 👈 move up/down
                  scale: isLogin ? 1 : 1,    // 👈 scale transform
                  rotate: isLogin ? 0 : 0,    // 👈 optional rotation
                  animationDuration: 20
                }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 15,
                  ease: "easeInOut",

                }}
                initial={{ y: !isLogin ? 280 : -280, scale: 1 }}

                className="min-w-full space-y-3"
              >
                {socialButtons.map(({ icon: Icon, label }, i) => (
                  <motion.button
                    type="button"
                    key={label + "-social"}
                    className="min-w-[250px] bg-white border rounded-xl h-[46px] hover:bg-black hover:text-white text-black w-full cursor-pointer"

                    initial={{ opacity: 0, y: i * 55 }}
                    animate={{
                      opacity: 1,
                      y: 0,   // 👈 Changed: Slide from below to 0, no extra movement
                    }}
                    exit={{ opacity: 0, y: -i * 55 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                      delay: i * 0.1 + 0.7  // 👈 Adjusted: Stagger delay based on index
                    }}
                  >
                    <div className="flex items-center gap-x-2 min-w-[192px] justify-center">
                      <Icon className="h-[25px] w-[25px]" />
                      <span className="text-base">{label}</span>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </AnimatePresence>
          </form>
        </div>

        {/* Footer */}
        <motion.div
          key={values.view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-center p-4"
        >
          <p>
            {isLogin
              ? "Don't have an account yet?"
              : "Already have an account?"}
            &nbsp;
            <span
              className="underline cursor-pointer font-medium"
              onClick={() => setView(isLogin ? "register" : "login")}
            >
              {isLogin ? "Sign up" : "Login"}
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
