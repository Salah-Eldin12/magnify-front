import React, { useState, useCallback, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import cookie from "react-cookies";
// icons
import { MdOutlineModeEditOutline } from "react-icons/md";
import { BsSortAlphaDown } from "react-icons/bs";
import { BiSortAlt2 } from "react-icons/bi";
import { BiSolidError } from "react-icons/bi";
// Components
import { NotFoundInList } from "../NotFoundInList";
import { RiDeleteBin6Line } from "react-icons/ri";
import UserTableSkeleton from "../Skeletons/UserTableSkeleton";
import { Link, useSearchParams } from "react-router-dom";

// Constants
const serverPath = import.meta.env.VITE_APP_API_BASE;
const axiosHeader = { headers: { token: `${cookie.load("user_token")}` } };

const UsersTable = ({
  lang,
  search,
  setDeleteUser,
  page,
  setNextPage,
  setPopUp,
  navigate,
}) => {
  const [sort, setSort] = useState({ type: "" });
  const [users, setUsers] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);

  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  // Fetch user data
  const { error, isLoading, isRefetching } = useQuery(
    ["fetchClients", page],
    () =>
      axios.get(`${serverPath}user?page=${page}`, axiosHeader).then((res) => {
        setUsers(res.data.users);
        setNextPage(res.data.next);
        setSearchUsers(res.data.usersSearch);
      }),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
  if (isLoading || isRefetching) {
    setNextPage(false);
  }
  // Handle sorting
  const handleSort = useCallback(
    (type) => {
      setSort((prevSort) => ({ type: prevSort.type === type ? "" : type }));
    },
    [sort]
  );

  const tableHead = [
    {
      text: getText("Name", "الاسم"),
      sort: () => handleSort("name"),
      icon: <BsSortAlphaDown size={20} className="text-seconder-color2" />,
    },
    {
      text: getText("Email", "البريد الالكتروني"),
    },
    {
      text: getText("Phone No", "رقم الهاتف"),
    },
    {
      text: getText("Owned projects", "مشاريعك"),
      sort: () => handleSort("number"),
      icon: <BiSortAlt2 size={20} className="text-seconder-color2" />,
    },
    {
      text: "",
    },
  ];
  // Filter and sort users with useMemo
  const RenderUser =
    search !== ""
      ? searchUsers
          ?.filter((user) => {
            const fullName = user.fname + " " + user.lname;
            return search
              ? fullName.toLowerCase().includes(search?.toLowerCase())
              : true;
          })
          .sort((a, b) => {
            if (sort.type === "number") {
              return a.projectsData?.length < b.projectsData?.length ? 1 : -1;
            } else if (sort.type === "name") {
              return a.fname > b.fname ? 1 : -1;
            }
            return 0;
          })
      : users?.sort((a, b) => {
          if (sort.type === "number") {
            return a.projectsData?.length < b.projectsData?.length ? 1 : -1;
          } else if (sort.type === "name") {
            return a.fname > b.fname ? 1 : -1;
          }
          return 0;
        });

  return (
    <div
      id="users-table"
      className="w-full max-w-full h-full flex items-start flex-col justify-start overflow-auto"
    >
      <table className="table w-full rounded-full border-separate border-spacing-y-2 sm:table-sm md:table-md table-zebra">
        <thead className="rounded-full border-accent ">
          <tr className="w-full border-accent overflow-hidden rounded-full text-lightGreen sticky top-0">
            {tableHead.map((list, i) => (
              <th
                key={i}
                className="font-normal sm:text-sm md:text-md  bg-primary-color3"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="w-full truncate">{list.text}</span>
                  {list.sort && (
                    <button onClick={list.sort}>{list.icon}</button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        {isLoading || isRefetching ? (
          <UserTableSkeleton />
        ) : (
          <TableBody
            setPopUp={setPopUp}
            navigate={navigate}
            setDeleteUser={setDeleteUser}
            RenderUser={RenderUser}
          />
        )}
      </table>
      {RenderUser?.length < 1 && !isLoading && !isRefetching && !error && (
        <NotFoundInList
          color="#497B62"
          text={getText("No user found", "لا يوجد مستخدم بهذا الاسم")}
          textStyle="text-primary-color1"
        />
      )}
      {error && (
        <div className="h-full w-full flex flex-col gap-2 text-primary-color3 justify-center items-center">
          <BiSolidError className="lg:text-8xl" />
          <span className="text-2xl font-semibold">
            {getText("Error 404", "خطأ 404")}
          </span>
        </div>
      )}
    </div>
  );
};

const TableBody = ({ setPopUp, navigate, setDeleteUser, RenderUser }) => {
  return (
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
                setPopUp(true);
                setDeleteUser(user);
              }}
            >
              <RiDeleteBin6Line title="delete" color="#4B7C63" size={22} />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default UsersTable;
