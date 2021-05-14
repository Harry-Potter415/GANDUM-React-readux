const initialState = {
  chekoutDetails: {},
  coupon: {},
  orders: null
};

if (localStorage.getItem("chekoutDetails") != null) {
  initialState.chekoutDetails = JSON.parse(
    localStorage.getItem("chekoutDetails")
  );
}

if (localStorage.getItem("coupon") != null) {
  initialState.coupon = JSON.parse(
    localStorage.getItem("coupon")
  );
}

export default (state = initialState, action) => {
  switch (action.type) {
    case "CHEKOUT_DETAILS":
      if (localStorage.getItem("chekoutDetails") === null) {
        localStorage.setItem("chekoutDetails", JSON.stringify(action.payload));
      }
      return {
        ...state,
        chekoutDetails: action.payload,
      };

    case "CUSTOMER_ORDERS_SUCCESS":
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };

    case "APPLY_COUPON_CHECK":
      if (localStorage.getItem("coupon") === null) {
        localStorage.setItem("coupon", JSON.stringify(action.payload));
      }
      return {
        ...state,
        coupon: action.payload,
      };

    case "APPLY_COUPON_DELETE":
        localStorage.removeItem("coupon");
      return {
        ...state,
        coupon: null,
      };
    default: {
      return state;
    }
  }
};
