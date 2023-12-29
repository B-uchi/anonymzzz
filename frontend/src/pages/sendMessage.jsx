import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import anonymous from "../assets/anonymous.png";
import { Toaster, toast } from "sonner";
import { set } from "mongoose";

const SendMessage = () => {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [valid, setValid] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  let { username } = useParams();

  useEffect(() => {
    document.title = `Send a message to ${username} | Anonymzzz`;
    function setMetaTag(property, content) {
      const existingTag = document.querySelector(
        `meta[property="${property}"]`
      );
      if (existingTag) {
        existingTag.setAttribute("content", content);
      } else {
        const newMetaTag = document.createElement("meta");
        newMetaTag.setAttribute("property", property);
        newMetaTag.setAttribute("content", content);
        document.head.appendChild(newMetaTag);
      }
    }
    setMetaTag("og:title", "Anonymzzz");
    setMetaTag("og:description", `Send a message to ${username}`);
    const verifyLink = () => {
      const request = {
        url: "https://anonymzzz-server.vercel.app/user/verifyLink",
        method: "POST",
        data: { username },
        headers: {
          "content-type": "application/json",
        },
      };
      axios
        .request(request)
        .then((response) => {
          setLoading(false);
        })
        .catch((e) => {
          if (e.response.status === 400) {
            setValid(false);
            setLoading(false);
          } else {
            setError(true);
            console.log(e.response.data.message);
          }
        });
    };
    verifyLink();
  }, []);

  const sendMessage = () => {
    setProcessing(true);
    if (message != null) {
      const request = {
        url: "https://anonymzzz-server.vercel.app/user/sendMessage",
        method: "POST",
        data: { username, message },
        headers: {
          "content-type": "application/json",
        },
      };
      axios
        .request(request)
        .then((response) => {
          setProcessing(false);
          toast.success("Message sent successfully!");
          setMessage("");
        })
        .catch((e) => {
          setProcessing(false);
          toast.error(e.response.data.message);
          console.log(e.response.data.message);
        });
    }
  };
  return (
    <div className="bg-[#f8f7f4] w-[100%] h-[100vh] flex justify-center items-center relative">
      <Toaster richColors position="top-right" />
      {loading ? (
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
      ) : error ? (
        <div className="">
          <h1 className="text-2xl text-center w-full p-1 font-bold mb-4">
            An error occured
          </h1>
        </div>
      ) : valid ? (
        <div className="p-2 w-full md:w-1/3 flex relative flex-col items-center">
          {processing ? (
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
          <div className="">
            <img src={anonymous} alt="Anonymzzz logo" className="w-[90px]" />
          </div>
          <h1 className="text-2xl text-center w-full p-1 font-bold mb-4">
            Send a message to: {username}
          </h1>
          <textarea
            className="w-full resize-none h-[20vh] p-2 border-2 border-gray-300 rounded-lg outline-none"
            placeholder="Enter your message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button
            className="bg-[#484672] text-white border-[1px] border-gray-300 rounded-md p-2 mt-4"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      ) : (
        <div className="">
          <h1 className="text-2xl text-center w-full p-1 font-bold mb-4">
            This link is invalid
          </h1>
        </div>
      )}
      <small className="bottom-0 absolute right-0 p-2">
        Made with &#10084; by Buchi
      </small>
    </div>
  );
};

export default SendMessage;
