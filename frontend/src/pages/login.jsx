import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import anonymous from "../assets/anonymous.png";
import axios from "axios";
import emailValidator from "email-validator";

const Login = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState("sign in");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    setLoading(true);
    e.preventDefault();
    const loginRequest = {
      url: "https://anonymzzz-server.onrender.com/auth/login",
      method: "POST",
      data: JSON.stringify({ email, password }),
      headers: {
        "content-type": "application/json",
      },
    };

    await axios
      .request(loginRequest)
      .then((response) => {
        console.log(response)
        sessionStorage.setItem("username", response.data.user.username);
        sessionStorage.setItem("mail", response.data.user.email);
        sessionStorage.setItem("token", response.data.token);
        setLoading(false);
        toast.success("Login successfull...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      })
      .catch((e) => {
        setLoading(false);
        if (e.response.data.message !== undefined) {
          toast.error(e.response.data.message);
        } else {
          toast.error("An error occured...");
        }
        console.log(e.response.data.message);
      });
  };

  const register = async (e) => {
    setLoading(true);
    let trimmedUsername = username.trim();
    const isValidEmail = emailValidator.validate(email);

    e.preventDefault();
    if (trimmedUsername.length < 3) {
      setLoading(false);
      return toast.error("Username must be at least 3 characters long");
    } else {
      if (isValidEmail) {
        const registerRequest = {
          url: "https://anonymzzz-server.onrender.com/auth/register",
          method: "POST",
          data: JSON.stringify({
            email,
            password,
            username: trimmedUsername,
          }),
          headers: {
            "content-type": "application/json",
          },
        };
        await axios
          .request(registerRequest)
          .then((response) => {
            sessionStorage.setItem("username", response.data.user.username);
            sessionStorage.setItem("mail", response.data.user.email);
            sessionStorage.setItem("token", response.data.token);
            setLoading(false);
            toast.success("Account created successfully...");
            setTimeout(() => {
              navigate("/dashboard");
            }, 1000);
          })
          .catch((e) => {
            setLoading(false);
            e.response.data.message
              ? toast.error(e.response.data.message)
              : toast.error("An error occured...");
            console.log(e.response.data.message);
          });
      } else {
        setLoading(false);
        return toast.error("Invalid email address");
      }
    }
  };

  return (
    <div className=" max-w-[100%] w-[100%] h-[100vh] max-h-screen overflow-y-scroll">
      <div className="flex flex-col md:flex-row justify-end items-center h-[100vh] relative">
        {loading ? (
          <div className="bg-[rgba(255,255,255,0.7)] w-full h-full absolute flex justify-center items-center z-50">
            <div className="spinner">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="md:bg-[#b9b6e7] w-[100%] md:w-[50%] flex justify-center items-center  md:h-full">
          <div className="pt-5">
            {/* Anonymous icons created by Freepik - Flaticon */}
            <div className="flex md:mt-0 mt-10 justify-center items-center gap-5">
              <img
                src={anonymous}
                className="w-[3em] mx-auto md:w-[20em]"
                alt=""
              />
              <h2 className="m-0 block text-[#091e42] md:hidden text-3xl">Anonymzzz</h2>
            </div>
            <div className="text-[#091e42] font-bold text-center mt-3 flex flex-col space-y-0.5">
              <h2 className="m-0 md:block hidden text-3xl">Anonymzzz</h2>
              <small className="text-[12px] md:text-sm  md:block hidden">
                Let your hidden thoughts run wild!!
              </small>
            </div>
          </div>
        </div>
        <div className="w-[100%] md:w-[50%] flex justify-center items-start md:items-center flex-grow md:h-full relative">
          <Toaster position="top-center" richColors />
          <div className="w-full md:w-[500px] p-3">
            <div className="p-2">
              <h1 className="md:font-bold text-xl md:text-3xl text-[#091e42]">
                Welcome, {page}!
              </h1>
              <AnimatePresence>
                {page === "sign in" ? (
                  <motion.div
                    className="mt-9"
                    initial={{ translateX: -100, opacity: 0 }}
                    animate={{ translateX: 0, opacity: 1 }}
                    exit={{ display: "none", opacity: 0 }}
                    key={"login"}
                  >
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
                            type="submit"
                            className="p-3 px-5 hover:scale-105 btn rounded-lg text-white"
                          >
                            Sign In{" "}
                            <div id="login" className="traffic-loader"></div>
                          </button>
                        </div>
                        <div className="flex justify-center">
                          <small
                            onClick={() => setPage("sign up")}
                            className="mx-auto underline mb-5 cursor-pointer"
                          >
                            Don't have an account? Create one
                          </small>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    className="mt-9 mb-4"
                    key={"register"}
                    initial={{ translateX: 200, opacity: 0 }}
                    animate={{ translateX: 0, opacity: 1 }}
                    exit={{ display: "none", opacity: 0 }}
                  >
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
                            type="submit"
                            className="p-3 px-5 flex gap-3 items-center hover:scale-105 btn text-white rounded-lg bg-[#e5e7eb38]"
                          >
                            Sign Up{" "}
                          </button>
                        </div>
                        <div className="flex justify-center ">
                          <small
                            onClick={() => setPage("sign in")}
                            className="mx-auto underline mb-2 cursor-pointer"
                          >
                            Already have an account? Log In
                          </small>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <small className="bottom-0 absolute right-0 p-2">
                Made with &#10084; by Buchi
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
