import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import { Box, Container, Grid, Typography } from "@material-ui/core";
import ProductCard from "../components/productcard";
import PageTitle from "../components/pageTitle";
import {
  productsAction,
  categoriesAction,
} from "../../store/action/productAction";


import {
  brandsAction
} from "../../store/action/brandAction";

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

import { makeStyles } from '@material-ui/core/styles';

const WishList = (props) => {
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (isEmpty(props.products.products)) {
      props.productsAction();
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(props.products.products)) {
      fillterShopProducts();
    }
  }, [props.products.products, props.customer.wishlist]);

  const fillterShopProducts = () => {
    let products = props.products.products.filter(p => {
      let wish = props.customer.wishlist.filter(w => w === p.id);
      if(wish.length > 0){
        return p;
      }
    })
    setFilteredProducts(products)
  };

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  return (
    <Fragment>
      {props.products.loading && <Loading />}
      <PageTitle title="WISHLIST" />
      <Container>
        <Grid container className="shop-row" spacing={4}>

          <Grid item lg={12} md={12} sm={12} xs={12} className="right-sidebar">
            <Grid container spacing={4}>
              {!isEmpty(filteredProducts) ? (
                filteredProducts
                  .map((product, index) => (
                    <Fragment key={index}>
                      {product.status === "Publish" && (
                        <Grid item lg={3} md={4} sm={6} xs={6}>
                          <ProductCard
                            productDetail={product}
                            categories={props.products.categories}
                            index={index}
                            key={index}
                            GirdProductView={true}
                          />
                        </Grid>
                      )}
                    </Fragment>
                  ))
              ) : (
                <Grid item md={12}>
                  <Typography variant="h3" className="text-center">
                    Your WishList is Empty.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    products: state.products,
    customer: state.customer
  };
};

const mapDispatchToProps = {
  productsAction,
  categoriesAction,
  brandsAction
};

export default connect(mapStateToProps, mapDispatchToProps)(WishList);
