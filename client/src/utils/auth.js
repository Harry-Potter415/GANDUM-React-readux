import cookie from "react-cookies";

//var user_token = JSON.parse(localStorage.getItem("auth1")) || {};
var user_token = cookie.load("auth1");
const getToken = () => {
  if (!cookie.load("auth1")) return false;
  //console.log(cookie.load("auth1"));
  return cookie.load("auth1").token;
};
const getUserId = () => {
  return user_token.user_id;
};

const getUser = () => {
  return user_token;
};

const setUserToken = (new_token) => {
  cookie.save("auth1", new_token);
  //localStorage.setItem("auth1", JSON.stringify(new_token));
};

const logout = () => {
  //localStorage.removeItem("auth1");
  cookie.remove("auth1");
  window.location.pathname = "/admin";
};

export default {
  user_token,
  getToken,
  getUser,
  getUserId,
  setUserToken,
  logout,
};
