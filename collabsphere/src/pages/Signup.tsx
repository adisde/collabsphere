import { Eye, Key, Mail, User } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { signupInterface } from "../types/auth";
import BtnLoader from "../components/BtnLoader";
import { signup } from "../hooks/auth/signup";

export default function Signup() {
  const [formFields, setFormFields] = useState<signupInterface>({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showMsg, setMsg] = useState<string>("");
  const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  };

  const signupUser = async (e: React.ChangeEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);

      if (!formFields.email || !formFields.password) {
        setLoading(false);
        setMsg("Email and password is required.");
        return;
      }

      if(!formFields.username) {
        setLoading(false);
        setMsg("Username is required.");
        return;
      }

      if (formFields.password.length < 8) {
        setLoading(false);
        setMsg("Password must be longer than 8 characters.");
        return;
      }

      if (usernameRegex.test(formFields.username) == false) {
        setLoading(false);
        setMsg("Username must be 3-20 characters. Letters, numbers, dots, underscores, and hyphens are allowed.");
        return;
      }
 
      const result = await signup(formFields.email, formFields.password, formFields.username);

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
        <h1 className="font-semibold text-xl">Create an account!</h1>
        <p className="text-stone-500">Lorem ipsum dolor sit amet.</p>
      </div>
      <form
        id="inputs"
        className="flex flex-col w-full gap-2"
        onSubmit={signupUser}
      >
        <div id="input-wrapper" className="flex flex-col w-full gap-0.5">
          <label htmlFor="email">Username</label>
          <div
            id="wrap"
            className="flex flex-row items-center gap-2 border border-stone-300 dark:border-stone-800 px-2 py-2 rounded-md outline-none transition-all duration-100"
          >
            <User size={20} />
            <input
              type="text"
              id="username"
              name="username"
              value={formFields.username}
              onChange={handleInput}
              placeholder="johndoe11"
              required
              className="w-full outline-none border-none bg-transparent"
            />
          </div>
        </div>
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
        <div id="input-wrapper" className="flex flex-col w-full gap-0.5">
          <label htmlFor="password">Password</label>
          <div id="wrapper" className="flex flex-row gap-2">
            <div
              id="wrap"
              className="flex w-full flex-row items-center gap-2 border border-stone-300 dark:border-stone-800 px-2 py-2 rounded-md outline-none transition-all duration-100"
            >
              <Key size={20} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formFields.password}
                onChange={handleInput}
                placeholder="mail@1234"
                required
                className="w-full outline-none border-none bg-transparent"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="border p-2 rounded-md border-stone-300 dark:border-stone-800"
            >
              <Eye />
            </button>
          </div>
        </div>
        {showMsg.length > 0 && (
          <p
            id="message"
            className="text-stone-600 dark:text-stone-400 font-medium"
          >
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
          Have an account ?{" "}
          <Link to="/login" className="underline">
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
}
