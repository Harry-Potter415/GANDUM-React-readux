import React, { Fragment, useState, useEffect } from "react";
import { Grid, useMediaQuery, Button } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { useDispatch, useSelector } from "react-redux";
import { customerAddAction } from "../../store/action/";
import viewStyles from "../viewStyles.js";
import { CSVReader } from "react-papaparse";
import {
  Loading,
  TextInput,
  PasswordInput,
  TopBar,
  Alert,
  CardBlocks,
} from "../components";

var customerObj = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  phone: "",
};

const AddCustomer = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = viewStyles();
  const dispatch = useDispatch();
  const Customers = useSelector((state) => {
    return state.customers;
  });
  const [customer, setcustomer] = useState(customerObj);
  const [customersToAdd, setCustomersToAdd] = useState([]);

  const addAllCustomers = () => {
    customersToAdd.forEach((_customer) => {
      dispatch(customerAddAction(_customer));
    });
  };

  const onFileDrop = (data) => {
    const _customersToAdd = data.map((datum, i) => {
      const [
        first_name,
        last_name,
        email,
        password,
        phone,
      ] = datum.data;
      if (first_name != "") {
        return {
          ...customer,
          first_name,
          last_name,
          email,
          password,
          phone,
        };
      }
    });
    setCustomersToAdd(_customersToAdd);
  };
  useEffect(() => {
    document.forms[0].reset();
    setcustomer(customerObj);
  }, [Customers.customers]);

  const addCustomer = (e) => {
    e.preventDefault();
    dispatch(customerAddAction(customer));
  };

  const handleChange = (e) => {
    setcustomer({ ...customer, [e.target.name]: e.target.value });
  };

  return (
    <Fragment>
      <Alert />
      {Customers.loading && <Loading />}
      <form>
        <TopBar
          title="Add Customer"
          onSubmit={addCustomer}
          submitTitle="Add"
          backLink={"/admin/all-customer"}
        />
        <Grid
          container
          spacing={isSmall ? 2 : 4}
          className={classes.secondmainrow}
        >
          <Grid item lg={12}>
            <div style={{ height: "150px", marginBottom: 50 }}>
              <CSVReader onDrop={onFileDrop}>
                <span>Click to upload CSV of Customers</span>
              </CSVReader>
            </div>
            <div style={{ marginBottom: 20, marginTop: 20 }}>
              <Button
                color="primary"
                className={classes.addUserBtn}
                onClick={addAllCustomers}
              >
                Add All Customers
              </Button>
            </div>

            <CardBlocks title="Add Customer" nomargin>
              <Grid container spacing={4}>
                <Grid item md={3} sm={6} xs={12}>
                  <TextInput
                    value={customer.first_name}
                    label="First Name"
                    name="first_name"
                    onInputChange={handleChange}
                  />
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <TextInput
                    value={customer.last_name}
                    label="Last Name"
                    name="last_name"
                    onInputChange={handleChange}
                  />
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <TextInput
                    value={customer.email}
                    type="email"
                    label="Email"
                    name="email"
                    onInputChange={handleChange}
                  />
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <PasswordInput
                    name="password"
                    value={customer.password}
                    label="Password"
                    onInputChange={handleChange}
                  />
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <TextInput
                    value={customer.phone}
                    label="Phone"
                    name="phone"
                    onInputChange={handleChange}
                  />
                </Grid>
              </Grid>
            </CardBlocks>
          </Grid>
        </Grid>
      </form>
    </Fragment>
  );
};

export default AddCustomer;
