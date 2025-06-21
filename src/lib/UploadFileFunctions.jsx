import axios from "axios";
import { FaCheck } from "react-icons/fa";
import { MdOutlineError } from "react-icons/md";

const serverPath = import.meta.env.VITE_APP_API_BASE;

// send files
export const UploadFiles = async ({
  setUploading,
  setFileName,
  setUploaded,
  images,
  setMsg,
  setImages,
  path,
  values,
  folderName,
  getText,
}) => {
  setUploading(true);
  const formData = new FormData();
  images.forEach((file) => {
    formData.append("file", file);
  });
  formData.append("project_name", values.projectName);
  formData.append("emailType", "filesUpload");
  formData.append("folderName", folderName);

  await axios
    .post(`${serverPath}upload-files/${path}`, formData, {
      onUploadProgress: (e) => {
        setUploaded(parseInt((e.loaded / e.total) * 100));
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      setMsg({
        active: true,
        text: `${res.data.message}`,
        type: "success",
        icon: FaCheck,
      });
      setUploading(false);
      setFileName("");
      setTimeout(() => {
        setUploaded(0);
        setMsg({
          active: false,
          text: res.data.message,
          type: "success",
          icon: FaCheck,
        });
        setImages([]);
      }, 2000);
    })
    .catch((err) => {
      setUploaded(0);
      setUploading(false);
      setMsg({
        active: true,
        text: getText(
          "Failed to upload files.",
          "فضلا قم برفع الملفات مرة أخرى."
        ),
        type: "failed",
        icon: MdOutlineError,
      });
    });
};

// handle delete file
export const HandleDeleteFile = ({ i, images, setImages, setUploaded }) => {
  const onDelete = [...images];
  onDelete.splice(i, 1);
  setImages(onDelete);
  setUploaded(0);
};
