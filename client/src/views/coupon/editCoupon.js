import React, { Fragment, useState, useEffect } from "react";
import viewStyles from "../viewStyles";
import {
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Tab,
  Tabs,
  Input,
  Chip,
  FormControlLabel,
  Checkbox,
  useMediaQuery,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import clsx from "clsx";
import {
  categoriesAction,
  productsAction,
  couponUpdateAction,
  couponsAction,
} from "../../store/action/";
import { useSelector, useDispatch } from "react-redux";
import { Alert, Loading, TopBar, TextInput, CardBlocks } from "../components";
import {
  TabPanel,
  a11yProps,
  couponObj,
  getSelectedName,
  MenuProps,
} from "./coupon-components";
import { isEmpty } from "../../utils/helper";

const EditCoupon = (props) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const Products = useSelector((state) => state.products);
  const Coupons = useSelector((state) => state.coupons);
  const dispatch = useDispatch();
  const classes = viewStyles();
  const [tabVal, setTabVal] = useState("general");
  const [coupon, setCoupon] = useState(couponObj);

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);

  useEffect(() => {
    if (!isEmpty(Coupons.coupons)) {
      Coupons.coupons.map((editcoupon) => {
        if (editcoupon.id === props.match.params.id) {
          setCoupon({ ...coupon, ...editcoupon });
        }
      });
      setLabelWidth(inputLabel.current.offsetWidth);
    }
  }, [Coupons]);

  useEffect(() => {
    if (isEmpty(Products.products)) {
      dispatch(productsAction());
    }
    if (isEmpty(Products.categories)) {
      dispatch(categoriesAction());
    }
    if (isEmpty(Coupons.coupons)) {
      dispatch(couponsAction());
    }
  }, []);

  const tabChange = (event, newValue) => {
    setTabVal(newValue);
  };

  const updateCoupon = () => {
    dispatch(couponUpdateAction(coupon));
  };

  const handleChange = (e) => {
    setCoupon({ ...coupon, [e.target.name]: e.target.value });
  };

  const selectChange = (e) => {
    setCoupon({ ...coupon, [e.target.name]: e.target.value });
  };

  const SelectOptionField = ({ label, name, value, children, id }) => {
    return (
      <FormControl
        variant="outlined"
        className={classes.marginBottom}
        fullWidth
      >
        <InputLabel id={id}>{label}</InputLabel>
        <Select
          labelId={id}
          multiple
          onChange={selectChange}
          input={<Input id="select-multiple-chip" variant="outlined" />}
          value={value}
          name={name}
          renderValue={(selected) => (
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={getSelectedName(
                    value,
                    name,
                    Products.products,
                    Products.categories
                  )}
                  style={{ margin: 2 }}
                />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
          fullWidth
        >
          {children}
        </Select>
      </FormControl>
    );
  };

  return (
    <Fragment>
      <Alert />
      {Products.loading || Coupons.loading ? <Loading /> : null}
      <TopBar
        title="Edit Coupon"
        onSubmit={updateCoupon}
        submitTitle="Update"
        backLink={"/admin/all-coupons"}
      />

      {isEmpty(Coupons.coupons) ? null : (
        <Grid
          container
          spacing={isSmall ? 1 : 4}
          className={classes.secondmainrow}
        >
          <Grid item md={6} sm={12} xs={12}>
            <CardBlocks title="Coupon Information" nomargin>
              <Box component="div" mb={2}>
                <TextInput
                  value={coupon.code}
                  label="Coupon Code"
                  name="code"
                  onInputChange={handleChange}
                />
              </Box>
              <Box component="div" mb={2}>
                <TextInput
                  value={coupon.description}
                  label="Description"
                  name="description"
                  onInputChange={handleChange}
                  multiline
                  rows="4"
                />
              </Box>
            </CardBlocks>
          </Grid>

          <Grid md={6} sm={12} xs={12}>
            <CardBlocks title="Coupon Data" nomargin>
              <Box component="div" className={classes.tabsHeader}>
                <Tabs
                  value={tabVal}
                  onChange={tabChange}
                  indicatorColor="primary"
                  textColor="primary"
                >
                  <Tab
                    value="general"
                    label="General"
                    {...a11yProps("general")}
                  />
                  <Tab
                    value="usage-restriction"
                    label="Usage restriction"
                    {...a11yProps("usage-restriction")}
                  />
                </Tabs>
              </Box>
              <Box component="div" className={classes.tabsBody}>
                {/*  ==================Genreal Tab ================== */}
                <TabPanel value={tabVal} index="general">
                  <Grid container spacing={2}>
                    <Grid item md={12} sm={12} xs={12}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel ref={inputLabel} id="products-select">
                          Discount Type
                        </InputLabel>
                        <Select
                          labelWidth={labelWidth}
                          onChange={handleChange}
                          inputProps={{
                            name: "discount_type",
                            value: coupon.discount_type,
                          }}
                        >
                          <MenuItem value="amount-discount">
                            Fixed Amount Discount
                          </MenuItem>
                          <MenuItem value="precantage-discount">
                            Fixed Precantage Discount
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item md={6} sm={12} xs={12}>
                      <TextInput
                        value={coupon.discount_value}
                        label="Coupon Amount"
                        name="discount_value"
                        onInputChange={handleChange}
                      />
                    </Grid>
                    <Grid item md={6} sm={12} xs={12}>
                      <TextInput
                        value={coupon.expire}
                        label="Coupon Expiry"
                        name="expire"
                        onInputChange={handleChange}
                        type="date"
                      />
                    </Grid>
                  </Grid>

                  <FormControlLabel
                    className={clsx(classes.marginTop1, classes.width100)}
                    control={
                      <Checkbox
                        color="primary"
                        checked={coupon.free_shipping}
                        onChange={(e) =>
                          setCoupon({
                            ...coupon,
                            free_shipping: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Free shipping"
                  />
                </TabPanel>

                {/*  ==================Usage Restriction Tab ================== */}
                <TabPanel value={tabVal} index="usage-restriction">
                  <Box component="div" mb={2}>
                    <TextInput
                      value={coupon.minimum_spend}
                      label="Minimum Spend"
                      name="minimum_spend"
                      onInputChange={handleChange}
                    />
                  </Box>
                  <Box component="div" mb={2}>
                    <TextInput
                      value={coupon.maximum_spend}
                      label="Maximum Spend"
                      name="maximum_spend"
                      onInputChange={handleChange}
                    />
                  </Box>

                  {/*  ================== Products Select ================== */}
                  <SelectOptionField
                    name="products"
                    label="Products"
                    value={coupon.products}
                    id="products"
                  >
                    {Products.products.map((product) => (
                      <MenuItem value={product.id} key={product.id}>
                        {product.name}
                      </MenuItem>
                    ))}
                  </SelectOptionField>

                  {/* ================== Exclude Products Select ================== */}
                  <SelectOptionField
                    name="exclude_products"
                    label="Exclude Products"
                    value={coupon.exclude_products}
                    id="exclude_products"
                  >
                    {Products.products.map((product) => (
                      <MenuItem value={product.id} key={product.id}>
                        {product.name}
                      </MenuItem>
                    ))}
                  </SelectOptionField>

                  {/*  ================== Category Select ==================*/}
                  <SelectOptionField
                    name="categories"
                    label="Categories"
                    value={coupon.categories}
                    id="categories"
                  >
                    {Products.categories.map((category) => (
                      <MenuItem value={category.id} key={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </SelectOptionField>

                  {/* ================== Exclude Category Select ===================== */}
                  <SelectOptionField
                    name="exclude_categories"
                    label="Exclude Categories"
                    value={coupon.exclude_categories}
                    id="exclude_categories"
                  >
                    {Products.categories.map((category) => (
                      <MenuItem value={category.id} key={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </SelectOptionField>
                </TabPanel>
              </Box>
            </CardBlocks>
          </Grid>
        </Grid>
      )}
    </Fragment>
  );
};

export default EditCoupon;
