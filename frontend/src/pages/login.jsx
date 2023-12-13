import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["token"]);
  const [page, setPage] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    document.querySelector("#login").classList.add("show-loading");
    document.querySelector("#login").classList.add("show-loading");
    e.preventDefault();
    const loginRequest = {
      url: "https://anonymzzz-server.vercel.app/auth/login",
      method: "POST",
      data: JSON.stringify({ email, password }),
      headers: {
        "content-type": "application/json",
      },
    };

    await axios
      .request(loginRequest)
      .then((response) => {
        sessionStorage.setItem("username", response.data.user.username);
        sessionStorage.setItem("mail", response.data.user.email);
        sessionStorage.setItem("token", response.data.token);
        toast.success("Login successfull...");


        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
        document.querySelector("#login").classList.remove("show-loading");
        document.querySelector("#login").classList.remove("show-loading");
      })
      .catch((e) => {
        document.querySelector("#login").classList.remove("show-loading");
        e.response.data.message ? toast.error(e.response.data.message) : toast.error("An error occured...");       
        console.log(e.response.data.message);
      });
  };

  const register = async (e) => {
    document.querySelector("#register").classList.add("show-loading");
    document.querySelector("#register").classList.add("show-loading");
    e.preventDefault();
    const registerRequest = {
      url: "https://anonymzzz-server.vercel.app/auth/register",
      method: "POST",
      data: JSON.stringify({ email, password, username }),
      headers: {
        "content-type": "application/json",
      },
    };

    await axios
      .request(registerRequest)
      .then((response) => {
        toast.success("Account created successfully...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
        document.querySelector("#register").classList.remove("show-loading");
      })
      .catch((e) => {
        document.querySelector("#register").classList.remove("show-loading");
        e.response.data.message ? toast.error(e.response.data.message) : toast.error("An error occured...");
        console.log(e.response.data.message);
      });
  };

  return (
    <div className="flex flex-col max-w-[100%] w-full h-[100vh] justify-center items-center">
      <Toaster position="top-center" richColors />
      <div className="text-[#0d0c22] font-bold text-center flex flex-col space-y-0.5">
        <h2 className="m-0 text-2xl">Anonymzzz</h2>
        <small className="">Let your hidden thoughts run wild!!</small>
      </div>
      <div className="bg-[#0d0c22] w-[500px] rounded-lg p-3  shadow-black shadow-md">
        <div className="border h-full p-2 rounded-md">
          <AnimatePresence>
            {page === "login" ? (
              <motion.div
                className="text-white mt-9"
                initial={{ translateX: -100, opacity: 0 }}
                animate={{ translateX: 0, opacity: 1 }}
                exit={{ display: "none", opacity: 0 }}
                key={"login"}
              >
                <div className="flex justify-center">
                  <p className="mx-auto">LOG IN</p>
                </div>
                <div className="mt-5">
                  <div>
                    <div className="">
                      <p className="underline">Email:</p>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full input "
                        placeholder="user@domain.com"
                      />
                    </div>
                    <div className="mt-3">
                      <p className="underline">Password:</p>
                      <input
                        type="password"
                        className="w-full input "
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Something secure...."
                      />
                    </div>
                    <div className="mt-5 flex justify-center">
                      <button
                        onClick={(e) => login(e)}
                        className="p-3 px-5 flex gap-3 items-center hover:scale-105 btn rounded-lg bg-[#e5e7eb38]"
                      >
                        Log In <div id="login" className="traffic-loader"></div>
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <small
                        onClick={() => setPage("register")}
                        className="mx-auto underline cursor-pointer"
                      >
                        Don't have an account? Create one
                      </small>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="text-white mt-9 mb-4"
                key={"register"}
                initial={{ translateX: 200, opacity: 0 }}
                animate={{ translateX: 0, opacity: 1 }}
                exit={{ display: "none", opacity: 0 }}
              >
                <div className="flex justify-center">
                  <p className="mx-auto">REGISTER</p>
                </div>
                <div className="mt-5">
                  <div>
                    <div className="">
                      <p className="underline">Username:</p>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full input "
                        placeholder="Something catchyy..."
                      />
                    </div>
                    <div className="">
                      <p className="underline">Email:</p>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full input "
                        placeholder="user@domain.com"
                      />
                    </div>
                    <div className="mt-3">
                      <p className="underline">Password:</p>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full input "
                        placeholder="Something secure...."
                      />
                    </div>
                    <div className="mt-5 flex justify-center">
                      <button
                        onClick={(e) => register(e)}
                        className="p-3 px-5 flex gap-3 items-center hover:scale-105 btn rounded-lg bg-[#e5e7eb38]"
                      >
                        Register{" "}
                        <div id="register" className="traffic-loader"></div>
                      </button>
                    </div>
                    <div className="flex justify-center ">
                      <small
                        onClick={() => setPage("login")}
                        className="mx-auto underline cursor-pointer"
                      >
                        Already have an account? Log In
                      </small>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Login;
