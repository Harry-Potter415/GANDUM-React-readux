import {
  NEWSLETTER_LOADING,
  NEWSLETTER_SUCCESS,
  NEWLETTER_FAIL
} from "../action/newsletterAction";

const initialState = {
  newsletters: [],
  loading: false,
  success: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case NEWSLETTER_LOADING:
      return {
        ...state,
        loading: true
      };
    case NEWSLETTER_SUCCESS:
      return {
        ...state,
        newsletters: action.payload.newsletters,
        loading: false
      };
    case NEWLETTER_FAIL:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};
