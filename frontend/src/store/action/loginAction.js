const LoginAction = (email, password) => {
  return async (dispatch) => {
    if (email === "test@gmail.com" && password === "123") {
      dispatch({ type: "USER_LOGIN", payload: true });
      //   query(GET_PRODUCTS)
      //     .then((response) => {
      //       if (response) {
      //         return dispatch({
      //           type: PRODUCTS_SUCCESS,
      //           payload: response.data.products,
      //         });
      //       }
      //     })
      //     .catch((error) => {
      //       dispatch({
      //         type: PRODUCT_FAIL,
      //       });
      //       return dispatch({
      //         type: PRODUCT_FAIL,
      //         payload: { boolean: true, message: error, error: true },
      //       });
      //     });
      // } else {
      //   alert("Invalid username and password");
      // }
    }
  };
};

export default LoginAction;
