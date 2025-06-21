import axios from "axios";
import cookie from "react-cookies";

const serverPath = import.meta.env.VITE_APP_API_BASE;

// login handle submit
export const HandleEmailLogin = async ({
  setUser,
  setLoading,
  values,
  setError,
  lang,
}) => {
  setLoading(true);
  await axios
    .post(`${serverPath}auth/email-login`, values, {
      headers: { lang: `${lang}` },
    })
    .then((res) => {
      const userLink = res.data.token;
      const userName = res.data.user.userName;
      setUser(res.data.user);
      // // redirect to path
      if (res.data.user.verified) {
        cookie.save("user_token", userLink, {
          path: "/",
          secure: true,
          maxAge: 36000,
        });
        window.location.replace(
          res.data.user.isAdmin ? `/dashboard` : `/user/${userName}`
        );
      } else {
        window.location.replace(`/verify-email/${userLink}`, { replace: true });
      }
    })
    .catch((err) => {
      setError(err.response.data.message);
    })
    .finally(() => setLoading(false));
};
export const HandlePhoneLogin = async ({
  setLoading,
  values,
  setError,
  lang,
}) => {
  setLoading(true);
  await axios
    .post(`${serverPath}auth/phone-login`, values, {
      headers: { lang: `${lang}` },
    })
    .then((res) => {
      // redirect to path
      window.location.assign(`/verify-otp/${res.data.verifyLink}`);
    })
    .catch((err) => {
      setError(err.response.data.message);
    })
    .finally(() => setLoading(false));
};

export const HandleResendOtp = async ({ phoneNumber, setResLoading }) => {
  setResLoading((prev) => !prev);
  await axios
    .post(`${serverPath}auth/phone-login`, { phone: phoneNumber })
    .then((res) => {
      setResLoading((prev) => !prev);
      window.location.replace(`/verify-otp/${res.data.verifyLink}`);
    });
};
export const HandleSubmitOtp = async ({
  phoneNumber,
  otpVal,
  setCorrectOtp,
  setErrorOtp,
  setLoading,
  lang,
}) => {
  setLoading(true);
  await axios
    .post(
      `${serverPath}auth/phone-login/verify`,
      {
        phoneNumber,
        otpVal,
      },
      {
        headers: { lang: `${lang}` },
      }
    )
    .then((res) => {
      const userLink = res.data.token;
      const user = res.data.user;
      setCorrectOtp(true);
      setLoading((prev) => !prev);
      setTimeout(() => {
        cookie.save("user_token", userLink, {
          path: "/",
          secure: true,
          maxAge: 36000,
        });
        window.location.replace(
          res.data.user.isAdmin ? `/dashboard` : `/user/${user.userName}`
        );
      }, 500);
    })
    .catch((err) => {
      setErrorOtp(err.response.data.message);
      setLoading(false);
    });
};
