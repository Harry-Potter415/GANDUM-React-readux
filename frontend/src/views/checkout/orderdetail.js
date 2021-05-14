import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  Typography,
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  TableHead,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@material-ui/core";
import { productsAction } from "../../store/action/productAction";
import { isEmpty } from "../../utils/helper";
import Loading from "../components/loading";
import { PayPalButton } from "react-paypal-button-v2";

const APP_KEYS = require("../../config/keys");
const payPal_ID = APP_KEYS.payPal_ID;


const OrderDetails = (props) => {
  const [subtotal, setSubTotal] = useState(0);
  const [delievery, setDelievery] = useState(0);
  const [coupon, setcoupon] = useState(0);
  const [cartProduct, setCartProduct] = useState([]);

  const cartSubTotal = () => {
    var subtotalVar = 0;
    if (cartProduct && cartProduct.length) {
      cartProduct.map((item) => {
        if (item.pricing.sellprice) {
          var sellPrice = item.pricing.sellprice * item.cartQty;
          subtotalVar = subtotalVar + sellPrice;
        } else {
          var totalPrice = item.pricing.price * item.cartQty;
          subtotalVar = subtotalVar + totalPrice;
        }
      });
    }

    let coupontemp = 0;
    if(props.checkout.coupon.code){
      if(props.checkout.coupon.discount_type === "precantage-discount"){
        coupontemp = subtotalVar*12/100;
      } else {
        coupontemp = subtotalVar;
      }
    }
    setcoupon(coupontemp);

    setSubTotal(subtotalVar);
  };

  useEffect(() => {
    if (cartProduct.length > 0) {
      cartSubTotal();
    } else {
      ListingCartProducts();
    }
  }, [cartProduct]);

  const ListingCartProducts = () => {
    var filteredProducts = [];

    props.cart.products.map((item) => {
      props.products.products.filter((product) => {
        if (product.id === item.id) {
          product.cartQty = item.qty;
          filteredProducts.push(product);
        }
      });
    });
    setCartProduct(filteredProducts);
  };

  useEffect(() => {
    if (props.cart.products && props.cart.products.length > 0) {
      if (isEmpty(props.products.products)) {
        props.productsAction();
      }
      if (props.products.products && props.products.products.length > 0) {
        ListingCartProducts();
      }
    }
  }, [props.cart.products]);

  useEffect(() => {
    if (props.products.products && props.products.products.length > 0) {
      ListingCartProducts();
    }
  }, [props.products.products]);

  useEffect(() => {
    var allData = {
      subtotal: subtotal,
      total: subtotal + delievery - coupon,
      paymentMethod: "paypal",
      coupon: coupon,
      delievery: delievery,
      products: cartProduct,
      checkoutDate: new Date(),
    };
    props.getOrderDetails(allData);
  }, [subtotal, coupon, delievery, props.cart.products]);

  return (
    <Fragment>
      {props.products.loading && <Loading />}
      <Typography variant="h3" className="margin-bottom-2">
        Your Orders
      </Typography>

      <Grid container spacing={4}>
        <Grid item md={12} sm={6} xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right">Amount</TableCell>
                </TableRow>
              </TableHead>
              {cartProduct.length > 0 ? (
                <TableBody>
                  {cartProduct.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>x{product.cartQty}</TableCell>
                      <TableCell className="text-right">
                        $
                        {product.pricing.sellprice
                          ? product.pricing.sellprice.toFixed(2) *
                            product.cartQty
                          : product.pricing.price.toFixed(2) * product.cartQty}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : null}
            </Table>

            <Table className="margin-top-3">
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography variant="h5">Subtotal</Typography>
                  </TableCell>
                  <TableCell className="text-right">${subtotal}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="h5">Shipping</Typography>
                  </TableCell>
                  <TableCell className="text-right">
                    {delievery === 0 ? "Free" : "Flat Rate: $" + delievery}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="h5">Discount</Typography>
                  </TableCell>
                  <TableCell className="text-right">
                    {coupon === 0 ? "$0" : "Coupon: $" + coupon}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="h5">Total</Typography>
                  </TableCell>
                  <TableCell className="text-right">
                    ${subtotal + delievery - coupon}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item className="text-center" md={12} sm={12} xs={12}>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            size="large"
            style={{"width": "100%","borderRadius": "5px", "marginBottom": "16px", "fontSize": "18px"}}
          >
            Proceed
          </Button>
          {props.paypalbtn &&(
          <PayPalButton
            amount={subtotal + delievery - coupon}
            // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
            onSuccess={(details, data) => {
              window.toast("Transaction completed");
              props.setPaypalbtn(false);
              props.Billing();
              // OPTIONAL: Call your server to save the transaction
              return fetch("/paypal-transaction-complete", {
                method: "post",
                body: JSON.stringify({
                  orderID: data.orderID
                })
              });
            }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    currency_code: "USD",
                    value: subtotal + delievery - coupon
                  },
                  products: cartProduct
                }]
              });
            }}
            onApprove={(data, actions) => {
              // Capture the funds from the transaction
              return actions.order.capture().then(function(details) {
                // Show a success message to your buyer
                // OPTIONAL: Call your server to save the transaction
                return fetch("/paypal-transaction-complete", {
                  method: "post",
                  body: JSON.stringify({
                    orderID: data.orderID
                  })
                });
              });
            }}
            options={{
              clientId: payPal_ID
            }}
          />
        )}
        </Grid>
      </Grid>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  products: state.products,
  checkout: state.checkoutDetail
});

const mapDispatchToProps = {
  productsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetails);
