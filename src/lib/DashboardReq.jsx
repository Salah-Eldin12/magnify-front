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
    })
    .catch((err) => {
      setMsg({ active: true, msg: err.response.data.message, type: "error" });
    })
    .finally(() => {
      setSubmiting(false);
    });
};
// handle submit edit user
const SubmitEditUser = async ({ values, setSubmiting, setMsg, lang }) => {
  setSubmiting(true);
  await axios
    .put(`${serverPath}user/update-user/${values.userName}`, values, {
      headers: { token: `${userCookies}`, lang: `${lang}` },
    })
    .then((res) => {
      setMsg({ active: true, msg: res.data.message, type: "success" });

      setTimeout(() => {
        setMsg((prev) => ({ ...prev, active: false }));
      }, 1000);
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
// refetch access queries

const refetchAccessQueries = (queryClient) =>
  Promise.all([
    queryClient.refetchQueries({ queryKey: ["fetchClients"], exact: false }),
    queryClient.refetchQueries({ queryKey: ["fetchClientEdit"], exact: false }),
  ]);
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
  setMsg,
  lang,
  queryClient,
}) => {
  setSubmiting((prev) => !prev);

  await axios
    .put(`${serverPath}project/${projectID}`, values, {
      headers: { token: `${userCookies}`, lang: `${lang}` },
    })
    .then((res) => {
      queryClient.refetchQueries({
        queryKey: ["fetchClientEdit"],
        exact: false,
      });
      setMsg({ active: true, content: res.data.message, type: "success" });
      setTimeout(() => {
        setMsg((prev) => ({ ...prev, active: false }));
      }, 2000);
    })
    .catch((err) =>
      setMsg({
        active: true,
        content: err.response.data.message,
        type: "error",
      })
    )
    .finally(() => setSubmiting(false));
};
// handle upload image
const HandleUploadImg = async ({
  e,
  setUploading,
  setFieldValue,
  projectID,
  setFieldError,
  getText,
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
      setFieldError(
        "img",
        getText("Image size is large than 5MB", "حجم الملف اكبر من 5 MB ")
      );
    }
  } else {
    setFieldError(
      "img",
      getText(
        "Only type [ .jpg, .png, .jpeg, .webp ] are allowed",
        "صيغة الملف المسموح بها [ .jpg, .png, .jpeg, .webp ] فقط"
      )
    );
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
  queryClient,
}) => {
  const onRemove = [...projectInfo];
  onRemove.splice(index, 1);
  setProjectInfo(onRemove);

  try {
    await axios.delete(`${serverPath}project/${projectID}`, {
      headers: {
        isOwner: `${isOwner}`,
        user: `${userID}`,
        token: `${userCookies}`,
      },
    });
    (queryClient.refetchQueries({ queryKey: ["fetchClients"], exact: false }),
      queryClient.refetchQueries({ queryKey: ["fetchProject"], exact: false }));
  } catch (err) {
    (err) => console.log(err);
  }
};

