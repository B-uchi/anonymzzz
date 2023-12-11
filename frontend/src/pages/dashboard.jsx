import React, { useEffect, useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [messages, setMessages] = useState([]);
  const mail = sessionStorage.getItem("mail");
  const username = sessionStorage.getItem("username");

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
            toast(`${username}, welcome back!`);
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
          setMessages(response.data.messages.reverse());
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
    <div className="w-[100%] bg-[#dfdede] flex justify-center items-center h-[100vh]">
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
      ) : (
        <div className="flex justify-center w-full items-center">
          <div className="flex flex-col main-container w-[40%] h-[100vh]">
            <div className="bg-[#0d0c22] mt-5 w-[100%] rounded-lg p-3 text-white shadow-black shadow-md">
              <div className="border  p-2 rounded-md">
                <h2 className="text-center text-2xl">Anonymzzz</h2>
                <p className="text-center text-[11px]">
                  Let your hidden thughts run wild!!!
                </p>
                <div className="mt-5 text-sm">
                  <p>Username: {username}</p>
                  <em>Email: {mail}</em>
                  <div className="mt-6">
                    <p>Your Link:</p>
                    <div className="relative">
                      <textarea
                        rows={1}
                        value={link}
                        className="resize-none link  w-[100%] rounded-md text-black text-center p-2"
                        readOnly
                      ></textarea>
                      <IoCopyOutline
                        onClick={() => {
                          copyLink();
                        }}
                        className="absolute cursor-pointer right-4 top-2"
                        color="black"
                        size={25}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-col text-center p-3">
              <p className="text-left mb-2">Your messages:</p>
              <div className="overflow-y-auto h-[65%] msg-container w-[100%]">
                {messages
                  ? messages.map((message, index) => (
                      <div
                        key={index}
                        className="bg-white border message rounded-lg flex flex-col text-left p-3 mb-5"
                      >
                        <p>{message.message}</p>
                        <div className="">
                          <small className="block">
                            Date sent: {message.createdAt.slice(0, 10)}
                          </small>
                        </div>
                      </div>
                    ))
                  : "You have no messages"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
