import React, { useState, useEffect, Fragment } from "react";
import { Button, Zoom, Icon, Box, Badge, IconButton, SvgIcon } from "@material-ui/core";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

import { addwishlistAction } from "../../store/action/customerAction";
import { addcart } from "../../store/action/cartAction";

import Auth from "../../utils/auth";

var PlaceHolder =
  "https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png";

const ProductCard = (props) => {
  const [prodIndex, setProdIndex] = useState("");
  const [cartQty, setCartQty] = useState(0);
  const [wishlist, setWishlist] = useState([]);
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

  const addwishlist = () => {
    props.addwishlistAction({
      id: Auth.getUserId(),
      wishlist: props.productDetail.id
    });
  }

  useEffect(() => {
    let cartproduct = props.cart.products.find(c => c.id === props.productDetail.id)
    if(cartproduct !== undefined) {
      setCartQty(cartproduct.qty);
    } else {
      setCartQty(0);
    }
    setWishlist(props.customer.wishlist);
  }, [props.cart, props.customer.wishlist]);

  const categoryListing = (categoryID) => {};
  const image = "../../../../assets/images/product/feature/large/07-1303.jpg";
  return (
    <div
      className={
        props.GirdProductView
          ? "product-card product-grid-view"
          : "product-card"
      }
      onMouseOver={() => setProdIndex(props.index)}
      onMouseOut={() => setProdIndex("")}
    >
      {checkProductCart(props.productDetail)}
      <div className="product-image-wrapper" style={{ color: "black" }}>
        <img
          src={
            props.productDetail.feature_image &&
            props.productDetail.feature_image.medium
              ? props.productDetail.feature_image.medium
              : PlaceHolder
          }
          alt="product"
        />
        <Zoom in={props.index === prodIndex ? true : false}>
          <div className="hover-content">
            <Link to={`/product/${props.productDetail.url}`}>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                className="product-btn"
              >
                View
              </Button>
            </Link>
            <Button
              variant="contained"
              color="primary"
              size="small"
              className="product-btn"
              onClick={() => addToCart(props.productDetail)}
            >
              {cartQty > 0 ? "Add More" : "Add To Cart"}
            </Button>
          </div>
        </Zoom>
      </div>
      <div className="product-details">
        {props.productDetail.categoryId && (
          <span className="product-category">
            {categoryListing(props.productDetail.categoryId)}
          </span>
        )}

        <Link to={`/product/${props.productDetail.url}`}>
          <h3 className="product-title">
            {props.productDetail.name.length > 50 ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: props.productDetail.name.substring(0, 60) + "...",
                }}
              ></span>
            ) : (
              props.productDetail.name
            )}
          </h3>
        </Link>

        <p className="product-price">
          {props.productDetail.pricing.sellprice ? (
            <span className="sale-price">
              ${props.productDetail.pricing.sellprice.toFixed(2)}
            </span>
          ) : (
            ""
          )}
          <span
            className={
              props.productDetail.pricing.sellprice ? "has-sale-price" : ""
            }
          >
            ${props.productDetail.pricing.price.toFixed(2)}
          </span>

          {props.productDetail.pricing.sellprice ? (
            <Fragment>
              {/* <span className="save-price">
                Save: $
                {(
                  props.productDetail.pricing.price -
                  props.productDetail.pricing.sellprice
                ).toFixed(2)}
                <span className="percantage-save">
                  (
                  {Math.round(
                    (100 / props.productDetail.pricing.price) *
                      (props.productDetail.pricing.price -
                        props.productDetail.pricing.sellprice)
                  )}
                  %)
                </span>
              </span> */}
              <span className="save-price">
                <span className="percantage-save">
                  {Math.round(
                    (100 / props.productDetail.pricing.price) *
                      (props.productDetail.pricing.price -
                        props.productDetail.pricing.sellprice)
                  )}
                  % off
                </span>
              </span>
            </Fragment>
          ) : null}
        </p>
        <Box component="div" display="flex" style={{justifyContent: "flex-end"}} m={2} className="menu-item">
          {Auth.isAuth()?(
            wishlist.filter(w => w === props.productDetail.id).length > 0 ?
              (<IconButton style={{"padding": "0px 12px", "color": "#673ab7"}} onClick={addwishlist}>
                <FavoriteIcon />
              </IconButton>)
              :
              (<IconButton style={{"padding": "0px 12px", "color": "#673ab7"}} onClick={addwishlist}>
                <FavoriteBorderIcon />
              </IconButton>)
          ):null}
          <Badge
            badgeContent={cartQty}
            color="secondary"
            style={{ backgroundColor: "transparent" }}
          >
            <Icon
              style={{ fontSize: 24 }}
              style={{
                backgroundColor: "#9eb876",
                borderRadius: 5,
                padding: 3,
              }}
            >
              shopping_cart
            </Icon>
          </Badge>
        </Box>
        <p>
          {props.productDetail.quantity < 1 ? (
            <span className="out-of-stock">
              <Icon>sentiment_very_dissatisfied</Icon> Out Of Stock
            </span>
          ) : null}
        </p>
        {props.productDetail.pricing.sellprice ? (
          <span className="sale-price-label">Sale</span>
        ) : null}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  customer: state.customer
});

const mapDispatchToProps = {
  addwishlistAction,
  addcart
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard);
