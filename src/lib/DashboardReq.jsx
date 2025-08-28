import axios from "axios";
import cookie from "react-cookies";

const userCookies = cookie.load("user_token");
const serverPath = import.meta.env.VITE_APP_API_BASE;

const header = { headers: { token: `${userCookies}` } };

//////////  For User ///////////////

// handle submit create new user
const HandleSubmitCreate = async ({
  values,
  navigate,
  setSubmiting,
  setMsg,
  lang,
  queryClient,
}) => {
  setSubmiting(true);
  await axios
    .post(
      `${serverPath}auth/create-user`,
      {
        ...values,
        emailType: "userCreated",
      },
      {
        headers: { token: `${userCookies}`, lang: `${lang}` },
      }
    )
    .then((res) => {
      const userData = res.data.data;
      navigate(`/dashboard/${userData.userName}`, { replace: true });
      queryClient.invalidateQueries({
        queryKey: ["fetchClients"],
        exact: false,
      });
    })
    .catch((err) => {
      setMsg({ active: true, msg: err.response.data.message, type: "error" });
    })
    .finally(() => {
      setSubmiting(false);
    });
};
// handle submit edit user
const SubmitEditUser = async ({
  values,
  setSubmiting,
  setMsg,
  lang,
  queryClient,
}) => {
  setSubmiting(true);

  await axios
    .put(`${serverPath}user/update-user/${values.userName}`, values, {
      headers: { token: `${userCookies}`, lang: `${lang}` },
    })
    .then((res) => {
      setMsg({ active: true, msg: res.data.message, type: "success" });
      queryClient.refetchQueries({ queryKey: ["fetchClients"], exact: false });
      queryClient.invalidateQueries({
        queryKey: ["fetchClientEdit"],
        exact: false,
      });

      setTimeout(() => {
        setMsg((prev) => ({ ...prev, active: false }));
      }, 500);
    })
    .catch((err) => {
      setMsg({ active: true, msg: err.response.data.message, type: "error" });
    })
    .finally(() => {
      setSubmiting(false);
    });
};
// delete user
const HandleDelete = async ({
  deleteUser,
  setDeletePopUp,
  refetch,
  setSearch,
  setDeleteLoading,
}) => {
  setDeleteLoading(true);

  await axios
    .delete(`${serverPath}user/delete-user/${deleteUser._id}`, header)
    .then(() => {
      setSearch("");
      refetch();
      setDeletePopUp({ active: false });
    })
    .catch((err) => console.log(err))
    .finally(() => {
      setDeleteLoading(false);
    });
};

////////// For Project ///////////////

