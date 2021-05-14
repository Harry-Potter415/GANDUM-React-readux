import Auth from "./auth";
import axios from "axios";
import { isEmpty } from "./helper";
import APclient from "../Client";
import { ErrorMessage } from "react-hook-form";
import { go, jumpTo, replace } from "./navigation";

import {customerWishlist} from "../store/action/customerAction";
import cookie from "react-cookies";

export const mutation = (query, variables) => {
  return APclient.mutate({
    mutation: query,
    variables,
  })
    .then((response) => {
      return Promise.resolve(response);
    })
    .catch((error) => {
      const errors = JSON.parse(JSON.stringify(error));
      console.log(errors);
      if (
        errors.graphQLErrors.length &&
        !isEmpty(errors.graphQLErrors[0].message)
      ) {
        return Promise.reject(errors.graphQLErrors[0].message);
      }

      if (
        !isEmpty(errors.networkError) &&
        errors.networkError.statusCode === 400
      ) {
        return Promise.reject(errors.message);
      }
      return Promise.reject("Something went wrong");
    });
};

export const query = (query, variables) => {
  return APclient.query({
    query: query,
    variables,
  })
    .then((response) => {
      return Promise.resolve(response);
    })
    .catch((error) => {
      const errors = JSON.parse(JSON.stringify(error));
      if (
        errors.graphQLErrors.length &&
        !isEmpty(errors.graphQLErrors[0].message)
      ) {
        return Promise.reject(errors.graphQLErrors[0].message);
      }

      if (
        !isEmpty(errors.networkError) &&
        errors.networkError.statusCode === 400
      ) {
        return Promise.reject(errors.message);
      }
      return Promise.reject("Something went wrong");
    });
};

const service = (config) => {
  //header authorization
  if (Auth.user_token) {
    const token = Auth.getToken();
    config.headers = {
      authorization: token,
    };
  }

  //interceptors handle network error
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    function (error) {
      if (!error.response) {
        error.response = {
          data: "net work error",
          status: 500,
        };
      }
      if (error.response.status === 401) {
        Auth.logout();
        jumpTo("/login");
        throw error;
      }
      return Promise.reject(error);
    }
  );
  //config.baseURL = baseUrl;
  console.log("config is----> ", config);
  return axios(config);
};
export default service;

export const login = (email, password) => {
  const body = {
    email: email,
    password: password,
  };

  axios
    .post("/api/customers/login", body)
    // .post("http://localhost:8000/api/customers/login", body)
    .then((res) => {
      console.log(res.data)
      Auth.setUserToken(res.data);
      cookie.save("wishlist", res.data.wishlist, { path: "/" });
      customerWishlist(res.data.wishlist);
      replace("/");
      return go(0);
    })
    .catch((err) => {
      if ((err.response.status == 400) | (err.response.status == 401)) {
        alert("username or password incorrect");
      }
    });
};

export const register = (
  first_name,
  last_name,
  phone,
  email,
  address,
  password
  
) => {
  const body = {
    first_name,
    last_name,
    phone,
    email,
    password,
    address
  };

  axios
    .post("/api/customers/register", body)
    // .post("http://localhost:8000/api/customers/register", body)
    .then((res) => {
      if (res.data) {
        jumpTo("/login");
        return res;
      }
    })
    .catch((err) => {
      if (err.response.status == 400) {
        alert("email already exist");
      }
    });
};

export const update = (
  firstName,
  lastName,
  email,
  password,
  phone
) => {
  const user_id = Auth.getUserId();
  const body = {
    user_id: user_id,
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: password,
    phone: phone,
  };

  axios
    .post("/api/customers/update", body)
    // .post("http://localhost:8000/api/customers/update", body)

    .then((res) => {
      if (res.data) {
        Auth.logout();
        window.location.href = "/login";
        window.toast("Profile is succefully updated.");
        return res;
      }
    })
    .catch((err) => {
      if (err.response.status == 400) {
        alert("couldn't update user");
      }
    });
};
