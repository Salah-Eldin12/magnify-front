import axios from "axios";
const serverPath = import.meta.env.VITE_APP_API_BASE;

// handle send reset password submit
export const HandleSendReset = async ({ values, setSending, setErr, lang }) => {
  setSending(true);
  await axios
    .post(
      `${serverPath}send-mail/send-reset-password`,
      {
        ...values,
        emailType: "resetPassword",
      },
      { headers: { lang: `${lang}` } }
    )
    .then((res) => {
      return window.location.replace(`/check-email/${res.data.verifyLink}`);
    })
    .catch((err) => {
      setErr(err.response.data.message);
    })
    .finally(() => setSending(false));
};

// handle send verfiy email submit
export const HandleSendVerify = async ({ setSending, email }) => {
  setSending(true);
  await axios
    .post(`${serverPath}send-mail/send-verify-email`, {
      email,
      emailType: "verifyEmail",
    })
    .then((res) => {
      // return window.location.assign(`/check-email/${res.data.verifyLink}`);
    })
    .catch((err) => console.log(err))
    .finally(() => setSending(false));
};