// handle create project
const HandleCreateProject = async ({
  setLoading,
  clientData,
  navigate,
  projectInfo,
  queryClient,
}) => {
  setLoading((prev) => !prev);
  await axios
    .post(
      `${serverPath}project/${clientData._id}`,
      {
        name: `${clientData.userName}-project-${projectInfo.length + 1}`,
        number: `${projectInfo.length + 1}`,
      },
      header
    )
    .then((res) => {
      navigate(`project/${res.data.project._id}`, {
        state: { userID: clientData.userName },
      });
      queryClient.refetchQueries({ queryKey: ["fetchClients"], exact: false });
      queryClient.invalidateQueries({
        queryKey: ["fetchClientEdit"],
        exact: false,
      });
    })
    .finally(() => setLoading(false));
};
const HandleEditProject = async ({
  projectID,
  values,
  setSubmiting,
  navigate,
  setErrorMsg,
  lang,
  queryClient,
}) => {
  setSubmiting((prev) => !prev);

  await axios
    .put(`${serverPath}project/${projectID}`, values, {
      headers: { token: `${userCookies}`, lang: `${lang}` },
    })
    .then(() => {
      queryClient.refetchQueries({
        queryKey: ["fetchClientEdit"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["fetchProject"],
        exact: false,
      });
      navigate(-1);
    })
    .catch((err) => setErrorMsg(err.response.data.message))
    .finally(() => setSubmiting(false));
};
// handle upload image
const HandleUploadImg = async ({
  e,
  setUploading,
  setFieldValue,
  projectID,
  setFieldError,
}) => {
  const img = e.target.files[0];
  //  check file type
  if (
    img.type === "image/jpg" ||
    img.type === "image/png" ||
    img.type === "image/jpeg" ||
    img.type === "image/webp"
  ) {
    // check file size
    if (img.size < 5000000) {
      const file = new FormData();
      file.append("project-img", img);
      await axios
        .post(`${serverPath}upload-project-img/${projectID}`, file, {
          onUploadProgress: (e) => {
            setUploading(parseInt((e.loaded / e.total) * 100));
          },
          headers: { token: `${userCookies}` },
        })
        .then((res) => {
          const newImage = res.data.img;
          setFieldValue("img", newImage);
          setUploading();
        })
        .catch((err) => console.log(err));
    } else {
      setFieldError("img", `Image size is large than 5MB`);
    }
  } else {
    setFieldError("img", `Only type [ .jpg, .png, .jpeg, .webp ] are allowed`);
  }
};
// handle remove project
const HandleDeleteProject = async ({
  projectID,
  isOwner,
  projectInfo,
  setProjectInfo,
  index,
  userID,
}) => {
  const onRemove = [...projectInfo];
  onRemove.splice(index, 1);
  setProjectInfo(onRemove);

  await axios
    .delete(`${serverPath}project/${projectID}`, {
      headers: {
        isOwner: `${isOwner}`,
        user: `${userID}`,
        token: `${userCookies}`,
      },
    })
    .catch((err) => console.log(err));
};
// handle add project acces
const HandleAddAccess = async ({
  projectID,
  email,
  setMsg,
  setFieldValue,
  setLoading,
  values,
  lang,
}) => {
  setLoading(true);

  await axios
    .put(
      `${serverPath}project/add-access/${projectID}`,
      {
        email,
      },
      {
        headers: { token: `${userCookies}`, lang: `${lang}` },
      }
    )
    .then((res) => {
      const newEmail = res.data.accessUser;

      const EmailIndex = values.accessUser.findIndex(
        (index) => index.email === email || index.email === ""
      );
      values.accessUser.splice(EmailIndex, 1);
      values.accessUser.push(newEmail[newEmail.length - 1]);

      const addEmail = [...values.accessUser];
      setFieldValue("accessUser", addEmail);

      setMsg({
        active: true,
        msg: res.data.message,
        type: "success",
      });
      setTimeout(() => {
        setMsg((prev) => ({ ...prev, active: false }));
      }, 2000);
    })
    .catch((err) => {
      setMsg({
        active: true,
        msg: err.response.data.message,
        type: "error",
      });
    })
    .finally(() => setLoading(false));
};
// handle remove access email
const HandleRemoveAccess = async ({
  projectID,
  setFieldValue,
  setLoading,
  email,
  values,
  setMsg,
}) => {
  setLoading(true);

  await axios
    .put(
      `${serverPath}project/delete-access/${projectID}`,
      {
        email,
      },
      {
        headers: { token: `${userCookies}` },
      }
    )
    .then((res) => {
      const EmailIndex = values.accessUser.findIndex(
        (index) => index.email === email || index.email === ""
      );
      values.accessUser.splice(EmailIndex, 1);

      setFieldValue("accessUser", values.accessUser);
    })
    .catch((err) =>
      setMsg({
        active: true,
        msg: err.response.data.message,
        type: "error",
      })
    )
    .finally(() => setLoading(false));
};
// handle upload project files
const UploadProjectFolder = async ({
  projectID,
  file,
  setProgress,
  date,
  setUploading,
  closePopUp,
}) => {
  const formData = new FormData();
  formData.append("project-folder", file);
  formData.append("emailType", "uploadProjectFiles");

  await axios
    .post(`${serverPath}project/upload-folder/${projectID}`, formData, {
      params: { date: date },
      onUploadProgress: (e) => {
        setProgress(parseInt((e.loaded / e.total) * 100));
      },
      headers: {
        "Content-Type": "multipart/form-data",
        token: `${userCookies}`,
      },
    })
    .then(() => {
      setUploading("done");
      setTimeout(() => {
        closePopUp();
      }, 500);
    })
    .catch((err) => console.log(err));
};
// handle upload pilot project files
const UploadPilotProject = async ({
  file,
  setProgress,
  setUploading,
  closePopUp,
  refetch,
}) => {
  const formData = new FormData();
  formData.append("pilot-project-folder", file);

  await axios
    .post(`${serverPath}pilot_project/create-project`, formData, {
      onUploadProgress: (e) => {
        setProgress(parseInt((e.loaded / e.total) * 100));
      },
      headers: {
        "Content-Type": "multipart/form-data",
        token: `${userCookies}`,
      },
    })
    .then(() => {
      setUploading("done");
      setTimeout(() => {
        closePopUp();
        refetch();
      }, 500);
    })
    .catch((err) => console.log(err));
};

const DeletePilotProject = async ({
  project,
  setDeletePopUp,
  deletePopUp,
  refetch,
  setDeleteLoading,
}) => {
  setDeleteLoading(true);

  await axios
    .delete(`${serverPath}pilot_project/${project}`, {
      headers: {
        "Content-Type": "multipart/form-data",
        token: `${userCookies}`,
      },
    })
    .then(() => {
      setTimeout(() => {
        refetch();
      }, 500);
    })
    .catch((err) => {})
    .finally(() => {
      setDeletePopUp(!deletePopUp);
      setDeleteLoading(false);
    });
};

export {
  HandleDeleteProject,
  HandleUploadImg,
  HandleSubmitCreate,
  SubmitEditUser,
  HandleAddAccess,
  HandleRemoveAccess,
  HandleDelete,
  HandleCreateProject,
  HandleEditProject,
  UploadProjectFolder,
  UploadPilotProject,
  DeletePilotProject,
};
