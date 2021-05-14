import {
  ADD_ORDER,
  GET_USER_ORDERS,
  GET_ORDERS,
  DELETE_ORDER,
  APPLY_COUPON,
  UPDATE_ORDER
} from "../../queries/orderQuery";
import { mutation, query } from "../../utils/service_bk";
import Auth from "../../utils/auth";

export const checkoutDetailsAction = (checkoutDetailsData) => (dispatch) => {
  if (localStorage.getItem("chekoutDetails")) {
    localStorage.removeItem("chekoutDetails");
    localStorage.setItem("coupon", "{}");
    dispatch({
      type: "APPLY_COUPON_DELETE",
      payload: [],
    });
  }
  console.log("inside checkoutAction", checkoutDetailsData);
  dispatch({
    type: CHEKOUT_DETAILS,
    payload: checkoutDetailsData,
  });

  mutation(ADD_ORDER, checkoutDetailsData)
    .then((response) => {
      console.log("order add query successfull  ", response.data);
      dispatch({
        type: REMOVE_ALL_VALUE,
        payload: [],
      });
    })
    .catch((error) => {
      console.log("error from addOrder", error);
    });
};

export const getUserOrdersAction = (customer_id) => (dispatch) => {
  console.log("inside checkout action", customer_id);
  query(GET_USER_ORDERS, { user_id: customer_id })
    .then((response) => {
      console.log(
        "customer get orders succesfull  ",
        response.data.ordersbyUser
      );
      return dispatch({
        type: CUSTOMER_ORDERS_SUCCESS,
        payload: response.data.ordersbyUser,
      });
    })
    .catch((error) => {
      console.log("error from getCustomerOrders", error);
      dispatch({
        type: "CUSTOMER_FAIL",
      });
      return dispatch({
        type: ALERT_SUCCESS,
        payload: { boolean: true, message: error, error: true },
      });
    });
};

export const applyCoupon = (code) => (dispatch) => {
  console.log("inside apply coupon", code);
  query(APPLY_COUPON, { code: code })
    .then((response) => {
      console.log(
        "get coupon succesfull  ",
        response.data
      );
      return dispatch({
        type: APPLY_COUPON_CHECK,
        payload: response.data.applyCoupon,
      });
    })
    .catch((error) => {
      console.log("error from getCustomerOrders", error);
      dispatch({
        type: "CUSTOMER_FAIL",
      });
      return dispatch({
        type: ALERT_SUCCESS,
        payload: { boolean: true, message: error, error: true },
      });
    });
};

export const deleteOrder = (id) => (dispatch) => {
  mutation(DELETE_ORDER, { id: id })
    .then((response) => {
      console.log(
        "order delete succesfull",
        response.data
      );
      // dispatch({
      //   type: ALERT_SUCCESS,
      //   payload: { boolean: true, message: "Order Deleted Succesfully", error: true }
      // })
      return dispatch({
        type: CUSTOMER_ORDERS_SUCCESS,
        payload: response.data.deleteOrder,
      });
    })
    .catch((error) => {
      console.log("error from getCustomerOrders", error);
      dispatch({
        type: "CUSTOMER_FAIL",
      });
      return dispatch({
        type: ALERT_SUCCESS,
        payload: { boolean: true, message: error, error: true },
      });
    });
};

export const updateOrder = (order) => (dispatch) => {
  order.status = "Refunded";
  mutation(UPDATE_ORDER, order)
    .then((response) => {
      console.log(
        "order change succesfull",
        response.data
      );
      // dispatch({
      //   type: ALERT_SUCCESS,
      //   payload: {
      //     boolean: true,
      //     message: "Order updated successfully",
      //     error: false
      //   }
      // });
      return dispatch({
        type: CUSTOMER_ORDERS_SUCCESS,
        payload: response.data.updateOrder,
      });
    })
    .catch((error) => {
      console.log("error from getCustomerOrders", error);
      dispatch({
        type: "CUSTOMER_FAIL",
      });
      return dispatch({
        type: ALERT_SUCCESS,
        payload: { boolean: true, message: error, error: true },
      });
    });
};

export const CHEKOUT_DETAILS = "CHEKOUT_DETAILS";
export const REMOVE_ALL_VALUE = "REMOVE_ALL_VALUE";
export const ALERT_SUCCESS = "ALERT_SUCCESS";
export const GET_CUSTOMERS = "GET_CUSTOMERS";
export const CUSTOMER_ORDERS_SUCCESS = "CUSTOMER_ORDERS_SUCCESS";
export const APPLY_COUPON_CHECK = "APPLY_COUPON_CHECK";
