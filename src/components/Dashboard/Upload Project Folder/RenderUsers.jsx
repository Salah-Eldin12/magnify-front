import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link } from "react-router-dom";

export const RenderUsers = ({ setDeletePopUp, RenderUser }) => {
  return (
    <>
      <tbody>
        {RenderUser?.map((user) => (
          <tr
            key={user._id}
            className="bg-white hover:bg-lightGreen odd:!bg-seconder-color2 even:!bg-seconder-color1 py-2"
          >
            <td className="capitalize truncate sm:text-sm md:text-md">
              {user.fname + " " + user.lname}
            </td>
            <td className="truncate sm:text-sm md:text-md">{user.email}</td>
            <td dir="ltr" className="truncate sm:text-sm md:text-md">
              {user.phone ? `+${user.phone}` : "_______"}
            </td>
            <td className="text-center sm:text-sm md:text-md">
              {user.projectsData.length}
            </td>
            <td className="flex justify-center gap-8 ">
              <Link
                title="edit"
                className="flex justify-center items-center "
                to={`${user.userName}`}
              >
                <MdOutlineModeEditOutline
                  title="edit"
                  color="#4B7C63"
                  size={22}
                />
              </Link>
              <button
                title="delete"
                className="flex justify-center items-center"
                onClick={() => {
                  setDeletePopUp({ active: true, user });
                }}
              >
                <RiDeleteBin6Line title="delete" color="#4B7C63" size={22} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </>
  );
};
