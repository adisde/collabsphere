import { Key, Mail, User } from "lucide-react";

export default function Profile() {
  return (
    <div className="p-2 flex flex-col gap-2 w-full">
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold">Welcome Julia</h2>
        <p className="font-medium text-stone-500">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione,
          quasi.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1 items-start">
          <label htmlFor="email">Email address</label>
          <div className="flex flex-row items-center gap-2 rounded-lg border p-2 w-full border-stone-300">
            <Mail size={20} />
            <input
              type="email"
              name="email"
              id="email"
              className="w-full px-1 outline-none"
              placeholder="mail@gmail.org"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 items-start">
          <label htmlFor="password">Password</label>
          <div className="flex flex-row items-center gap-2 rounded-lg border p-2 w-full border-stone-300">
            <Key size={20} />
            <input
              type="email"
              name="email"
              id="email"
              className="w-full px-1 outline-none"
              placeholder="mail@gmail.org"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 items-start">
          <label htmlFor="username">Username</label>
          <div className="flex flex-row items-center gap-2 rounded-lg border p-2 w-full border-stone-300">
            <User size={20} />
            <input
              type="text"
              name="username"
              id="username"
              className="w-full px-1 outline-none"
              placeholder="Julia@12"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row gap-2">
            Joined on: <p className="font-medium">26/2/2035</p>
          </div>
          <div className="flex flex-row gap-2">
            Last updated: <p className="font-medium">22/12/2035</p>
          </div>
        </div>
        <button className="p-2 bg-black text-white hover:opacity-90 rounded-lg transition-all duration-100">Save Changes</button>
      </div>
    </div>
  );
}
