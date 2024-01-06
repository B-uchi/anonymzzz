import React, { useEffect, useState } from "react";
import { IoCopyOutline, IoShareOutline } from "react-icons/io5";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [messages, setMessages] = useState([]);
  const mail = sessionStorage.getItem("mail");
  const username = sessionStorage.getItem("username");
  const [page, setPage] = useState(0);

  useEffect(() => {
    const verifyUser = () => {
      const verifyUserRequest = {
        url: "https://anonymzzz-server.vercel.app/user/verify",
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
      };
      axios
        .request(verifyUserRequest)
        .then((response) => {
          if (response.status === 201) {
            getLink();
            getMessages();
          } else {
            navigate("/");
          }
        })
        .catch((e) => {
          navigate("/");
          console.log("An error occured", e);
        });
    };

    const getLink = () => {
      const getLinkRequest = {
        url: "https://anonymzzz-server.vercel.app/user/getLink",
        method: "POST",
        data: { username },
        headers: {
          "content-type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
      };
      axios
        .request(getLinkRequest)
        .then((response) => {
          if (response.status === 201) {
            setLink(response.data.url);
          }
        })
        .catch((e) => {
          console.log("An error occured", e.response);
        });
    };

    const getMessages = () => {
      const getMessageRequest = {
        url: "https://anonymzzz-server.vercel.app/user/messages",
        method: "POST",
        data: { username },
        headers: {
          "content-type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
      };
      axios
        .request(getMessageRequest)
        .then((response) => {
          setMessages(response.data.messages.reverse);
        })
        .catch((e) => {
          console.log("An error occured", e.response);
        });
    };
    verifyUser();
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    toast("Copied to clipboard!");
  };
  return (
    <div className="w-[100%] bg-[#f8f7f4] flex justify-center relative items-center h-[100vh]">
      <Toaster richColors position="top-right" />
      {link === null ? (
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
      ) : page === 0 ? (
        <motion.div
          initial={{ translateY: -200, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          exit={{ display: "none", opacity: 0 }}
          key={"dashboard"}
        >
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-2xl text-center w-full p-1 font-bold mb-4">
                Welcome back, {username}!
              </h1>
              <p className="text-lg text-center w-full p-1">
                Your link is{" "}
                <span className="text-[#0052cf] underline">{link}</span>
              </p>
              <div className="flex gap-2">
                <button
                  className="mt-4 text-lg bg-[#484672] text-white px-4 py-2 rounded-md items-center flex gap-1"
                  onClick={copyLink}
                >
                  <IoCopyOutline />
                  Copy
                </button>
                <a
                  href={`https://api.whatsapp.com/send?text=Hey there!${encodeURI(
                    "🌚"
                  )}, got something you wanna say? Send me an anonymous message on Anonymzzz👌. ${link}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 text-lg bg-[#484672] text-white px-4 py-2.5 rounded-md justify-center flex gap-1"
                >
                  Share{" "}
                  <IoShareOutline size={25} />
                </a>
              </div>
            </div>
            <div className="mt-8">
              <button
                className="text-lg bg-[#484672] text-white px-4 py-2 rounded-md"
                onClick={() => setPage(1)}
              >
                View Messages
              </button>
              <button
                className="text-lg ml-5 bg-[#484672] text-white px-4 py-2 rounded-md"
                onClick={() => {
                  sessionStorage.clear();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ translateY: -200, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          exit={{ display: "none", opacity: 0 }}
          key={"messages"}
        >
          <div className="flex h-[100vh] flex-col justify-center items-center">
            <h1 className="text-2xl font-bold mb-4">Your Messages</h1>
            {messages.length === 0 ? (
              <p className="text-lg">No messages yet!</p>
            ) : (
              <div className="p-2 h-[50%] overflow-auto overflow-y-scroll">
                {messages.map((message) => (
                  <div className="flex flex-col justify-center items-center" key={message._id}>
                    <div className="flex flex-col justify-center items-start bg-[#484672] w-full text-white px-4 py-2 rounded-md mt-4">
                      <p className="text-md">Message: {message.message}</p>
                      <div className="">
                        <p className="text-sm">
                          Received on:{" "}
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-8">
              <button
                className="text-lg bg-[#0052cf] text-white px-4 py-2 rounded-md"
                onClick={() => setPage(0)}
              >
                Go Back
              </button>
            </div>
          </div>
        </motion.div>
      )}
      <small className="bottom-0 absolute right-0 p-2">
        Made with &#10084; by Buchi
      </small>
    </div>
  );
};

export default Dashboard;
