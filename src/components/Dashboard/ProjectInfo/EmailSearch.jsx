import { useState } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import cookie from "react-cookies";
import { useLang } from "../../../context/LangContext";
import { HandleAddAccess } from "../../../lib/DashboardReq";

const serverPath = import.meta.env.VITE_APP_API_BASE;
const userCookies = cookie.load("user_token");
const header = { headers: { token: `${userCookies}` } };

// API call
const fetchEmails = async ({ searchTerm, clientID }) => {
  if (!searchTerm) return [];
  const { data } = await axios.get(
    `${serverPath}user/users_email?q=${searchTerm}&owner_user=${clientID}`,
    header
  );
  return data;
};

const EmailSearch = ({ values, setFieldValue, projectID, clientID }) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const { lang } = useLang();

  const getText = (enText, arText) =>
    lang === "en" || !lang ? enText : arText;

  const {
    data: results = [],
    isFetching,
    isError,
  } = useQuery(
    ["emails", searchTerm],
    () => fetchEmails({ searchTerm, clientID }),
    {
      enabled: searchTerm.trim().length > 0,
      keepPreviousData: true,
      staleTime: 1000 * 60,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  const filteredResults = results.filter(
    (u) => !values.accessUser.some((x) => x.email === u.email)
  );

  return (
    <div className="relative w-full sm:max-w-[200px] md:max-w-[300px]">
      {/* input */}
      <label
        htmlFor="email-search"
        className="w-full border p-2 px-3 rounded-lg border-primary-color2 duration-200
      flex items-center gap-2 justify-between focus-within:ring-1 ring-primary-color2"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          id="email-search"
          placeholder={getText("Search email to add", "ابحث عن ايميل للإضافة")}
          className="outline-none w-full text-sm bg-transparent placeholder:text-primary-color2"
        />
        {searchTerm.length > 0 ? (
          <IoClose
            onClick={() => setSearchTerm("")}
            size={20}
            className="cursor-pointer"
          />
        ) : (
          <CiSearch size={20} />
        )}
      </label>

      {/* results */}
      {searchTerm.length > 0 && !isFetching && !isError && (
        <ul className="absolute z-10 bg-white border rounded-lg mt-1 w-full max-h-40 overflow-y-auto shadow-md">
          {filteredResults.length > 0 ? (
            filteredResults.map((user, i) => (
              <ResultEmail
                key={i}
                user={user}
                projectID={projectID}
                queryClient={queryClient}
                setFieldValue={setFieldValue}
                values={values}
                setSearchTerm={setSearchTerm}
              />
            ))
          ) : (
            <li className="p-2 text-sm text-gray-500">
              {getText("No results found", "لا توجد نتائج")}
            </li>
          )}
        </ul>
      )}

      {/* loading */}
      {isFetching && (
        <div className="absolute z-10 bg-white border rounded-lg mt-1 w-full p-2 text-sm text-primary-color2">
          {getText("Loading...", "جاري التحميل...")}
        </div>
      )}

      {/* error */}
      {isError && (
        <div className="absolute z-10 bg-white border rounded-lg mt-1 w-full p-2 text-sm text-primary-color2">
          {getText("No users found", "لا يوجد مستخدمين")}
        </div>
      )}
    </div>
  );
};

const ResultEmail = ({
  user,
  projectID,
  queryClient,
  setFieldValue,
  values,
  setSearchTerm,
}) => {
  const { lang } = useLang();

  const [loading, setLoading] = useState(false);

  // handle add email
  const handleAddEmail = async (email) => {
    await HandleAddAccess({
      projectID,
      email,
      setLoading,
      lang,
      queryClient,
      setFieldValue,
      values,
      setSearchTerm,
    });
  };

  return (
    <li
      onClick={() => !loading && handleAddEmail(user.email)}
      className={`p-2 hover:bg-gray-100 cursor-pointer text-sm text-primary-color2 border-b 
      flex justify-between items-center
      last:border-b-0
      ${loading && "bg-gray-100 !cursor-not-allowed"}`}
    >
      {user.email}
      {loading && <span className="loading loading-spinner loading-xs" />}
    </li>
  );
};

export default EmailSearch;
