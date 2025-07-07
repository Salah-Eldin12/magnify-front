// libraryies
import { useLang } from "../../context/LangContext";
import { useCallback, useEffect, useState } from "react";
// Functions
import { HandleDeleteFile, UploadFiles } from "../../lib/UploadFileFunctions";
// Layout
import MainLayout from "../../Layout/MainLayout";
//  components
import { SecondaryBtn } from "../../components/Btns";
// icons
import { FaCheckCircle } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { MdOutlineError } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useLocation } from "react-router-dom";
import { InputContainer } from "../../components/InputContainer";
import { Form, Formik } from "formik";
import * as Yup from "yup";

export default function UploadPage() {
  const location = useLocation().pathname;
  const [images, setImages] = useState([]);
  const [msg, setMsg] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState();
  const [fileName, setFileName] = useState();
  const { lang } = useLang();

  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  const langDir = lang === "ar" ? "rtl" : "ltr";
  const isMissingPhoto = location.includes("missing-photo");

  const AllowType = isMissingPhoto
    ? ".3gp,.mp4,.webm,.mkv,.mov,.jpg,.jpeg,.png,.webp"
    : ".3gp,.mp4,.webm,.mkv,.mov";

  const allowedTypesChange = isMissingPhoto
    ? [
        "video/quicktime",
        "video/mp4",
        "video/3gp",
        "video/webm",
        "video/mkv",
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/webp",
      ]
    : ["video/mp4", "video/3gp", "video/webm", "video/mkv", "video/quicktime"];

  const maxSize = 100 * 1024 * 1024; // 100MB

  // Message display
  const showMessage = useCallback((text, type, icon) => {
    setMsg({ active: true, text, type, icon });
    setTimeout(() => setMsg((prev) => ({ ...prev, active: false })), 4000);
  }, []);

  const HandleChange = useCallback(
    (e) => {
      if (uploading) return null;
      else {
        setMsg({});
        setUploaded(0);
        setUploading(false);
        setFileName(null);

        const files = Array.from(e.target.files);
        const validFiles = [];
        files.forEach((file) => {
          if (!allowedTypesChange.includes(file.type)) {
            showMessage(
              getText(
                `${file.name} is invalid`,
                `${file.name} صيغة غير مسموح بها`
              ),
              "failed",
              MdOutlineError
            );
          } else if (file.size > maxSize) {
            showMessage(
              getText(
                `${file.name} exceeds the maximum size`,
                `${file.name} اكبر من الحجم المسموح به`
              ),
              "failed",
              MdOutlineError
            );
          } else if (images.some((img) => img.name === file.name)) {
            showMessage(
              getText(
                `${file.name} Already selected`,
                `${file.name} تم اختياره من قبل`
              ),
              "failed",
              MdOutlineError
            );
          } else {
            validFiles.push(file);
          }
        });
        if (validFiles.length > 0) {
          setImages((prev) => [...prev, ...validFiles]);
        }
      }
    },
    [allowedTypesChange, images, maxSize, showMessage, uploading]
  );

  useEffect(() => {
    const unloadCallback = (event) => {
      if (images.length > 0) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, [images]);

  // files selected
  const ShowFile = images.map((file, i) => (
    <div
      dir="ltr"
      key={i}
      id="file"
      className="w-full bg-primary-color4 py-2 px-2 flex justify-between items-center rounded-lg"
    >
      <span className="w-10/12 sm:text-xs text-ellipsis md:text-md line-clamp-1">
        {file.name}
      </span>
      {uploading ? (
        <span className="loading loading-spinner w-8 text-white" />
      ) : msg?.type === "success" ? (
        <FaCheckCircle color="green" size={20} />
      ) : (
        <button
          onClick={() =>
            HandleDeleteFile({ i, images, setImages, setUploaded })
          }
        >
          <LazyLoadImage
            src="/assets/icon6.svg"
            alt="delete-photo-icon"
            width={25}
          />
        </button>
      )}
    </div>
  ));

  const FieldSchema = Yup.object().shape({
    projectName: Yup.string().required(
      getText("project name is required", "اسم المشروع مطلوب")
    ),
  });
  const pageName = location.includes("missing-photo");

  console.log("uploaded", uploaded, "//////", "uploading", uploading);

  return (
    <MainLayout
      type="upload-files"
      pageTitle={pageName ? "Missing Photo" : "Photo Session Data"}
    >
      <div
        dir={langDir}
        className="flex h-full overflow-hidden row-span-11 flex-col gap-5 justify-center items-center max-w-[2000px]
         md:w-8/12 lg:w-6/12 relative container "
      >
        <h2
          className="text-primary-color1 font-bold capitalize w-full text-center
        sm:text-lg
        md:text-xl
        lg:text-2xl "
        >
          {isMissingPhoto ? "missing photos" : "photo session data"}
        </h2>
        {/* alert message */}
        <div
          className={` ${
            msg?.type === "success" ? "bg-lightGreen" : "bg-errorContainer"
          } 
              ${
                msg?.active ? " flex" : "hidden"
              } rounded-lg font-normal py-2 px-3 flex items-center text-black justify-between gap-2 w-full max-w-full
            `}
        >
          <span className="w-11/12 sm:text-[12px] md:text-[16px] ">
            {msg?.text}
          </span>
          <button
            className="ml-2"
            onClick={() =>
              setMsg({
                ...msg,
                active: false,
                type: "failed",
                icon: MdOutlineError,
              })
            }
          >
            <IoIosClose size={22} />
          </button>
        </div>
        {/* choose files area */}
        {images.length < 1 && (
          <div
            id="upload-area"
            className=" flex flex-col items-center py-10 rounded-xl w-full
          justify-center gap-5 bg-lightGreen text-primary-color1 relative"
          >
            <img
              src="/assets/icon9.svg"
              className="sm:w-[100px] md:w-[150px] h-[110px] object-fill"
            />
            <input
              accept={AllowType}
              onChange={uploading ? null : HandleChange}
              type="file"
              multiple
              className={`absolute w-full h-full opacity-0 ${
                uploading ? "cursor-not-allowed" : " cursor-pointer"
              }`}
            />
            <span
              className="text-center flex items-center px-6 
            sm:text-xs 
            md:text-md md:gap-2"
            >
              {getText(
                `Only [ ${AllowType} ] format are allowed and max size 100M`,
                `الصيغ المسموح بها  فقط [ ${AllowType} ] و حجم الملف لايزيد عن 100 MB`
              )}
            </span>
            <SecondaryBtn
              type="button"
              text={getText("browse images", "تصفح الصور")}
            />
          </div>
        )}
        {/* show files chosen */}
        {images.length > 0 && (
          <div
            id="files"
            className="flex flex-col  h-[60%] gap-5 justify-between items-center
            rounded-xl bg-lightGreen py-3 px-3 overflow-y-scroll w-full "
          >
            <div id="show-choosen-files" className="flex flex-col gap-2 w-full">
              {ShowFile}
            </div>
            {/* upload another photo */}
            {!uploading && !uploaded && (
              <div id="upload-another-photo" className="w-fit h-fit relative">
                <input
                  accept=".3gp,.mp4, .webm, .mkv, .mov, .jpg, .jpeg, .png, .webp"
                  onChange={uploading ? null : HandleChange}
                  type="file"
                  multiple
                  className={`absolute w-full h-full opacity-0 ${
                    uploading ? "cursor-not-allowed" : " cursor-pointer"
                  }`}
                />
                <SecondaryBtn
                  style="!bg-lightGreen !border-primary-color2 !text-primary-color2 hover:!bg-primary-color2"
                  text={getText("Add Files", "اضف صورة")}
                />
              </div>
            )}
          </div>
        )}
        {/* upload buttom */}
        {images.length > 0 && (
          <Formik
            initialValues={{ projectName: "" }}
            validationSchema={FieldSchema}
            onSubmit={(values) =>
              UploadFiles({
                setUploading,
                setFileName,
                setUploaded,
                images,
                setMsg,
                setImages,
                path: isMissingPhoto ? "missing-upload" : "session-upload",
                values,
                getText: getText(),
                folderName: isMissingPhoto
                  ? "missing photos"
                  : "photo session data",
              })
            }
          >
            {({ values, errors, touched, handleChange }) => (
              <Form className="flex gap-3 items-center justify-center flex-col min-w-[300px] w-7/12 ">
                {fileName && (
                  <span className="w-full truncate text-center">
                    {fileName}
                  </span>
                )}
                {/* uploading progress */}
                {uploading && (
                  <span
                    perc={`${uploaded}%`}
                    className="w-full h-3 bg-gray-200 relative rounded-xl 
                  before:content-[attr(perc)] before:absolute before:-right-14 before:-top-[5px]"
                  >
                    <span
                      style={{ width: `${uploaded}%` }}
                      className={`h-full absolute bg-green-600
                    rounded-xl duration-200 ease-linear `}
                    />
                  </span>
                )}
                {/* upload button */}
                <div className=" gap-3 flex items-center flex-col w-full ">
                  {!uploading && (
                    <InputContainer
                      errors={errors.projectName}
                      touched={touched.projectName}
                      disabled={uploading}
                      name="projectName"
                      type="text"
                      placeholder={getText("project name", "اسم المشروع")}
                      containerStyle="!w-full"
                      onChangeHandle={(e) => handleChange(e)}
                      value={values.projectName}
                    />
                  )}
                  <SecondaryBtn
                    type="submit"
                    text={getText("upload files", "رفع الصور")}
                    loading={uploading}
                    disabled={uploading || uploaded === 100}
                  />
                  {/* show files counter */}
                  <span
                    id="uploaded-files"
                    className="capitalize text-gray-500  sm:text-xs md:text-md"
                  >
                    {+" " + images.length + " "}
                    {getText("files choosen", "عدد الصورة")}
                  </span>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </MainLayout>
  );
}
