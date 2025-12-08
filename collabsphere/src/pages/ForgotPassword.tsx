import { Mail } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { forgotPasswordInterface } from "../types/auth";
import BtnLoader from "../components/BtnLoader";
import { forgot } from "../hooks/auth/forgot";

export default function ForgotPassword() {
  const [formFields, setFormFields] = useState<forgotPasswordInterface>({
    email: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [showMsg, setMsg] = useState<string>("");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  };

  const forgotUser = async (e: React.ChangeEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);

      if (!formFields.email) {
        setLoading(false);
        setMsg("Email and password is required.");
        return;
      }

      const result = await forgot(formFields.email);

      if (!result.ok) {
        setLoading(false);
        setMsg(result.message);
        return;
      }

      setMsg(result.message);
      setLoading(false);
      return;
    } catch (err: any) {
      setMsg(err.message);
      setLoading(false);
      return;
    }
  };

  return (
    <div className="flex flex-col gap-4 border border-stone-300 dark:border-stone-800 p-4 max-w-xl rounded-md mx-auto mt-10 dark:text-white">
      <div
        id="head"
        className="w-full flex flex-col justify-center items-center"
      >
        <h1 className="font-semibold text-xl">Forgot Password</h1>
        <p className="text-stone-500">Lorem ipsum dolor sit amet.</p>
      </div>
      <form
        id="inputs"
        className="flex flex-col w-full gap-2"
        onSubmit={forgotUser}
      >
        <div id="input-wrapper" className="flex flex-col w-full gap-0.5">
          <label htmlFor="email">Email address</label>
          <div
            id="wrap"
            className="flex flex-row items-center gap-2 border border-stone-300 dark:border-stone-800 px-2 py-2 rounded-md outline-none transition-all duration-100"
          >
            <Mail size={20} />
            <input
              type="email"
              id="email"
              name="email"
              value={formFields.email}
              onChange={handleInput}
              placeholder="mail@gmail.com"
              required
              className="w-full outline-none border-none bg-transparent"
            />
          </div>
        </div>
        {showMsg.length > 0 && (
          <p id="message" className="text-stone-600 dark:text-stone-400 font-medium">
            {showMsg}
          </p>
        )}
        {loading ? (
          <button
            disabled
            className="w-full bg-black text-white p-2 rounded-md cursor-not-allowed"
          >
            <BtnLoader />
          </button>
        ) : (
          <button className="w-full bg-black text-white p-2 font-semibold rounded-md hover:opacity-80 transition-all duration-100 dark:bg-white dark:text-black">
            Continue
          </button>
        )}
      </form>
      <div id="other-link" className="flex items-center justify-center">
        <p>
          Not have an account ?{" "}
          <Link to="/signup" className="underline">
            Create now
          </Link>
        </p>
      </div>
    </div>
  );
}
