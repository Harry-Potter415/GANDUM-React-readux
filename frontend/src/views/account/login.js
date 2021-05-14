import React, { Fragment } from "react";
import { connect } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";

import {
  Typography,
  Box,
  Container,
  Grid,
  Button,
  TextField,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import LoginAction from "../../store/action/loginAction";
import { login } from "../../utils/service_bk";

const Login = (props) => {
  const handleLogin = (values) => {
    login(values.email, values.password);
  };
  return (
    <Fragment>
      <Box
        component="div"
        display="flex"
        justifyContent="center"
        alignItems="center"
        className="page-header"
      >
        <Typography variant="h1">Login</Typography>
      </Box>
      <Container>
        <Grid
          container
          alignItems="center"
          className="margin-top-3 margin-bottom-3 login-wrapper"
        >
          <Grid item md={6} sm={12} xs={12} className="login-left-col">
            <Typography variant="h2">New to our Shop?</Typography>
            <Typography variant="h5" className="margin-top-2 margin-bottom-2">
              There are advances being made in science and technology everyday,
              and a good example of this is the
            </Typography>
            <Link to="/register">
              <Button variant="contained" color="secondary">
                CREATE AN ACCOUNT
              </Button>
            </Link>
          </Grid>
          <Grid item md={6} sm={12} xs={12} className="login-right-col">
            <Typography variant="h2">Welcome Back !</Typography>
            <Typography variant="h3">Please Sign in now</Typography>
            {/* <form onSubmit={handleLogin} className="width-100 margin-top-3">
              <TextField
                label="Username or Email"
                variant="outlined"
                name="username"
                className="width-100 margin-top-1 margin-bottom-1"
              />

              <TextField
                type="password"
                label="Password"
                variant="outlined"
                name="password"
                className="width-100 margin-top-1 margin-bottom-2"
              />

              <Button
                variant="contained"
                color="primary"
                type="submit"
                className="margin-bottom-2"
              >
                Login
              </Button>
              <Typography variant="button">
                <Link to="/forgot-password">Forgot Your Password?</Link>
              </Typography>
            </form> */}
            <Container maxWidth="sm">
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                }}
                validationSchema={Yup.object().shape({
                  email: Yup.string()
                    .email("Must be a valid email")
                    .max(255)
                    .required("Email is required"),
                  password: Yup.string()
                    .max(255)
                    .required("Password is required"),
                })}
                onSubmit={(values) => {
                  handleLogin(values);
                }}
              >
                {({
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  touched,
                  values,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      error={Boolean(touched.email && errors.email)}
                      fullWidth
                      helperText={touched.email && errors.email}
                      label="Email Address"
                      margin="normal"
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="email"
                      value={values.email}
                      variant="outlined"
                    />
                    <TextField
                      error={Boolean(touched.password && errors.password)}
                      fullWidth
                      helperText={touched.password && errors.password}
                      label="Password"
                      margin="normal"
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="password"
                      value={values.password}
                      variant="outlined"
                    />
                    <Box my={2}>
                      <Button
                        style={{
                          backgroundColor: "#37475A",
                          "--color-1": "#5e6b7a",
                          "--color-2": "#37475A",
                          background: `
                      linear-gradient(
                        170deg,
                        var(--color-1),
                        var(--color-2) 70%
                      )
                    `,
                          color: "#f8f8ff",
                        }}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                      >
                        Sign in now
                      </Button>
                    </Box>
                    <Typography color="textSecondary" variant="body1">
                      Don&apos;t have an account?
                      <Link to="/register" variant="h6">
                        Sign up
                      </Link>
                    </Typography>
                    {/* {message && (
                      <div className="form-group">
                        <div className="alert alert-danger" role="alert">
                          {message}
                        </div>
                      </div>
                    )} */}
                  </form>
                )}
              </Formik>
            </Container>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  settings: state.settings,
});

export default connect(mapStateToProps)(Login);
