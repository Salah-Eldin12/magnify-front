import { useState } from "react";
// icons
import { BsSortAlphaDown } from "react-icons/bs";
import { BiSortAlt2 } from "react-icons/bi";
// Components
import { PopUp } from "../PopUp";
import { HandleDelete } from "../../lib/DashboardReq";
import { useUser } from "../../context/UserContext";
import { useLang } from "../../context/LangContext";
import { RenderUsers } from "./ProjectInfo/RenderUsers";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { useQuery } from "react-query";
import axios from "axios";
import cookie from "react-cookies";
import UserTableSkeleton from "../Skeletons/UserTableLoading";
import { FaUserSlash } from "react-icons/fa6";
import { DeleteIcon } from "../../icons/DeleteIcon";

// Constants
const serverPath = import.meta.env.VITE_APP_API_BASE;
const axiosHeader = { headers: { token: `${cookie.load("user_token")}` } };

const UsersTable = ({ search, setSearch }) => {
  const [sort, setSort] = useState({ type: "" });
  const [page, setPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletePopUp, setDeletePopUp] = useState({ active: false, user: "" });
  const { lang } = useLang();
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  const {
    error,
    isLoading,
    isRefetching,
    data: response,
    refetch,
  } = useQuery(
    ["fetchClients", page],
    () =>
      axios
        .get(`${serverPath}user?page=${page}&limit=30`, axiosHeader)
        .then((res) => res.data),
    {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      keepPreviousData: true,
    }
  );

  if (isLoading || isRefetching) {
    return <UserTableSkeleton count={response ? response.users.length : 5} />;
  }

  const RenderUser =
    search.length > 0
      ? response?.usersSearch
          ?.filter((user) => {
            if (search.length > 0) {
              const fullName = user.fname + " " + user.lname;
              return fullName.toLowerCase().includes(search?.toLowerCase());
            } else {
              return user;
            }
          })
          .sort((a, b) => {
            if (sort.type === "number") {
              return a.projectsData?.length < b.projectsData?.length ? 1 : -1;
            } else if (sort.type === "name") {
              return a.fname > b.fname ? 1 : -1;
            }
            return 0;
          })
      : response?.users?.sort((a, b) => {
          if (sort.type === "number") {
            return a.projectsData?.length < b.projectsData?.length ? 1 : -1;
          } else if (sort.type === "name") {
            return a.fname > b.fname ? 1 : -1;
          }
          return 0;
        });

  // Handle sorting
  const handleSort = (type) => {
    setSort((prevSort) => ({ type: prevSort.type === type ? "" : type }));
  };
  const tableHead = [
    {
      text: getText("Name", "الاسم"),
      sort: () => handleSort("name"),
      icon: <BsSortAlphaDown size={18} className="text-seconder-color2" />,
      width: "min-w-[150px] md:w-1/5", // اسم، ياخد عرض أكبر في الموبايل
    },
    {
      text: getText("Email", "البريد الالكتروني"),
      width: "min-w-[200px]", // عشان الإيميل طويل
    },
    {
      text: getText("Phone No", "رقم الهاتف"),
      width: "min-w-[140px] md:w-1/5",
    },
    {
      text: getText("Owned projects", "مشاريعك"),
      sort: () => handleSort("number"),
      icon: <BiSortAlt2 size={18} className="text-seconder-color2" />,
      width: "min-w-[120px] md:w-1/5",
    },
    {
      text: "",
      width: "min-w-[100px] md:w-[150px]",
    },
  ];

  return (
    <>
      <div
        id="table"
        className="w-full max-w-full flex items-start flex-col justify-between overflow-auto"
      >
        {/* delete user popUp */}
        {deletePopUp.active && (
          <PopUp
            iconImage={<DeleteIcon className="w-[120px]" />}
            type="yes-no"
            noAction={() => setDeletePopUp(!deletePopUp)}
            loadingBtn={deleteLoading}
            yesAction={() =>
              HandleDelete({
                deleteUser: deletePopUp.user,
                setDeletePopUp,
                refetch,
                setSearch,
                setDeleteLoading,
              })
            }
          >
            <div className="w-full text-md text-center lowercase rounded-xl gap-4 flex flex-col relative">
              <p>
                {getText(
                  "Are you sure you want to delete",
                  "هل أنت متأكد أنك تريد الحذف ؟"
                )}
                <b className="mx-1">
                  {deletePopUp.user?.fname + " " + deletePopUp.user?.lname}
                </b>
              </p>
              <p className="text-md font-semibold">
                {getText(
                  "This action can’t be undone",
                  "لا يمكن التراجع عن هذا الإجراء"
                )}
              </p>
            </div>
          </PopUp>
        )}
        {!error &&
          !isLoading &&
          !isRefetching &&
          (search?.length < 1 || RenderUser?.length > 0 ? (
            <table className="table-auto w-full border-separate border-spacing-y-3 min-w-[600px] sm:table-sm md:table-md">
              <thead className="border-accent">
                <tr className="w-full border-accent overflow-hidden text-lightGreen sticky top-0  ">
                  {tableHead.map((list, i) => (
                    <th
                      key={i}
                      className={`font-normal sm:text-sm md:text-md bg-primary-color3 !py-4 
                  ${list.width} 
                  ${lang === "en" && i === 0 && "rounded-tl-xl"}
                  ${lang === "en" && i === tableHead.length - 1 && "rounded-tr-xl"} 
                  ${lang === "ar" && i === 0 && "rounded-tr-xl"}
                  ${lang === "ar" && i === tableHead.length - 1 && "rounded-tl-xl"}
                  `}
                    >
                      <div className="flex items-center justify-start gap-3">
                        <span className="w-full text-start truncate text-sm font-semibold">
                          {list.text}
                        </span>
                        {list.sort && (
                          <button onClick={list.sort}>{list.icon}</button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <RenderUsers
                setDeletePopUp={setDeletePopUp}
                search={search}
                sort={sort}
                usersSearch={response?.usersSearch}
                users={response?.users}
                isLoading={isLoading}
                isRefetching={isRefetching}
                RenderUser={RenderUser}
              />
            </table>
          ) : (
            <div
              id="table"
              className="flex gap-5 border justify-center items-center w-full rounded-xl border-primary-color3 capitalize
      text-primary-color3"
            >
              <span>
                {getText("No results for", "لا توجد نتائج باسم")} {search}
              </span>
            </div>
          ))}
        {error && <ErrorTableData getText={getText} />}
      </div>
      {/* pagination */}
      {(search?.length < 1 || RenderUser?.length > 0) && (
        <Pagination
          page={page}
          setPage={setPage}
          search={search}
          nextPage={response?.next}
          prevPage={response?.prev}
        />
      )}
    </>
  );
};

export default UsersTable;

const Pagination = ({ page, setPage, search, nextPage, prevPage }) => (
  <div dir="ltr" className="join gap-3">
    <button
      disabled={!prevPage || search}
      onClick={() => {
        setPage((p) => p - 1);
      }}
      className="join-item text-primary-color2 disabled:text-primary-color2/50"
    >
      <SlArrowLeft size={12} />
    </button>

    <button className="join-item text-primary-color2 font-medium">
      {page}
    </button>

    <button
      disabled={!nextPage || search}
      onClick={() => {
        setPage((p) => p + 1);
      }}
      className="join-item text-primary-color2 disabled:text-primary-color2/50"
    >
      <SlArrowRight size={12} />
    </button>
  </div>
);

// loading table data ui
const ErrorTableData = ({ getText }) => {
  return (
    <div
      className="h-full w-full flex flex-col gap-5 text-primary-color3 justify-center items-center 
      border border-dashed rounded-xl border-primary-color2"
    >
      <FaUserSlash className="lg:text-8xl" />
      <span className="text-lg font-semibold">
        {getText(
          "No user found yet, create some",
          "لا يوجد مستخدمين حتى الآن، قم بإنشاء مستخدمين"
        )}
      </span>
    </div>
  );
};
