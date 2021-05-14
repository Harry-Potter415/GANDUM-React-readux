import { combineReducers } from "redux";
// Reducers
import login from "./loginReducer";
import users from "./userReducer";
import alert from "./alertReducer";
import blogs from "./blogReducer";
import products from "./productReducer";
import orders from "./orderReducer";
import customers from "./customerReducer";
import brands from "./brandReducer";
import taxs from "./taxReducer";
import shippings from "./shippingReducer";
import coupons from "./couponReducer";
import reviews from "./reviewReducer";
import pages from "./pageReducer";
import settings from "./settingReducer";
import product_attributes from "./productAttributeReducer";
import newsletter from "./newsletterReducer";

// Combine Reducers
const MasterReducer = combineReducers({
  login,
  users,
  alert,
  blogs,
  products,
  orders,
  customers,
  brands,
  taxs,
  shippings,
  coupons,
  reviews,
  pages,
  settings,
  product_attributes,
  newsletter,
});

export default MasterReducer;
