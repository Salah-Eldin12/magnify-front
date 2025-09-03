import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link } from "react-router-dom";

export const RenderUsers = ({ setDeletePopUp, RenderUser }) => {
  return (
    <tbody>
      {RenderUser?.map((user, i) => (
        <tr key={user._id}>
          <td colSpan={5} className="!p-0 !m-0">
            <div
              className={`grid 
            grid-cols-1 sm:grid-cols-[19%_25%_15%_25%_10%] md:grid-cols-[19%_30%_15%_20%_10%] xl:grid-cols-[19%_30%_15%_22%_10%]
            gap-3 items-center rounded-xl px-4 py-4
            ${
              i % 2 === 0
                ? "bg-seconder-color2/90 hover:bg-seconder-color2"
                : "bg-seconder-color1/90 hover:bg-seconder-color1"
            } 
            transition`}
            >
              <div className="capitalize truncate text-sm">
                {user.fname + " " + user.lname}
              </div>

              <div className="truncate text-sm">{user.email}</div>

              <div className="truncate text-sm" dir="ltr">
                {user.phone ? `+${user.phone}` : "_______"}
              </div>

              <div className="text-center text-sm">
                {user.projectsData.length}
              </div>

              <div className="flex justify-center gap-6">
                <Link title="edit" to={`${user.userName}`}>
                  <MdOutlineModeEditOutline color="#4B7C63" size={18} />
                </Link>
                <button
                  title="delete"
                  onClick={() => setDeletePopUp({ active: true, user })}
                >
                  <RiDeleteBin6Line color="#4B7C63" size={18} />
                </button>
              </div>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
};
