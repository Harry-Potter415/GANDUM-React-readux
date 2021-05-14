import React, { Fragment, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Icon,
  Grid,
  Button,
  ButtonGroup,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import PlaceHolderImg from "../assets/images/placeholder.png";
import { connect } from "react-redux";
import cookie from "react-cookies";
import { productsAction, cartChangeAction } from "../store/action/productAction";
import { removeCartItemAction } from "../store/action/cartAction";
import { isEmpty } from "../utils/helper";

const CartSide = (props) => {
  const [cartProduct, setCartProduct] = useState([]);
  const [subtotal, setSubTotal] = useState(0);
  const [delievery, setDelievery] = useState(0);

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
    setSubTotal(subtotalVar);
  };

  const removeCartItem = (item) => {
    props.removeCartItemAction(item.id);
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
    if(cartProduct.length != 0){
      cartSubTotal();
    }
  })

  useEffect(() => {
    ListingCartProducts();
  }, [props.cart]);

  return (
    <Fragment>
      {cartProduct && cartProduct.length ? (
        <Fragment>
          <Box className="cart-product">
            <Box display="flex" flexDirection="column" component="div">
              {cartProduct
                .sort((a, b) => (a.name > b.name ? 1 : -1))
                .map((item, index) => (
                  <Box
                    className="cart-item"
                    key={index}
                    style={{
                      backgroundImage: `url(${
                        item.feature_image
                          ? item.feature_image.thumbnail
                          : PlaceHolderImg
                      })`,
                    }}
                  >
                    <div className="item-inner">
                      <Icon
                        className="remove-item"
                        onClick={() => removeCartItem(item)}
                      >
                        close
                      </Icon>

                      {item.category && (
                        <Typography variant="button" className="item-category">
                          {item.category}
                        </Typography>
                      )}

                      {item.name && (
                        <Typography variant="h6" className="item-title">
                          {item.name.length > 30
                            ? item.name.substring(0, 30) + "..."
                            : item.name}
                        </Typography>
                      )}

                      <Typography
                        variant="subtitle2"
                        className="item-qty-wrapper"
                      >
                        Qty: {item.cartQty}
                        <ButtonGroup
                          variant="contained"
                          color="primary"
                          size="small"
                          aria-label="cart-qty-button-grp"
                          className="increse-decrease-buttongrp"
                        >
                          <Button onClick={() => increaseItemQty(item)}>
                            +
                          </Button>
                          <Button onClick={() => decreaseItemQty(item)}>
                            -
                          </Button>
                        </ButtonGroup>
                      </Typography>

                      <Typography variant="h6" className="item-price">
                        <span
                          className={
                            item.pricing.sellprice > 0 ? "has-sale-price" : ""
                          }
                        >
                          ${item.pricing.price.toFixed(2)}
                        </span>

                        {item.pricing.sellprice ? (
                          <span className="sale-price">
                            ${item.pricing.sellprice.toFixed(2)}
                          </span>
                        ) : null}
                      </Typography>
                      <Link
                        to={`/product/${item.id}`}
                        className="view-item"
                        onClick={props.closeCart}
                      >
                        View
                      </Link>
                    </div>
                  </Box>
                ))}
            </Box>
          </Box>

          <Box className="cart-amount">
            <Box component="div" p={3} width="100%">
              <Typography variant="h2" className="cart-amount-title">
                Summary
              </Typography>
              <Box component="div" className="cart-amount-inner">
                <Grid container className="cart-row">
                  <Grid item md={6} sm={12} xs={12}>
                    <Typography variant="h4" className="cart-td-left">
                      Subtotal
                    </Typography>
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <Typography variant="h4" className="cart-td-right">
                      ${subtotal}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container className="cart-row">
                  <Grid item md={6} sm={12} xs={12}>
                    <Typography variant="h4" className="cart-td-left">
                      DELIVERY
                    </Typography>
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <Typography variant="h4" className="cart-td-right">
                      {delievery === 0 ? "Free" : "$" + delievery}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container className="cart-row">
                  <Grid item md={6} sm={12} xs={12}>
                    <Typography variant="h4" className="cart-td-left">
                      Total
                    </Typography>
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <Typography variant="h4" className="cart-td-right">
                      ${subtotal + delievery}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Link to="/checkout">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={props.closeCart}
                >
                  CHECKOUT
                </Button>
              </Link>

              <Link to="/cart">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={props.closeCart}
                >
                  CART
                </Button>
              </Link>
            </Box>
          </Box>
        </Fragment>
      ) : (
        <Box display="flex" className="empty-cart-wrapper" p={3} width="100%">
          <Typography variant="h4">Your cart is currently empty.</Typography>

          <Link to="/shop">
            <Button
              variant="contained"
              color="primary"
              size="small"
              className="margin-left-1"
              onClick={props.closeCart}
            >
              Shop Now
            </Button>
          </Link>
        </Box>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  products: state.products,
});

const mapDispatchToProps = {
  productsAction,
  removeCartItemAction,
  cartChangeAction
};

export default connect(mapStateToProps, mapDispatchToProps)(CartSide);
