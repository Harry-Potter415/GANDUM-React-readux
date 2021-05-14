import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import { Box, Container, Grid, Typography, Button } from "@material-ui/core";
import CartProductCard from "../components/cartproductcard";
import PageTitle from "../components/pageTitle";
import {
  productsAction,
  cartChangeAction
} from "../../store/action/productAction";
import { removeCartItemAction } from "../../store/action/cartAction";
import { applyCoupon } from "../../store/action/checkoutAction";

import { isEmpty } from "../../utils/helper";
import Loading from "../components/loading";

import Slider from '@material-ui/core/Slider';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';

import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';

const Cart = (props) => {
  const [cartProduct, setCartProduct] = useState([]);
  const [subtotal, setSubTotal] = useState(0);
  const [delievery, setDelievery] = useState(0);
  const [totalcount, setTotalcount] = useState(0);
  const [couponcode, setcouponcode] = useState("");
  const [coupon, setcoupon] = useState("");

  const cartSubTotal = () => {
    var subtotalVar = 0;
    var totalcountvar = 0;
    if (cartProduct && cartProduct.length) {
      cartProduct.map((item) => {
        totalcountvar += item.cartQty;
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
    setTotalcount(totalcountvar);
  };

  const removeCartItem = (item) => {
    props.removeCartItemAction(item.id);
  };

  const couponApply = (code) => {
    props.applyCoupon(code);
  };

  const increaseItemQty = (item) => {
    props.cartChangeAction({id: item.id,action: "inc"});
  };

  const decreaseItemQty = (item) => {
    props.cartChangeAction({id: item.id,action: "dec"});
  };

  useEffect(() => {
    if (isEmpty(props.products.products)) {
      props.productsAction();
    }
    if(subtotal === 0){
      cartSubTotal();
    }
  });

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

    cartSubTotal();
    setCartProduct(filteredProducts);
  };

  useEffect(() => {
    ListingCartProducts();
  }, [props.cart, props.products.products, props.checkout]);

  useEffect(() => {
    cartSubTotal();
  }, [cartProduct]);

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    table: {
      minWidth: 650,
    },
  }));

  const classes = useStyles();

  return (
    <Fragment>
      {props.products.loading && <Loading />}
      <PageTitle title="CART" />
      <Container>
        <Grid container className="shop-row" spacing={4}>
          <Grid item lg={12} md={12} sm={12} xs={12} className={classes.root}>          
              <Typography variant="h2" component="h2" gutterBottom style={{"float": "left"}}>
                {totalcount} Items in Cart
              </Typography>

              <Button
                variant="contained"
                color="primary"
                size="small"
                className="margin-left-1"
                style={{"float": "right"}}
                onClick={() => {props.history.push("/shop")}}
              >
                Continue Shopping
              </Button>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}  className="right-sidebar">
            <Grid container spacing={4}>
              {!isEmpty(cartProduct) ? 
              (
                <Grid item md={12}>
                  <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                      <TableHead style={{boderBottom:"solid 2px"}}>
                        <TableRow>
                          <TableCell colSpan="2">Product</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          cartProduct
                          .map((product, index) => (
                            <CartProductCard
                              productDetail={product}
                              index={index}
                              key={index}
                            />
                          ))
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              ) : (
                <Grid item md={12}>
                  <Typography variant="h3" className="text-center">
                    Your Cart is Empty.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Fragment>
              <Grid item md={12} sm={12} xs={12}>
                <Typography
                  variant="h3"
                  className="margin-top-2 margin-bottom-2"
                >
                  Do you have a coupon code?
                </Typography>
                <TextField
                  label="Coupon Code"
                  name="coupon-code"
                  variant="outlined"
                  size="small"
                  onChange={(e) => {setcouponcode(e.target.value)}}
                />
                <Button
                  variant="contained"
                  color="primary"
                  className="margin-left-1"
                  onClick={(e) => {couponApply(couponcode)}}
                >
                  Apply
                </Button>
              </Grid> 
            </Fragment>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Fragment>
              <Typography
                  variant="h3"
                  className="margin-top-2 margin-bottom-2"
                >
                Do you have a coupon code?
              </Typography>
              <Grid item md={12} sm={12} xs={12}>
                <TableContainer>
                  <Table>
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
                          ${(subtotal + delievery - coupon).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Button
                variant="contained"
                color="primary"
                size="small"
                className="margin-left-1"
                style={{"float": "right"}}
                onClick={() => {props.history.push("/checkout")}}
              >
                Checkout
              </Button>
            </Fragment>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  products: state.products,
  checkout: state.checkoutDetail,
  cart: state.cart
});

const mapDispatchToProps = {
  productsAction,
  removeCartItemAction,
  applyCoupon
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
