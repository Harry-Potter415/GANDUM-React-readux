import React, { useState, useEffect, Fragment } from "react";
import { Button, Zoom, Icon, Box, Badge, IconButton, SvgIcon, Typography, ButtonGroup } from "@material-ui/core";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

import { addcart } from "../../store/action/cartAction";

import { productsAction, cartChangeAction } from "../../store/action/productAction";
import { removeCartItemAction } from "../../store/action/cartAction";

import Auth from "../../utils/auth";

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

var PlaceHolder =
  "https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png";

const CartProductCard = (props) => {

  const [cartQty, setCartQty] = useState(0);

  const checkProductCart = (singleProduct) => {
    if (props.cart.products) {
      props.cart.products.map(
        (cartProduct) =>
          cartProduct.id === singleProduct.id && (singleProduct.cart = true)
      );
    } else {
      singleProduct.cart = false;
    }
  };

  const addToCart = (singleProduct) => {
    props.addcart({
      id: singleProduct.id,
      action: "inc",
    });
  };

  const removeCartItem = (item) => {
    props.removeCartItemAction(item.id);
  };

  const increaseItemQty = (item) => {
    props.cartChangeAction({id: item.id,action: "inc"});
    setCartQty(cartQty+1);
  };

  const decreaseItemQty = (item) => {
    props.cartChangeAction({id: item.id,action: "dec"});
    if(cartQty > 1){
      setCartQty(cartQty-1);
    }
  };

  useEffect(() => {
    setCartQty(props.productDetail.cartQty);
  }, [props.productDetail]);
  const categoryListing = (categoryID) => {};
  const image = "../../../../assets/images/product/feature/large/07-1303.jpg";
  return (
    <TableRow style={{"borderBottom": "solid 2px"}}>
      <TableCell>
        <img
          src={
            props.productDetail.feature_image &&
            props.productDetail.feature_image.medium
              ? props.productDetail.feature_image.medium
              : PlaceHolder
          }
          alt="product"
          style={{width: "150px"}}
        />
      </TableCell>
      <TableCell>
        <h2 className="product-title">
          {props.productDetail.name.length > 50 ? (
            <span
              dangerouslySetInnerHTML={{
                __html: props.productDetail.name.substring(0, 60) + "...",
              }}
            ></span>
          ) : (
            props.productDetail.name
          )}
        </h2>
        <p onClick={() => removeCartItem(props.productDetail)} style={{cursor:"pointer","borderBottom": "solid 1px","display": "unset"}}>remove</p>
      </TableCell>
      <TableCell>
        <h2 className="product-title">
          {props.productDetail.pricing.sellprice ? (
            <span className="sale-price">
              ${props.productDetail.pricing.sellprice.toFixed(2)}
            </span>
          ) : (
            ""
          )}
        </h2>
      </TableCell>
      <TableCell>
        <Typography
          variant="h2"
          className="item-qty-wrapper"
        >
          Qty: {cartQty}
          <ButtonGroup
            variant="contained"
            color="primary"
            size="small"
            aria-label="cart-qty-button-grp"
            className="increse-decrease-buttongrp"
          >
            <Button onClick={() => increaseItemQty(props.productDetail)}>
              +
            </Button>
            <Button onClick={() => decreaseItemQty(props.productDetail)}>
              -
            </Button>
          </ButtonGroup>
        </Typography>
      </TableCell>
      <TableCell>
        <h2>
          ${props.productDetail.pricing.sellprice * cartQty}
        </h2>
      </TableCell>
    </TableRow>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  customer: state.customer
});

const mapDispatchToProps = {
  addcart,
  removeCartItemAction,
  cartChangeAction
};

export default connect(mapStateToProps, mapDispatchToProps)(CartProductCard);
