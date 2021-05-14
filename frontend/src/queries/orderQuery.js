import gql from "graphql-tag";
const GET_ORDERS = gql`
  {
    orders {
      id
      user_id
      status
      shipping
      billing
      products
      date
      updated
      paymentMethod
      subtotal
      total
    }
  }
`;

const GET_ORDER = gql`
  query($id: ID!) {
    productCategory(id: $id) {
      id
      user_id
      status
      shipping
      billing
      products
      date
      updated
    }
  }
`;

const GET_USER_ORDERS = gql`
  query($user_id: ID!) {
    ordersbyUser(user_id: $user_id) {
      id
      user_id
      shipping
      billing
      products
      date
      updated
      paymentMethod
      subtotal
      total
      status
    }
  }
`;

const DELETE_ORDER = gql`
  mutation($id: ID!) {
    deleteOrder(id: $id) {
      id
      user_id
      status
      shipping
      billing
      products
      date
      updated
    }
  }
`;

const UPDATE_ORDER = gql`
  mutation(
    $id: ID!
    $billing: customObject
    $shipping: customObject
    $products: customArray
    $status: String
  ) {
    updateOrder(
      id: $id
      billing: $billing
      shipping: $shipping
      products: $products
      status: $status
    ) {
      id
      user_id
      status
      shipping
      billing
      products
      date
      updated
    }
  }
`;

const ADD_ORDER = gql`
  mutation(
    $customer_id: ID!
    $billing: customObject
    $shipping: customObject
    $products: customArray
    $paymentMethod: String
    $subtotal: Float
    $total: Float
  ) {
    addOrder(
      user_id: $customer_id
      billing: $billing
      shipping: $shipping
      products: $products
      paymentMethod: $paymentMethod
      subtotal: $subtotal
      total: $total
    ) {
      id
      shipping
      billing
      products
      date
      updated
    }
  }
`;

const APPLY_COUPON = gql`
  query($code: String) {
    applyCoupon(code: $code) {
      id
      code
      description
      discount_type
      discount_value
      free_shipping
      expire
      minimum_spend
      maximum_spend
      products
      exclude_products
      categories
      exclude_categories
      date
      updated
    }
  }
`;

export {
  GET_ORDERS,
  GET_ORDER,
  DELETE_ORDER,
  UPDATE_ORDER,
  ADD_ORDER,
  GET_USER_ORDERS,
  APPLY_COUPON
};
