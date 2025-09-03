import React, { useState } from "react";
import { useLang } from "../context/LangContext";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
/////// icons
import { LuSearch } from "react-icons/lu";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { RiInformationFill } from "react-icons/ri";
import "react-lazy-load-image-component/src/effects/opacity.css";
import { Field } from "formik";

export const InputContainer = ({
  name,
  onChangeHandle,
  placeholder,
  type,
  value,
  text,
  labelStlye,
  containerStyle,
  inputContainerStyle,
  inputStyle,
  chooses,
  errors,
  touched,
  setFieldValue,
  disabled,
  autoComplete,
  setDateErr,
}) => {
  const { lang } = useLang();
  const [showPass, setShowPass] = useState(false);

  return (
    <div
      className={`${containerStyle} max-w-[400px] text-lightGreen w-full font-medium flex items-center gap-2 
      flex-col 
        sm:text-sm md:text-md `}
    >
      {text && (
        <label
          htmlFor={name}
          className={`px-3 ${labelStlye} flex self-star justify-between w-full items-center 
          sm:text-md md:text-base`}
        >
          {text}
        </label>
      )}
      {type !== "phone" && type !== "select" && type !== "radio" && (
        <div
          className={`${inputContainerStyle}
          ${errors && touched ? "border-red-400" : "border-lightGreen"}
            ${disabled && "opacity-75 cursor-not-allowed"}
            bg-lightGreen w-full flex items-center py-[10px] px-4 rounded-[30px] border gap-2`}
        >
          <Field
            autoComplete={autoComplete}
            disabled={disabled}
            onChange={onChangeHandle}
            value={value}
            id={name}
            name={name}
            type={type === "password" ? (showPass ? "text" : "password") : type}
            className={`${inputStyle} w-full text-primary-color2 bg-transparent outline-none border-none
            disabled:cursor-not-allowed`}
            placeholder={placeholder}
          />
          {/* show password */}
          {type === "password" && (
            <button type="button" onClick={() => setShowPass(!showPass)}>
              {showPass ? (
                <FaRegEyeSlash
                  className="text-icon"
                  color="#878787"
                  size={20}
                  height="100%"
                />
              ) : (
                <FaRegEye className="text-icon" color="#878787" size={20} />
              )}
            </button>
          )}
          {/* search icon */}
          {name === "search" && (
            <button>
              <LuSearch size={20} color="#D2ECDF" />
            </button>
          )}
        </div>
      )}
      {type === "phone" && (
        <div
          className={`${inputContainerStyle} ${
            errors && touched ? "border-red-400" : "border-lightGreen"
          } ${
            disabled && "opacity-75 cursor-not-allowed"
          }  w-full flex items-center py-[8px] px-4 border gap-2`}
        >
          <PhoneInput
            countryCodeEditable={true}
            country={"jo"}
            onChange={(e) => setFieldValue("phone", e)}
            enableSearch
            inputProps={{ name: name, autoComplete: autoComplete }}
            value={value}
            inputClass={lang}
            buttonClass={lang}
            placeholder="........"
          />
        </div>
      )}
      {type === "select" && <SelectInput name={name} chooses={chooses} />}
      {type === "radio" && (
        <RadioInput
          name={name}
          setFieldValue={setFieldValue}
          lang={lang}
          setDateErr={setDateErr}
        />
      )}
      {errors && touched && (
        <div className="w-full flex items-center justify-start text-red-400 rounded-xl text-sm gap-1 px-1">
          <RiInformationFill size={18} />
          {errors}
        </div>
      )}
    </div>
  );
};

const SelectInput = ({ name, chooses }) => (
  <div
    className={`border border-primary-color2 rounded-lg 
      w-full flex items-center py-[10px] px-2 gap-2
      sm:text-sm md:text-md`}
  >
    <Field
      as="select"
      name={name}
      className=" w-full text-primary-color2 bg-transparent outline-none border-none
            disabled:cursor-not-allowed "
    >
      {chooses.map((option, i) => (
        <option className="text-primary-color2" key={i} value={option.value}>
          {option.text}
        </option>
      ))}
    </Field>
  </div>
);

const RadioInput = ({ name, setFieldValue, lang, setDateErr }) => {
  return (
    <div
      id="radio-group"
      className="flex gap-5 justify-start items-center px-1 w-full"
    >
      <div
        role="group"
        aria-labelledby="radio-group"
        className="form-control self-start "
      >
        <label className="label cursor-pointer flex gap-2">
          <span className="label-text text-sm font-medium ">
            {lang === "en" ? "Done" : "مكتمل"}
          </span>
          <Field
            type="radio"
            name={name}
            value="done"
            className="radio checked:bg-primary-color1 radio-sm"
            onChange={() => {
              setFieldValue(name, "done");
              setDateErr(false);
            }}
          />
        </label>
      </div>
      <div className="form-control self-start">
        <label className="label cursor-pointer flex gap-3 ">
          <span className="label-text text-sm font-medium ">
            {lang === "en" ? "In progress" : "قيد الانشاء"}
          </span>
          <Field
            onChange={() => {
              setFieldValue("subDate", [""]);
              setFieldValue(name, "in-progress");
              setDateErr(false);
            }}
            type="radio"
            name={name}
            value="in-progress"
            className="radio checked:bg-primary-color1 radio-sm"
          />
        </label>
      </div>
    </div>
  );
};
