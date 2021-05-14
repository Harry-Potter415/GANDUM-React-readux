import { ADD_NEWSLETTER } from "../../queries/newsletterQuery";

//import { ALERT_SUCCESS } from "../reducers/alertReducer";
import { mutation, query } from "../../utils/service";
import jumpTo from "../../utils/navigation";

export const newsletterAction = (email) => (dispatch) => {
  dispatch({
    type: NEWSLETTER_LOADING,
  });
  mutation(ADD_NEWSLETTER, {email: email})
    .then((response) => {
      window.toast("Registered succefully.");
      if (response) {
        return dispatch({
          type: NEWSLETTER_SUCCESS,
          payload: response.data,
        });
      }
    })
    .catch((error) => {
      window.toast(error ,"error");
      dispatch({
        type: NEWLETTER_FAIL,
      });
    });
};

export const NEWSLETTER_LOADING = "NEWSLETTER_LOADING";
export const NEWSLETTER_SUCCESS = "NEWSLETTER_SUCCESS";
export const NEWLETTER_FAIL = "NEWLETTER_FAIL";
