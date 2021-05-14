import { combineReducers } from "redux";

import login from "./loginReducer";
import alert from "./alertReducer";
import settings from "./settingReducer";
import cart from "./cartReducer";
import products from "./productReducers";
import blogs from "./blogReducer";
import homepage from "./homepageReducer";
import checkoutDetail from "./checkoutReducer";
import faqs from "./faqReducer";
import brand from "./brandReducer";
import attribute from "./attributeReducer";
import customer from "./customerReducer";

// Combine Reducers
const appReducer = combineReducers({
  login,
  settings,
  cart,
  products,
  blogs,
  homepage,
  checkoutDetail,
  faqs,
  brand,
  attribute,
  customer,
  alert
});

const MasterReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    state = undefined;
  }

  return appReducer(state, action);
};

export default MasterReducer;
