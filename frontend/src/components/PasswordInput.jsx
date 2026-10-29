import { useState } from "react";
import { PiEyeBold, PiEyeSlashBold } from "react-icons/pi";

export default function PasswordInput(props) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={visible ? "text" : "password"} className="field pr-12" />
      <button
        type="button"
        className="icon-btn absolute top-1/2 right-1 -translate-y-1/2"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <PiEyeSlashBold /> : <PiEyeBold />}
      </button>
    </div>
  );
}