// handle add project acces
const HandleAddAccess = async ({
  projectID,
  email,
  setLoading,
  lang,
  queryClient,
  setFieldValue,
  values,
  setSearchTerm,
}) => {
  try {
    setLoading(true);

    const res = await axios.put(
      `${serverPath}project/add-access/${projectID}`,
      { email },
      {
        headers: { token: `${userCookies}`, lang },
      }
    );

    setSearchTerm("");
    await refetchAccessQueries(queryClient);
    const updated = [
      ...values.accessUser,
      { email, _id: res.data?.id || Date.now() },
    ];
    setFieldValue("accessUser", updated);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

// handle remove access email
const HandleRemoveAccess = async ({
  projectID,
  setFieldValue,
  setLoading,
  email,
  values,
  setMsg,
  queryClient,
}) => {
  try {
    setLoading(true);

    await axios.put(
      `${serverPath}project/delete-access/${projectID}`,
      { email },
      {
        headers: { token: `${userCookies}` },
      }
    );

    const updated = values.accessUser.filter((u) => u.email !== email);

    setFieldValue("accessUser", updated);

    await refetchAccessQueries(queryClient);
  } catch (err) {
    setMsg({
      active: true,
      msg: err?.response?.data?.message || "Something went wrong",
      type: "error",
    });
  } finally {
    setLoading(false);
  }
};

// handle upload project files
const UploadProjectFolder = async ({
  projectID,
  file,
  setProgress,
  date,
  setUploading,
  closePopUp,
  setErr,
  getText,
  signal,
  setFile,
  projectType,
  lang,
}) => {
  const formData = new FormData();
  formData.append("project-folder", file);
  formData.append("emailType", "uploadProjectFiles");
  if (!file) {
    setErr(getText("No file selected", "لم يتم اختيار ملف"));
    return;
  }
  await axios
    .post(`${serverPath}project/upload-folder/${projectID}`, formData, {
      signal,
      params: { date: date, projectType: projectType },
      onUploadProgress: (e) => {
        if (e.total) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      },
      headers: {
        "Content-Type": "multipart/form-data",
        token: `${userCookies}`,
        lang: `${lang}`,
      },
    })
    .then(() => {
      setUploading("done");
      setTimeout(() => {
        closePopUp();
      }, 500);
    })
    .catch((err) => {
      if (axios.isCancel(err)) {
        setProgress(0);
        setFile(null);
        setUploading("wait");
      } else {
        setProgress(0);
        setFile(null);
        setUploading("wait");
        if (err && err?.response?.status === 400) {
          setErr(err.response.data.message);
        } else {
          setErr(
            getText(
              "Error occured while uploading please try agin",
              "حدث خطا اثناء رفع المشروع, حاول مرة اخري"
            )
          );
        }
      }
    });
};
// delete sub project date
const DeleteSubProject = async ({
  date,
  projectID,
  setLoading,
  setFieldValue,
  updated,
  i,
  setNoDate,
}) => {
  if (!projectID || !date) {
    updated.splice(i, 1);
    setFieldValue("subDate", updated);
    setNoDate(false);

    return;
  }
  console.log(projectID, date);

  setLoading(true);
  await axios
    .delete(`${serverPath}project/delete-sub-project/${projectID}`, {
      data: { date },
      headers: {
        token: userCookies,
        "Content-Type": "application/json",
      },
    })
    .then(() => {
      setLoading(false);
      updated.splice(i, 1);
      setFieldValue("subDate", updated);
      setNoDate(false);
    })
    .catch((err) => console.log(err));
};
// cancel upload
const CancelUploadRequest = async ({
  projectID,
  date,
  projectType,
  uploadFor,
  file,
  refetch,
}) => {
  try {
    await axios
      .delete(`${serverPath}project/cancel-upload/${projectID}`, {
        data: { projectType, date, uploadFor, file },
        headers: {
          token: `${userCookies}`,
        },
      })
      .then(() => {
        if (uploadFor === "pilot") refetch();
      });
  } catch (err) {
    console.error("Cancel upload request failed:", err);
  }
};

// handle upload pilot project files
const UploadPilotProject = async ({
  file,
  setProgress,
  setUploading,
  closePopUp,
  refetch,
  getText,
  setFile,
  setErr,
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
    .catch((err) => {
      if (axios.isCancel(err)) {
        setProgress(0);
        setFile(null);
        setUploading("wait");
      } else {
        setProgress(0);
        setFile(null);
        setUploading("wait");
        if (err && err?.response?.status === 400) {
          setErr(err.response.data.message);
        } else {
          setErr(
            getText(
              "Error occured while uploading please try agin",
              "حدث خطا اثناء رفع المشروع, حاول مرة اخري"
            )
          );
        }
      }
    });
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
  CancelUploadRequest,
  DeleteSubProject,
};
