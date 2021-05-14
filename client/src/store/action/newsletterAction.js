import { GET_NEWSLETTERS } from "../../queries/newsletterQuery";

import { ALERT_SUCCESS } from "../reducers/alertReducer";
import { mutation, query } from "../../utils/service";
import jumpTo from "../../utils/navigation";

export const newsletterAction = (email) => (dispatch) => {
  dispatch({
    type: NEWSLETTER_LOADING,
  });
  query(GET_NEWSLETTERS, {email: email})
    .then((response) => {
      if (response) {
        return dispatch({
          type: NEWSLETTER_SUCCESS,
          payload: response.data,
        });
      }
    })
    .catch((error) => {
      return dispatch({
        type: ALERT_SUCCESS,
        payload: { boolean: true, message: error, error: true }
      });
    });
};

export const NEWSLETTER_LOADING = "NEWSLETTER_LOADING";
export const NEWSLETTER_SUCCESS = "NEWSLETTER_SUCCESS";
export const NEWLETTER_FAIL = "NEWLETTER_FAIL";
