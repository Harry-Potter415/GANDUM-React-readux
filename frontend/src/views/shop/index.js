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

const Shop = (props) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = React.useState([0, 2000]);

  const [category, setCategory] = useState();  //selected category
  const [showCategories, setShowCategories] = useState([]); // show category list
  const [brand, setBrand] = useState([]);
  const [sort, setSort] = useState("name");
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    if (isEmpty(props.products.products)) {
      props.productsAction();
    }

    if (isEmpty(props.brand.brands)) {
      props.brandsAction();
    }

    if (isEmpty(props.products.categories)) {
      props.categoriesAction();
    }
  }, []);

  useEffect(() => {
    setShowCategories(props.products.categories.filter(c => c.parentId === null));
  }, [props.products.categories]);

  useEffect(() => {
    if (!isEmpty(props.products.products)) {
      fillterShopProducts();
    }
  }, [props.products.products]);

  React.useEffect(() => {
    fillterShopProducts();
  }, [sort, priceRange, category, brand]);

  React.useEffect(() => {
    searchShopProducts();
  }, [props.products.topsearch]);

  const fillterShopProducts = () => {
    let tempProducts = props.products.products.filter(p => {
      let priceflag = (p.pricing.sellprice > priceRange[0] && p.pricing.sellprice < priceRange[1]);
      let brandflag = brand.length == 0 || brand.filter(b => b === p.brand.name).length > 0;
      let categoryflag = true;
      if(category != null){
        let cate = props.products.categories.filter(c => c.parentId == category.id);
        if(cate.length > 0){
          categoryflag = cate.filter(c => c.id == p.categoryId[0].id).length > 0;
        } else {
          categoryflag = p.categoryId[0].id == category.id;
        }
      }

      if(priceflag && brandflag && categoryflag){
        return p;
      }
    });

    if(sort == "name"){
      tempProducts.sort((a, b) => (a.name.localeCompare(b.name) ? 1 : -1))
    } else if(sort == "priceup") {
      tempProducts.sort((a, b) => (a.pricing.sellprice > b.pricing.sellprice) ? -1 : 1)
    } else if(sort == "pricedown") {
      tempProducts.sort((a, b) => (a.pricing.sellprice > b.pricing.sellprice) ? 1 : -1)
    }
    setFilteredProducts(tempProducts);
  };

  const searchShopProducts = () => {
    let tempProducts = props.products.products.filter(p => {
      if(p.name.indexOf(props.products.topsearch) > -1){
        return true;
      }
      return false;//dsadasdsa
    })
    setFilteredProducts(tempProducts);
  }

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    setFlag(true);
  };

  const handleBrand = (value) => {
    const currentIndex = brand.indexOf(value);
    const newBrand = [...brand];
    if (currentIndex === -1) {
      newBrand.push(value);
    } else {
      newBrand.splice(currentIndex, 1);
    }
    setBrand(newBrand);
    setFlag(true);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setFlag(true);
  };

  const changeCategory = (c) => {
    let filtercategory = props.products.categories.filter(p => p.parentId === c.id);
    if(filtercategory.length > 0){
      setShowCategories(filtercategory);
    }
    setFlag(true);
    setCategory(c);
  }

  const clearFilter = () => {
    setCategory();
    setShowCategories(props.products.categories.filter(c => c.parentId === null));
    setBrand([]);
    setSort("name");
    setFlag(false);
  }

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
      <PageTitle title="Shop" />
      <Container>
        <Grid container className="shop-row" spacing={4}>
          <Grid
            item
            lg={3}
            md={4}
            sm={4}
            xs={12}
            className="left-sidebar"
          >

            <Typography variant="h2" component="h2" gutterBottom>
              Filter Result
            </Typography>

              <List component="nav" aria-label="secondary mailbox folders">
                <ListItem button>
                  <ListItemText variant="h4" primary={filteredProducts.length+"  products found"} />
                </ListItem>
                {flag?(
                  <ListItem button>
                    <ListItemText variant="h4" primary={"Clear All Filter"} onClick={clearFilter} style={{"fontStyle": "italic", "textDecoration": "underline"}} />
                  </ListItem>
                ):null}
              </List>

            <Typography component="h2" style={{marginTop: "50px"}} gutterBottom>
              Sort By
            </Typography>

              <FormControl>
                <InputLabel id="demo-simple-select-helper-label">Sort</InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={sort}
                  onChange={handleSortChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"name"}>Name</MenuItem>
                  <MenuItem value={"priceup"}>Price(High to Low)</MenuItem>
                  <MenuItem value={"pricedown"}>Price(Low to high)</MenuItem>
                </Select>
                <FormHelperText>Some important helper text</FormHelperText>
              </FormControl>

            <Typography variant="h4" component="h4" style={{marginTop: "50px"}} gutterBottom>
              Category
            </Typography>

              <List component="nav" aria-label="secondary mailbox folders">
                {showCategories.map(c => (
                  <ListItem button key={c.id}>
                    <ListItemText onClick={() => changeCategory(c)} primary={c.name} />
                  </ListItem>
                ))}
              </List>

            <Typography variant="h4" component="h4" style={{marginTop: "50px"}} gutterBottom>
              Price
            </Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                max={2000}
              />

            <Typography variant="h4" component="h4" style={{marginTop: "50px"}} gutterBottom>
              Brand
            </Typography>

            <List>
              {props.brand.brands.map((b, i) => {

                return (
                  <ListItem key={b.id} dense button onClick={() => {handleBrand(b.name)}}>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={brand.indexOf(b.name) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': b.name }}
                      />
                    </ListItemIcon>
                    <ListItemText variant="h5" id={b.id} primary={b.name} />
                  </ListItem>
                );
              })}
            </List>

          </Grid>

          <Grid item lg={9} md={8} sm={8} xs={12} className="right-sidebar">
            <Grid container spacing={4}>
              {!isEmpty(filteredProducts) ? (
                filteredProducts
                  .map((product, index) => (
                    <Fragment key={index}>
                      {product.status === "Publish" && (
                        <Grid item lg={4} md={6} sm={6} xs={6}>
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
                    No Products Available
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
    categories: state.categories,
    brand: state.brand,
  };
};

const mapDispatchToProps = {
  productsAction,
  categoriesAction,
  brandsAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Shop);
