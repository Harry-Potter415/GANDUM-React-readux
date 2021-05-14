import cookie from "react-cookies";
import { REMOVE_VALUE } from "../action/cartAction";

const initialState = {
  products: [],
};

// if (localStorage.getItem("cartProducts") != null) {
//   initialState.products = JSON.parse(localStorage.getItem("cartProducts"));
// }

var cartItems = cookie.load("cartProducts");

if (cartItems === undefined) {
  cookie.save("cartProducts", [], { path: "/" });
} else {
  initialState.products = cartItems;
}

export default (state = initialState, action) => {
  switch (action.type) {
    case "ADD_VALUE":
      var item = action.payload;
      var products = state.products;
      let i = 0;
      for ( i = 0 ; i < products.length; i++ ) {
        if(products[i].id == item.id){break;}
      }
      if(i < products.length){
        if(item.action == "inc"){
          products[i].qty++;
        }
        if (item.action == "dec") {
          if(products[i].qty > 1){
            products[i].qty--;
          }
        }

        if(item.action == "add"){
          products[i].qty = item.qty
        }
      } else {
        if(item.action == "add"){
          products.push({
            id: item.id,
            qty: item.qty
          })
        } else {
          products.push({
            id: item.id,
            qty: 1
          })
        }
      }
      cookie.save("cartProducts", products, { path: "/" });
      return {
        ...state,
        products: products
      };

    case REMOVE_VALUE:
      var products = state.products;
      let j = 0;
      for ( j = 0 ; j < products.length; j++ ) {
        if(products[j].id == action.payload){break;}
      }
      products.splice( j , 1 );
      cookie.save("cartProducts", products, { path: "/" });
      return {
        ...state,
        products: products,
      };

    case "REMOVE_ALL_VALUE":
      if (cookie.load("cartProducts")) {
        cookie.remove("cartProducts", { path: "/" });
      }
      return {
        ...state,
        products: action.payload,
      };
    default: {
      return state;
    }
  }
};
