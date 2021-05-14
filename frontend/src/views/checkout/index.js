import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  Typography,
  Box,
  Container,
  Grid,
  TextField,
  Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import OrderDetails from "./orderdetail";
import BillingForm from "./billingform";
import PageTitle from "../components/pageTitle";
import { useForm } from "react-hook-form";
import { checkoutDetailsAction } from "../../store/action/checkoutAction";
import Auth from "../../utils/auth";
import { login } from "../../utils/service_bk";

const Checkout = (props) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const { register, errors, handleSubmit } = useForm({
    mode: "onSubmit", // onBlur, onSubmit
  });
  const [billingDetails, setBillingDetails] = useState({});
  const [paypalbtn, setPaypalbtn] = useState(false);
  const Login = () => {
    login(email, password);
  };

  const Billing = (data) => {
    // console.log("ye raha sara order ka data", data);
    console.log(paypalbtn);
    if(paypalbtn){
      var token;
      try {
        token = Auth.getToken();
        console.log("token in checkout index", token);
        if (!token) {
          props.history.push("/login");
        }
      } catch (err) {
        props.history.push("/login");
      }
      if (token != null) {
        billingDetails.billing["paymentMethod"] = billingDetails.paymentMethod;
        billingDetails.customer_id = userId;
        billingDetails.products.forEach((product) => {
          product["cost"] = parseInt(product.pricing.sellprice);
          product["qty"] = parseInt(product.cartQty);
          product["product_id"] = product.id;
        });
        console.log("---->>>>  ", billingDetails);
        // console.log("data", JSON.stringify(data));
        props.checkoutDetailsAction(billingDetails);
        props.history.push("/thankyou");
      }
    } else {
      token = Auth.isAuth();
      if (!token) {
        window.toast("You should Login", "warning");
        props.history.push("/login");
        return;
      }
      setPaypalbtn(true);
    }
  };

  const getBillingData = (val) => {
    setBillingDetails({ ...billingDetails, ...val });
  };

  const getOrderDetailsData = (val) => {
    setBillingDetails({ ...billingDetails, ...val });
  };

  useEffect(() => {
    try {
      const token = Auth.getToken();
      const userId = Auth.getUserId();
      console.log("token in checkout 1--->>", token);

      if (token) {
        setToken(token);
      }
      if (userId) {
        setUserId(userId);
      }
      // setPaypalbtn(false)
    } catch (err) {
      console.log("failed to fetch token in home index ", err);
    }
  });

  return (
    <Fragment>
      <PageTitle title="Checkout" />
      {props.cart.products && props.cart.products.length ? (
        <Container>
          <Box className="checkout-wrapper" component="div">
            <Grid container>
              {!token && (
                <Grid item md={12} className="login-section">
                  <Typography variant="body1" className="login-heading">
                    If you have shopped with us before, please enter your
                    details in the boxes below. If you are a new customer,
                    please proceed to the Billing and Shipping section.
                  </Typography>
                  <TextField
                    label="Username or Email"
                    name="username"
                    variant="outlined"
                    size="small"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    name="password"
                    variant="outlined"
                    size="small"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <Button variant="contained" color="primary" onClick={Login}>
                    Login
                  </Button>
                </Grid>
              )}

              <form onSubmit={handleSubmit(Billing)}>
                <Grid
                  container
                  spacing={4}
                  className="margin-top-3 margin-bottom-3"
                >
                  <Grid item md={7} sm={12} xs={12}>
                    <BillingForm
                      registerRef={register}
                      errorRef={errors}
                      getBillingInfo={getBillingData}
                    />
                  </Grid>
                  <Grid item md={5} sm={12} xs={12}>
                    <OrderDetails getOrderDetails={getOrderDetailsData} Billing={Billing} paypalbtn = {paypalbtn} setPaypalbtn={setPaypalbtn}/>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Box>
        </Container>
      ) : (
        <Grid container justify="center">
          <Grid
            item
            md={12}
            className="margin-top-3 margin-bottom-3 text-center"
          >
            <Typography variant="h3" className="margin-bottom-1">
              Your cart is currently empty.
            </Typography>
            <Link to="/shop">
              <Button variant="contained" color="primary">
                Shop Now
              </Button>
            </Link>
          </Grid>
        </Grid>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
});

const mapDispatchToProps = {
  checkoutDetailsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
