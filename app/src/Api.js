import apisauce from "apisauce";
import apiUrl from "./config/AppConfig";

const API_URL = apiUrl.API_URL;

const create = (baseURL = API_URL) => {
  const api = apisauce.create({
    baseURL,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    timeout: 10000
  });

  const attachTokenToHeader = token => {
    api.headers.authorization = token;
  };

  const onHandleGoogleSignin = idtoken => {
    return api
      .post("auth/google-sign-up", { idtoken })
      .then(response => response.data);
  };

  const onHandleFacebookSignin = data => {
    const { accessToken, userID } = data;

    return api
      .post("auth/facebook-sign-up", { accessToken, userID })
      .then(response => response.data);
  };

  const fetchMe = token => {
    attachTokenToHeader(token);
    return api.get("auth/me").then(response => response.data);
  };

  return {
    onHandleGoogleSignin,
    onHandleFacebookSignin,
    fetchMe
  };
};

export default create;
