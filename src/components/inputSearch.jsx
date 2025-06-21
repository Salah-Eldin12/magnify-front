import { useLang } from "../context/LangContext";
import { IoCloseOutline } from "react-icons/io5";
import { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";

export const InputSearch = ({
  placeholder,
  search,
  setSearch,
  onChangeHandle,
  open,
  containerStyle,
  inputStyle,
  order,
  toggle,
}) => {
  const { lang } = useLang();
  const [searchDisabled, setSearchDisabled] = useState(open ? !open : true);
  const langDir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div
      id="input-search-container"
      dir={langDir}
      className={`flex items-centerjustify-end w-full !${containerStyle}\
      sm:col-span-1
     lg:col-span-1
     xl:col-span-5 `}
    >
      <div
        className={`rounded-full duration-300 
        ${
          !searchDisabled &&
          "!border-primary-color1 focus:!border-primary-color2 bg-white "
        } flex w-full ${inputStyle} border border-transparent items-center ${
          toggle && " justify-end"
        }`}
      >
        {toggle && (
          <button
            id="search-toggle"
            disabled={open}
            type="button"
            aria-controls="search"
            onClick={() => {
              setSearchDisabled(!searchDisabled);
            }}
            style={{ order: order && order }}
            className="p-3 rounded-full duration-300 bg-primary-color3 text-lightGreen hover:bg-primary-color3/50 hover:text-primary-color3
            sm:text-md md:text-md lg:text-lg 
          disabled:bg-primary-color3/80 disabled:text-lightGreen"
          >
            <BsSearch />
          </button>
        )}
        <label
          id="search"
          className={`${
            !searchDisabled
              ? "visible w-full py-2 h-fit opacity-100 flex mx-2"
              : "w-0 m-0 p-0 opacity-0 invisible "
          } relative flex duration-300 ease-in-out h-full items-center justify-between `}
        >
          {!toggle && (
            <CiSearch
              className="text-primary-color2
          sm:text-lg md:text-xl lg:text-xl"
            />
          )}
          <input
            type="text"
            name="search-name"
            value={search}
            placeholder={placeholder}
            onChange={onChangeHandle}
            className="mx-2 outline-none col-span-11 text-textColor placeholder:text-textColor w-full
        lg:text-base
        md:text-md
        sm:text-sm "
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
              }}
              className="sm:text-sm md:text-base lg:text-lg text-primary-color2 mx-4"
            >
              <IoCloseOutline />
            </button>
          )}
        </label>
      </div>
    </div>
  );
};
