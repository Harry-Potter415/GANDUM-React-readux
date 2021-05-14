import {
  CUSTOMER_LOADING,
  CUSTOMERS_SUCCESS,
  CUSTOMER_FAIL,
  CUSTOMER_SUCCESS,
} from "../action/customerAction";
import cookie from "react-cookies";

const initialState = {
  customers: [],
  customer: {},
  loading: false,
  success: false,
  wishlist: []
};

var wishlist = cookie.load("wishlist");

if (wishlist === undefined) {
  cookie.save("wishlist", [], { path: "/" });
} else {
  initialState.wishlist = wishlist;
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CUSTOMER_LOADING:
      return {
        ...state,
        loading: true,
      };
    case CUSTOMERS_SUCCESS:
      return {
        ...state,
        customers: action.payload,
        loading: false,
      };
    case CUSTOMER_SUCCESS:
      return {
        ...state,
        customer: action.payload,
        loading: false,
      };
    case CUSTOMER_FAIL:
      return {
        ...state,
        loading: false,
      };
    case "CUSTOMER_WISHLIST":
      return {
        ...state,
        wishlist: action.payload,
      }
    default:
      return state;
  }
};
