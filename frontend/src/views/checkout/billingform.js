import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  Typography,
  Box,
  TextField,
  Grid,
  FormControl,
  FormControlLabel,
  Checkbox,
  Collapse,
  FormHelperText,
  NativeSelect,
} from "@material-ui/core";
import Auth from "../../utils/auth";
import { getUserOrdersAction } from "../../store/action/checkoutAction";

var billingInfoObject = {
  order_notes: "",
  poscode: "",
  state: "",
  city: "",
  address_line_2: "",
  address_line_1: "",
  phone: "",
  company: "",
  email: "",
  lastname: "",
  firstname: "",
  country: "",
};

var shippingObject = {
  shippingposcode: "",
  shippingstate: "",
  shippingcity: "",
  shippingaddress_line_2: "",
  shippingaddress_line_1: "",
  shippingphone: "",
  shippingcompany: "",
  shippingemail: "",
  shippinglastname: "",
  shippingfirstname: "",
  shippingcountry: "",
};

var savedShippingInfo;

const BillingForm = (props) => {
  const [billingInfo, setBillingInfo] = useState(billingInfoObject);
  const [shippingInfo, setShippingInfo] = useState(shippingObject);
  const [createAccount, setCreateAccount] = useState(false);
  const [shippingAdd, setShippingAdd] = useState(false);

  useEffect(() => {
    // billingInfoObject
    var user = Auth.getUser();
    if(user){
      billingInfoObject.firstname = user.name;
      billingInfoObject.lastname = user.last_name;
      billingInfoObject.email = user.email;
      billingInfoObject.phone = user.phone;
    }

    var user_id = Auth.getUserId();
    props.getUserOrdersAction(user_id);
    console.log(props.orders);
    if(props.orders !== null){
      if(props.orders.length > 0){
        billingInfoObject.firstname = props.orders[0].billing.firstname;
        billingInfoObject.lastname = props.orders[0].billing.lastname;
        billingInfoObject.email = props.orders[0].billing.email;
        billingInfoObject.phone = props.orders[0].billing.phone;
        billingInfoObject.company = props.orders[0].billing.company;
        billingInfoObject.country = props.orders[0].billing.country;
        billingInfoObject.status = props.orders[0].billing.status;
        billingInfoObject.city = props.orders[0].billing.city;
        billingInfoObject.address_line_1 = props.orders[0].shipping.address_line_1;
        billingInfoObject.address_line_2 = props.orders[0].shipping.address_line_2;
      }
    }
    var allData = {
      billing: billingInfo,
      shipping: shippingInfo,
      shippingAddress: shippingAdd,
    };
    props.getBillingInfo(allData);
  }, [shippingInfo, billingInfo, shippingAdd, props.orders]);

  const checkoutInputs = (type, label, name, value, inputs) => {
    var validation;
    switch (name) {
      case "firstname":
        validation = {
          required: {
            value: true,
            message: "First Name is Required",
          },
          minLength: {
            value: 4,
            message: "First Name Min length is 4",
          },
        };
        break;
      case "lastname":
        validation = {
          required: {
            value: true,
            message: "Last Name is Required",
          },
        };
        break;
      case "phone":
        validation = {
          required: {
            value: true,
            message: "Phone is Required",
          },
          minLength: {
            value: 10,
            message: "Phone Min length is 10",
          },
          maxLength: {
            value: 10,
            message: "Phone Max length is 10",
          },
          pattern: {
            value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
            message: "Invalid Phone Number",
          },
        };
        break;
      case "email":
        validation = {
          required: {
            value: true,
            message: "Email is Required",
          },
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            message: "Invalid Email",
          },
        };
        break;
      case "company":
        validation = {
          required: {
            value: true,
            message: "Company Name is Required",
          },
        };
        break;
      case "address_line_1":
        validation = {
          required: {
            value: true,
            message: "Address is Required",
          },
        };
        break;
      case "city":
        validation = {
          required: {
            value: true,
            message: "City is Required",
          },
        };
        break;
      case "state":
        validation = {
          required: {
            value: true,
            message: "State is Required",
          },
        };
        break;
      case "poscode":
        validation = {
          required: {
            value: true,
            message: "Poscode is Required",
          },
          minLength: {
            value: 6,
            message: "Poscode Min length is 6",
          },
          maxLength: {
            value: 6,
            message: "Poscode Max length is 6",
          },
        };
        break;
      case "shippingfirstname":
        validation = {
          required: {
            value: true,
            message: "First Name is Required",
          },
          minLength: {
            value: 4,
            message: "First Name Min length is 4",
          },
        };
        break;
      case "shippinglastname":
        validation = {
          required: {
            value: true,
            message: "Last Name is Required",
          },
        };
        break;
      case "shippingphone":
        validation = {
          required: {
            value: true,
            message: "Phone is Required",
          },
          minLength: {
            value: 10,
            message: "Phone Min length is 10",
          },
          maxLength: {
            value: 10,
            message: "Phone Max length is 10",
          },
          pattern: {
            value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
            message: "Invalid Phone Number",
          },
        };
        break;
      case "shippingemail":
        validation = {
          required: {
            value: true,
            message: "Email is Required",
          },
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            message: "Invalid Email",
          },
        };
        break;
      case "shippingcompany":
        validation = {
          required: {
            value: true,
            message: "Company Name is Required",
          },
        };
        break;
      case "shippingaddress_line_1":
        validation = {
          required: {
            value: true,
            message: "Address is Required",
          },
        };
        break;
      case "shippingcity":
        validation = {
          required: {
            value: true,
            message: "City is Required",
          },
        };
        break;
      case "shippingstate":
        validation = {
          required: {
            value: true,
            message: "State is Required",
          },
        };
        break;
      case "shippingposcode":
        validation = {
          required: {
            value: true,
            message: "Poscode is Required",
          },
          minLength: {
            value: 6,
            message: "Poscode Min length is 6",
          },
          maxLength: {
            value: 6,
            message: "Poscode Max length is 6",
          },
        };
        break;
      default:
        validation = { required: true };
    }

    const checkValidation = () => {
      var errors;

      switch (props.errorRef[name]?.type) {
        case "minLength":
          errors = props.errorRef[name].message;
          break;
        case "maxLength":
          errors = props.errorRef[name].message;
          break;
        case "pattern":
          errors = props.errorRef[name].message;
          break;
        case "required":
          errors = props.errorRef[name].message;
          break;
        default:
          errors = "";
      }
      return errors;
    };

    return (
      <Fragment>
        <TextField
          label={label}
          type={type}
          value={value}
          name={name}
          onChange={
            inputs === "billings" ? billingInfoChange : shippingInfoChange
          }
          variant="outlined"
          size="small"
          className="billing-textfield"
          inputRef={props.registerRef(validation)}
          helperText={checkValidation()}
          error={props.errorRef[name] ? true : false}
        />
      </Fragment>
    );
  };

  const billingInfoChange = (e) => {
    if (!shippingAdd) {
      setShippingInfo({
        ...shippingInfo,
        [e.target.name]: e.target.value,
      });
    }
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  const shippingInfoChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const shippingAddressToggle = (e) => {
    if (e.target.checked) {
      savedShippingInfo = shippingInfo;
      setShippingInfo(shippingObject);
    } else {
      setShippingInfo(savedShippingInfo);
    }
    setShippingAdd(e.target.checked);
  };

  return (
    <Fragment>
      {/* ====================Billing Information================================= */}

      <Typography variant="h3" className="margin-bottom-2">
        Billing Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item lg={6} md={12} sm={12} xs={12}>
          {checkoutInputs(
            "text",
            "First Name",
            "firstname",
            billingInfo.firstname,
            "billings"
          )}
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12}>
          {checkoutInputs(
            "text",
            "Last Name",
            "lastname",
            billingInfo.lastname,
            "billings"
          )}
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12}>
          {checkoutInputs(
            "email",
            "Email",
            "email",
            billingInfo.email,
            "billings"
          )}
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12}>
          {checkoutInputs(
            "number",
            "Phone",
            "phone",
            billingInfo.phone,
            "billings"
          )}
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          {checkoutInputs(
            "text",
            "company Name",
            "company",
            billingInfo.company,
            "billings"
          )}
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          {checkoutInputs(
            "text",
            "Address Line 1",
            "address_line_1",
            billingInfo.address_line_1,
            "billings"
          )}
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          {checkoutInputs(
            "text",
            "Address Line 2",
            "address_line_2",
            billingInfo.address_line_2,
            "billings"
          )}
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <FormControl
            variant="outlined"
            className="billing-textfield outlined-select-option margin-top-1 margin-bottom-1"
            size="small"
            error={props.errorRef.country ? true : false}
          >
            <NativeSelect
              value={billingInfo.country}
              onChange={billingInfoChange}
              inputProps={{
                name: "country",
                id: "country-label",
              }}
              inputRef={props.registerRef({ required: true })}
            >
              <option value="">Select Country</option>
              <option value="usa">USA</option>
            </NativeSelect>
            <FormHelperText>
              {props.errorRef.country && "Country is required"}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item md={4} sm={12} xs={12}>
          {checkoutInputs("text", "City", "city", billingInfo.city, "billings")}
        </Grid>
        <Grid item md={4} sm={12} xs={12}>
          {checkoutInputs(
            "text",
            "State",
            "state",
            billingInfo.state,
            "billings"
          )}
        </Grid>
        <Grid item md={4} sm={12} xs={12}>
          {checkoutInputs(
            "number",
            "Poscode",
            "poscode",
            billingInfo.poscode,
            "billings"
          )}
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <TextField
            label="Orders Notes"
            value={billingInfo.order_notes}
            name="order_notes"
            onChange={billingInfoChange}
            variant="outlined"
            size="small"
            className="billing-textfield"
            multiline
            rows="5"
          />
        </Grid>
        {/* <Grid item md={12} sm={12} xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={createAccount}
                onChange={(e) => setCreateAccount(e.target.checked)}
                color="primary"
              />
            }
            label="Create an account?"
          />
        </Grid> */}
      </Grid>

      {/* ====================Shipping Information================================= */}

      <Box component="div">
        <Typography variant="h3" className="margin-top-2 margin-bottom-1">
          Shipping Details
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={shippingAdd}
              onChange={(e) => shippingAddressToggle(e)}
              color="primary"
            />
          }
          label="Ship to a diffrent address?"
        />
        <Collapse in={shippingAdd}>
          {shippingAdd && (
            <Grid
              container
              spacing={2}
              className="margin-top-2 margin-bottom-3"
            >
              <Grid item lg={6} md={12} sm={12} xs={12}>
                {checkoutInputs(
                  "text",
                  "First Name",
                  "shippingfirstname",
                  shippingInfo.shippingfirstname,
                  "shipping"
                )}
              </Grid>
              <Grid item lg={6} md={12} sm={12} xs={12}>
                {checkoutInputs(
                  "text",
                  "Last Name",
                  "shippinglastname",
                  shippingInfo.shippinglastname,
                  "shipping"
                )}
              </Grid>
              <Grid item lg={6} md={12} sm={12} xs={12}>
                {checkoutInputs(
                  "email",
                  "Email",
                  "shippingemail",
                  shippingInfo.shippingemail,
                  "shipping"
                )}
              </Grid>
              <Grid item lg={6} md={12} sm={12} xs={12}>
                {checkoutInputs(
                  "tel",
                  "Phone",
                  "shippingphone",
                  shippingInfo.shippingphone,
                  "shipping"
                )}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {checkoutInputs(
                  "text",
                  "company Name",
                  "shippingcompany",
                  shippingInfo.shippingcompany,
                  "shipping"
                )}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {checkoutInputs(
                  "text",
                  "Address Line 1",
                  "shippingaddress_line_1",
                  shippingInfo.shippingaddress_line_1,
                  "shipping"
                )}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {checkoutInputs(
                  "text",
                  "Address Line 2",
                  "shippingaddress_line_2",
                  shippingInfo.shippingaddress_line_2,
                  "shipping"
                )}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                <FormControl
                  variant="outlined"
                  className="billing-textfield outlined-select-option margin-top-1 margin-bottom-1"
                  size="small"
                  error={props.errorRef.shippingcountry ? true : false}
                >
                  <NativeSelect
                    value={shippingInfo.shippingcountry}
                    onChange={shippingInfoChange}
                    inputProps={{
                      name: "shippingcountry",
                      id: "country-label",
                    }}
                    inputRef={props.registerRef({ required: true })}
                  >
                    <option value="">Select Country</option>
                    <option value="in">India</option>
                    <option value="usa">USA</option>
                  </NativeSelect>
                  <FormHelperText>
                    {props.errorRef.shippingcountry && "Country is required"}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                {checkoutInputs(
                  "text",
                  "City",
                  "shippingcity",
                  shippingInfo.shippingcity,
                  "shipping"
                )}
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                {checkoutInputs(
                  "text",
                  "State",
                  "shippingstate",
                  shippingInfo.shippingstate,
                  "shipping"
                )}
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                {checkoutInputs(
                  "number",
                  "Poscode",
                  "shippingposcode",
                  shippingInfo.shippingposcode,
                  "shipping"
                )}
              </Grid>
            </Grid>
          )}
        </Collapse>
      </Box>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  orders: state.checkoutDetail.orders
});

const mapDispatchToProps = {
  getUserOrdersAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(BillingForm);
