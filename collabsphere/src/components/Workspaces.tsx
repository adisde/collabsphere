import { BriefcaseBusiness, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Workspaces() {
  return (
    <div className="p-2 flex flex-col gap-2">
      <div className="flex flex-col">
        <h2 className="font-semibold text-lg">Your Workspaces</h2>
        <p className="font-medium text-stone-500">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam, quo.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="bg-white border border-b-stone-200 border-transparent rounded-lg py-4 px-2 flex flex-col gap-2">
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2">
                <BriefcaseBusiness size={22} />
              </div>

              <div>
                <h3 className="text-lg font-semibold leading-tight">
                  Workspace One
                </h3>
                <p className="text-stone-600 mt-1 line-clamp-1 max-w-xl">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Dolorum, libero iure expedita iste at praesentium natus
                  architecto consequuntur sequi, voluptas ex nihil quas
                  accusantium distinctio voluptate veniam maiores rem ullam. Est
                  incidunt officiis quaerat ad unde quia? Commodi, aut
                  consectetur aliquid fugit quos exercitationem quisquam numquam
                  vero saepe quaerat perspiciatis!
                </p>
              </div>
            </div>

            <button className="border border-stone-300 text-nowrap rounded-lg transition text-black hover:bg-stone-200 px-6 py-2 font-medium">
              Join Now
            </button>
          </div>
        </div>

        <div className="bg-white border border-b-stone-200 border-transparent rounded-lg py-4 px-2 flex flex-col gap-2">
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2">
                <BriefcaseBusiness size={22} />
              </div>

              <div>
                <h3 className="text-lg font-semibold leading-tight">
                  Workspace One
                </h3>
                <p className="text-stone-600 mt-1 line-clamp-1 max-w-xl">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Dolorum, libero iure expedita iste at praesentium natus
                  architecto consequuntur sequi, voluptas ex nihil quas
                  accusantium distinctio voluptate veniam maiores rem ullam. Est
                  incidunt officiis quaerat ad unde quia? Commodi, aut
                  consectetur aliquid fugit quos exercitationem quisquam numquam
                  vero saepe quaerat perspiciatis!
                </p>
              </div>
            </div>

            <button className="border border-stone-300 text-nowrap rounded-lg transition text-black hover:bg-stone-200 px-6 py-2 font-medium duration-100">
              Join Now
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-2 w-full gap-4 items-center">
        <div className="flex flex-row flex-wrap w-fit text-center items-center gap-1 text-base">
          <span>Want help setting things up?</span>
          <NavLink
            to="/dashboard/docs"
            end
            className="font-medium text-blue-600 hover:underline"
          >
            Read our documentation
          </NavLink>
        </div>
        <button className="w-full flex items-center justify-center hover:opacity-85 transition-all duration-100 gap-2 p-2 rounded-lg bg-black text-white font-medium">
          <Plus size={20} />
          Create New Workspace
        </button>
      </div>
    </div>
  );
}
