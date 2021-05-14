import cookie from "react-cookies";

var user_token = cookie.load("auth");
var username = cookie.load("username");

const isAuth = () => {
  if(user_token){
    return true;
  } else {
    return false;
  }
};

const getToken = () => {
  return user_token.token;
};
const getUserId = () => {
  if(user_token)return user_token.user_id;
};

const getUser = () => {
  return user_token;
};

const setUserToken = (new_token) => {
  cookie.save("auth", new_token);
};

const getUserName = (username) => {
  return user_token.name;
};

const logout = () => {
  cookie.remove("auth");
  window.location.pathname = "/login";
};

export default {
  getToken,
  getUser,
  getUserId,
  setUserToken,
  getUserName,
  logout,
  isAuth
};
