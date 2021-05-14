import React, { Fragment, useState, useEffect } from "react";
import {
  Button,
  Grid,
  TextField,
  Card,
  CardContent,
  CardActions,
  Typography,
  Icon,
  Collapse,
  CardHeader,
  Divider,
  Fade,
  FormControlLabel,
  Checkbox,
  Tooltip,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";

import { update } from "../../../utils/service_bk";
import { connect } from "react-redux";

import Auth from "../../../utils/auth";

const AccountSetting = (props) => {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [cpassword, setCPassword] = useState(null);
  const [custInfo, setcustInfo] = useState({
    email: "test@gmail.com",
    first_name: "first name",
    last_name: "last name",
    phone: "phone",
    address_book: [
      {
        address_line1: "test,karachi,pakistan",
        address_line2: "a-123",
        city: "washigton",
        country: "california",
        default_address: false,
        first_name: "miller",
        last_name: "john",
        phone: "123456789",
        pincode: "75950",
        state: "texas",
      },
    ],
  }); //customer info receive via props

  useEffect(() => {
    let user = Auth.getUser();
    user.first_name = user.name
    // if (props.customer) {
    //   console.log("custInfoprops in account-setting", props.customer);
    //   setcustInfo(props.customer);
    // }
    setcustInfo(user);
    console.log("custInfostate", user);

    setFirstName(user.name);
    setLastName(user.last_name);
    setPhone(user.phone);
    setEmail(user.email);
  }, []);

  const updateDetails = () => {
    update(firstName, lastName, email, password, phone);
  };

  return (
    <Fragment>
      <Grid container className="margin-top-3 margin-bottom-3">
        <Grid item md={6} xs={12} className=" margin-bottom-3">
          <Card>
            <CardContent>
              <Grid container spacing={2} className="position-relative">
                <Grid item>
                  <Icon>face</Icon>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    {custInfo.first_name}, {custInfo.last_name}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item>
                  <Icon>home</Icon>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                   {/* {custInfo.address_book[0].address_line1},
                    {custInfo.address_book[0].address_line1}*/}
                    {/* test */}
                  </Typography>
                  <Typography variant="body1">
                    {/*{custInfo.address_book[0].city},
                    {custInfo.address_book[0].state},*/}
                  </Typography>
                  <Typography variant="body1">
                    {/*{custInfo.address_book[0].country}*/}
                    {/* test */}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item>
                  <Icon>call</Icon>
                </Grid>
                <Grid item>
                  <Typography variant="body1">{custInfo.phone}</Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item>
                  <Icon>Email</Icon>
                </Grid>
                <Grid item>
                  <Typography variant="body1">{custInfo.email}</Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item>
                  <Icon>business</Icon>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    {/* test */}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={12} xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item md={3} xs={12}>
                  <TextField
                    type={"text"}
                    label={"First Name"}
                    name={"first_name"}
                    variant="outlined"
                    size="small"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                    className="width-100"
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    type={"text"}
                    label={"Last Name"}
                    name={"last_name"}
                    variant="outlined"
                    size="small"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                    className="width-100"
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    type={"tel"}
                    label={"Phone"}
                    name={"phone"}
                    variant="outlined"
                    size="small"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                    className="width-100"
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    type={"email"}
                    label={"Email"}
                    name={"email"}
                    variant="outlined"
                    size="small"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    className="width-100"
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    type={"password"}
                    label={"Password"}
                    name={"password"}
                    variant="outlined"
                    size="small"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    className="width-100"
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    type={"password"}
                    label={"Confirm password"}
                    name={"cnfrm_password"}
                    variant="outlined"
                    size="small"
                    value={cpassword}
                    onChange={(e) => {
                      setCPassword(e.target.value);
                    }}
                    className="width-100"
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions className="justify-center">
              <Button
                size="small"
                color="primary"
                onClick={updateDetails}
                variant="contained"
              >
                Update Details
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
    customer: state.customer.customer,
  };
};
export default connect(mapStateToProps)(AccountSetting);
