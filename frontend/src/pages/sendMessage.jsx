import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SendMessage = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  let { username } = useParams();

  useEffect(() => {
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
          console.log(e.response.data.message);
        });
    };
    verifyLink();
  }, []);

  const sendMessage = () => {
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
          alert("successfully sent");
          setMessage("");
        })
        .catch((e) => {
          console.log(e.response.data.message);
        });
    }
  };
  return (
    <div className="bg-[#f1f1f1] w-[100%] h-[100vh] flex justify-center items-center">
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
      ) : (
        <div className="flex flex-col max-w-[100%] w-full h-[100vh] justify-center items-center">
          <div className="bg-[#0d0c22] w-[500px] send-container rounded-lg p-3 text-white  shadow-black shadow-md">
            <div className="border h-full p-2 rounded-md">
              <h2 className="m-0 text-2xl">Anonymzzz</h2>
              <small className="-mt-10">
                Let your hidden thoughts run wild!!
              </small>
              <div className="mt-5 text-md">
                <p>Send an anonymouzz message to: {username}</p>
                <textarea
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                  rows="10"
                  className="resize-none text-black p-1 rounded-md w-[100%]"
                ></textarea>
                <div className="flex w-full justify-center mt-3">
                  <button
                    on
                    className="bg-blue-500 p-2 rounded-sm cursor-pointer px-4"
                    onClick={() => {
                      sendMessage();
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendMessage;
