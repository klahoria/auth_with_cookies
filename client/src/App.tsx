import { ArrowRight, LogIn, LogOut } from "lucide-react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"
import { FaGoogle } from "react-icons/fa"
import { BsApple } from "react-icons/bs"
import { SiBinance } from "react-icons/si"
import { RiWallet3Fill } from "react-icons/ri"
import React, { useEffect } from "react"
import UserContext from "./store/UserContext"

type Inputs = {
  email: string
  password: string
}

const socialButtons = [
  { icon: FaGoogle, label: "Continue with Google" },
  { icon: BsApple, label: "Continue with Apple" },
  { icon: SiBinance, label: "Continue with Binance" },
  { icon: RiWallet3Fill, label: "Continue with Wallet" },
]

function App(props) {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)

  const inputs = [
    { id: "email", type: 'text', label: "Email address", placeholder: "Enter your email address" },
    { id: "password", type: 'password', label: "Password", placeholder: "Enter your password", forgotPassword: (pass: any) => ForgotPassword(pass), labelRight: 'Forgot Password?' },
  ]

  function ForgotPassword(password: any) {
    console.log(password)
  }

  const values = React.useContext(UserContext);


  useEffect(() => {
    console.log(values, "props")
  }, [])

  useEffect(() => {
    console.log(values.values.view, "values.values.view")
  }, [values.values.view])

  return (
    <div className="w-lvw h-lvh flex items-center justify-around bg-[radial-gradient(circle,rgba(212,216,217,1)_31%,rgba(255,255,255,1)_100%)]">
      <div className="bg-[#f8f8f8] overflow-hidden shadow-md rounded-2xl">
        <div className="rounded-2xl shadow-md p-8 w-full max-w-[500px] bg-white">

          {/* Login/Signup Tabs */}
          <div className={"flex items-center justify-center gap-x-3"}>
            {[
              { icon: LogIn, label: "Login", view: 'login' },
              { icon: LogOut, label: "Signup", view: 'register' },
            ].map(({ icon: Icon, label,view }) => (
              <div key={label} className="cursor-pointer px-2 py-1 shadow-md rounded flex items-center gap-x-1" onClick={()=>values.setView(view)} >
                <Icon height={16} />
                <span className="text-base">{label}</span>
              </div>
            ))}
          </div>

          <div className={"my-5 px-3 "}>
            <form className="flex flex-col items-center justify-around" onSubmit={handleSubmit(onSubmit)}>
              <div className={(values.values.view == 'login' ? 'order-1' : 'order-3') + " min-w-full [&>div:not(:first-child)]:mt-5"}>
                {inputs.map(({ id, label, placeholder, type, labelRight, forgotPassword }) => (
                  <div className="" key={id}>
                    <label htmlFor={id}>
                      <span className="flex items-center justify-between">
                        <p className="text-base text-[#2B2D30] font-medium mb-1">{label}</p>
                        {labelRight ?
                          <p className="text-base text-[#2B2D30] font-medium mb-1 cursor-pointer" onClick={() => forgotPassword("test")}>{labelRight}</p>
                          : ""
                        }
                      </span>
                      <Input
                        type={type || 'text'}
                        className="py-2 h-[46px] text-[#2B2D30]"
                        style={{ fontSize: "16px" }}
                        placeholder={placeholder}
                        {...register(id)}
                      />
                    </label>
                  </div>
                ))}

                <div className="mt-5">
                  <Button className="bg-black border rounded-xl h-[46px] hover:text-black hover:bg-gray-400 text-white w-full cursor-pointer">
                    Login <ArrowRight animation="pointing" />
                  </Button>
                </div>
              </div>

              {/* Divider */}
              <div className="order-2 min-w-full">
                <div className="gap-2 flex items-center my-3 relative">
                  <span className="inline-block w-full before:block before:flex-1 before:h-px before:bg-gray-400" />
                  <p className="mb-1">or</p>
                  <span className="inline-block w-full after:block after:flex-1 after:h-px after:bg-gray-400" />
                </div>
              </div>

              {/* Social Buttons */}
              <div className={(values.values.view == 'login' ? 'order-3' : 'order-1') + " [&>button:not(:last-child)]:mb-3 mt-3 min-w-full"}>
                {socialButtons.map(({ icon: Icon, label }) => (
                  <Button type="button" key={label} className="bg-white border rounded-xl h-[46px] hover:text-white text-black w-full cursor-pointer">
                    <div className="flex items-center gap-x-2 min-w-[192px]">
                      <Icon style={{ height: "25px", width: "25px" }} />
                      <div className="text-base">{label}</div>
                    </div>
                  </Button>
                ))}
              </div>

            </form>
          </div>

        </div>

        <div className="text-center p-4">
          <p>
            Don't have an account yet?&nbsp;
            <span className="underline cursor-pointer font-medium">
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
