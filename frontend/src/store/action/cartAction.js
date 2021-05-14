
export const removeCartItemAction = (id) => (dispatch) => {
  dispatch({
    type: REMOVE_VALUE,
    payload: id,
  });
};

export const addcart = (cartdata) => (dispatch) => {
  	dispatch({
      	type: "ADD_VALUE",
      	payload: cartdata
	});
};

export const REMOVE_VALUE = "REMOVE_VALUE";
