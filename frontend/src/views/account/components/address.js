import React, { Fragment, useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Icon,
  Collapse,
  TextField,
  CardHeader,
  Divider,
  Fade,
  FormControlLabel,
  Checkbox,
  Tooltip,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import {
  addressbookAddAction,
  customerAction,
} from "../../../store/action/customerAction";
import { connect, useDispatch } from "react-redux";
import Auth from "../../../utils/auth";

const Address = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [addrId, setAddrId] = useState("");
  const [custId, setCustId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [defaultAddress, setDefaultAddress] = useState("");
  const [custInfo, setcustInfo] = useState({
    first_name: "first name",
    last_name: "last name",
    company: "company",
    phone: "phone",
    address_line1: "address1",
    address_line2: "address2",
    city: "city",
    country: "country",
    state: "state",
    pincode: "pincode",
    default_address: "default_address",
  }); //customer info receive via props
  const dispatch = useDispatch();

  useEffect(() => {
    const customer_id = Auth.getUserId();
    const customer = Auth.getUser();
    setCustId(customer_id);
    // props.customerAction(customer_id);
    if (customer_id) {
      console.log("custInfoprops", customer);
      if(customer.address.length > 0){
        setcustInfo(customer.address[0]);
      }
      // setAddrId(props.customer[0]._id);
    }
    // console.log("custInfostate", custInfo);
  }, []);
  const addressInput = (label, name, type, value, setFunction) => {
    return (
      <TextField
        type={type}
        label={label}
        name={name}
        variant="outlined"
        size="small"
        value={value}
        onChange={(e) => {
          setFunction(e.target.value);
        }}
        className="width-100"
      />
    );
  };
  const addAddress = () => {
    setAddMode(true);
    setEditMode(false);
  };

  const editAddress = (adress) => {
    console.log(adress);
    setEditMode(true);
    setAddMode(false);
  };

  const updateAddress = () => {
    console.log("heello");
  };

  const addNewAddress = () => {
    const custInfoBody = {
      id: custId,
      first_name: firstName,
      last_name: lastName,
      company: company,
      phone: phone,
      address_line1: address1,
      address_line2: address2,
      city: city,
      country: country,
      state: state,
      pincode: pincode,
      default_address: defaultAddress,
    };
    props.addressbookAddAction(custInfoBody);

    setAddMode(false);
    setEditMode(false);
    setFirstName("");
    setLastName("");
    setCompany("");
    setPhone("");
    setAddress1("");
    setAddress2("");
    setCity("");
    setCountry("");
    setState("");
    setPincode("");
  };

  const deleteAddressBook = (_id) => {
    console.log("delete");
  };

  const cancelAddress = () => {
    setEditMode(false);
    setAddMode(false);
  };

  return (
    <Fragment>
      <Grid container spacing={2} className="margin-bottom-2">
        <Grid item md={12} xs={12}>
          <Collapse in={editMode || addMode ? true : false}>
            <Card>
              <CardHeader title={`${editMode ? "Edit" : "Add"} Adress`} />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12}>
                    {addressInput(
                      "First Name",
                      "first_name",
                      "text",
                      firstName,
                      setFirstName
                    )}
                  </Grid>
                  <Grid item md={3} xs={12}>
                    {addressInput(
                      "Last Name",
                      "last_name",
                      "text",
                      lastName,
                      setLastName
                    )}
                  </Grid>
                  <Grid item md={3} xs={12}>
                    {addressInput(
                      "Company",
                      "company",
                      "text",
                      company,
                      setCompany
                    )}
                  </Grid>
                  <Grid item md={3} xs={12}>
                    {addressInput("Phone", "phone", "tel", phone, setPhone)}
                  </Grid>
                  <Grid item md={12} xs={12}>
                    {addressInput(
                      "Address line1",
                      "address_line1",
                      "text",
                      address1,
                      setAddress1
                    )}
                  </Grid>
                  <Grid item md={12} xs={12}>
                    {addressInput(
                      "Address line2",
                      "address_line2",
                      "text",
                      address2,
                      setAddress2
                    )}
                  </Grid>
                  <Grid item md={3} xs={12}>
                    {addressInput("City", "city", "text", city, setCity)}
                  </Grid>
                  <Grid item md={3} xs={12}>
                    {addressInput(
                      "Country",
                      "country",
                      "text",
                      country,
                      setCountry
                    )}
                  </Grid>
                  <Grid item md={3} xs={12}>
                    {addressInput("State", "state", "text", state, setState)}
                  </Grid>
                  <Grid item md={3} xs={12}>
                    {addressInput(
                      "Pincode",
                      "pincode",
                      "text",
                      pincode,
                      setPincode
                    )}
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <FormControlLabel
                      control={<Checkbox name="checkedB" color="primary" />}
                      label="Make it Default Address"
                      onChange={(e) => {
                        setDefaultAddress(e.target.checked);
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={editMode ? addNewAddress : addNewAddress}
                  variant="contained"
                >
                  {editMode ? "Update" : "Add"}
                </Button>
                <Button
                  size="small"
                  onClick={cancelAddress}
                  variant="contained"
                >
                  Cancel
                </Button>
              </CardActions>
            </Card>
          </Collapse>
          <Fade in={!addMode} className={editMode ? "margin-top-2" : ""}>
            <Button
              size="small"
              color="primary"
              onClick={addAddress}
              variant="contained"
            >
              Add New Address
            </Button>
          </Fade>
        </Grid>

        <Grid item md={6} xs={12}>
          <Card>
            <CardContent>
              {/*<Grid container spacing={2} className="position-relative">
                <Tooltip
                  className="default-address"
                  title={
                    1 === 1
                      ? "Default Address"
                      : "Edit the address and check the 'Default Address' option to make it your default address."
                  }
                  aria-label="Default-Address"
                >
                  <Button>
                    <Rating name="Default Address" value={1} max={1} readOnly />
                  </Button>
                </Tooltip>
                <Grid item>
                  <Icon>face</Icon>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    {custInfo.first_name}, {custInfo.last_name}
                  </Typography>
                </Grid>
              </Grid>*/}

              <Grid container spacing={2}>
                <Grid item>
                  <Icon>home</Icon>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    {console.log(custInfo)}
                    {custInfo.address_line1},{custInfo.address_line2}
                    {/* test */}
                  </Typography>
                  <Typography variant="body1">
                    {custInfo.city}, {custInfo.state}, {custInfo.pincode}
                    {/* test */}
                  </Typography>
                  <Typography variant="body1">
                    {custInfo.country}
                    {/* test */}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item>
                  <Icon>call</Icon>
                </Grid>
                <Grid item>
                  <Typography variant="body1">Phone No.</Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item>
                  <Icon>
                    {custInfo.email}
                    {/* teste */}
                  </Icon>
                </Grid>
                <Grid item>
                  <Typography variant="body1">Email</Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item>
                  <Icon>business</Icon>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    {custInfo.company}
                    {/* test */}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={() => editAddress("address")}
              >
                EDIT
              </Button>
              <Button
                size="small"
                color="primary"
                onClick={() => deleteAddressBook("ID")}
              >
                DELETE
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
};
const mapStateToProps = (state) => {
  return {
    customer: state.customer.customer.address_book,
  };
};
const mapDispatchToProps = {
  addressbookAddAction,
  customerAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Address);
