import React, { Fragment, useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  Table,
  TableCell,
  TextField,
  Button,
  Paper,
  Tabs,
  Tab,
  Collapse,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import convertDate from "../../utils/convertDate";
import { connect } from "react-redux";
import { productAddReviewAction } from "../../store/action/productAction";
import Productotherdetail_review from "./productotherdetail_review";
import ReactStars from "react-rating-stars-component";

const ProductOtherDetails = (props) => {
  const [tabValue, setTabValue] = useState(0);
  const [writeReview, setWriteReview] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const writeReviewToggle = () => {
    setWriteReview(!writeReview);
  };

  function a11yProps(index) {
    return {
      id: `profuct-info-${index}`,
      "aria-controls": `productinfo-tabpanel-${index}`,
    };
  }

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`profuct-info-${index}`}
        aria-labelledby={`productinfo-tabpanel-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3} component="div" className="hlelop">
            {children}
          </Box>
        )}
      </div>
    );
  }

  return (
    <Fragment>
      {/* =======================================Product Other Information================================= */}
      {props.details.custom_field || props.details.description ? (
        <Fragment>
          <div className="product-other-information-tab">
            <Paper square>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="ADDITIONAL-INFORMATION"
                indicatorColor="primary"
                textColor="primary"
              >
                {props.details.description && (
                  <Tab
                    label="Description"
                    {...a11yProps(props.details.description && 0)}
                  />
                )}

                {props.details.custom_field.length ? (
                  <Tab
                    label="Additional Information"
                    {...a11yProps(props.details.description ? 1 : 0)}
                  />
                ) : (
                  ""
                )}

                <Tab
                  label="Reviews"
                  {...a11yProps(
                    props.details.description &&
                      props.details.custom_field.length
                      ? 2
                      : props.details.description ||
                        props.details.custom_field.length
                      ? 1
                      : 0
                  )}
                />
              </Tabs>
            </Paper>

            <div className="product-other-information-tabpanel">
              {/* =======================================Product Description================================= */}
              {props.details.description && (
                <TabPanel
                  value={tabValue}
                  index={props.details.description && 0}
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: props.details.description,
                    }}
                  ></span>
                </TabPanel>
              )}
              {/* =======================================End Product Description================================= */}

              {/* =======================================Product CustomField================================= */}
              {props.details.custom_field.length ? (
                <TabPanel
                  value={tabValue}
                  index={props.details.description ? 1 : 0}
                >
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {props.details.custom_field.map((field, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Typography variant="h6">{field.key}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                component="h6"
                                className="text-capitalize"
                              >
                                {field.value}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TabPanel>
              ) : (
                ""
              )}

              {/* =======================================END Product CustomField================================= */}

              {/* =======================================Reviews================================= */}
              <TabPanel
                value={tabValue}
                index={
                  props.details.description && props.details.custom_field.length
                    ? 2
                    : props.details.description ||
                      props.details.custom_field.length
                    ? 1
                    : 0
                }
              >
                <span className="write-a-review" onClick={writeReviewToggle}>
                  Write a review
                </span>
                <Collapse in={writeReview}>
                  <Productotherdetail_review writeReviewToggle = {writeReviewToggle} productId={props.productId}/>
                </Collapse>
                <Grid container spacing={2} className="product-reviews">
                  {props.reviews &&
                  props.reviews.filter((review) => review.status === "approved")
                    .length > 0 ? (
                    props.reviews
                      .filter((review) => review.status === "approved")
                      .map((singleReview, index) => (
                        <Grid
                          item
                          lg={6}
                          md={12}
                          sm={12}
                          xs={12}
                          key={index}
                          className="product-reviews-item"
                        >
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            borderBottom={1}
                            className="padding-bottom-1"
                          >
                            <Typography variant="button">
                              <span className="text-capitalize">
                                {singleReview.customer_id.first_name}
                              </span>{" "}
                              - {convertDate(singleReview.date)}
                            </Typography>
                            <ReactStars
                              readOnly
                              count={parseInt(singleReview.rating)}
                              size={24}
                              emptyIcon={<i className="far fa-star"></i>}
                              halfIcon={<i className="fa fa-star-half-alt"></i>}
                              fullIcon={<i className="fa fa-star"></i>}
                              activeColor="#ffd700"
                              edit={false}
                            />
                          </Box>
                          <Typography
                            variant="subtitle1"
                            className="padding-top-1"
                          >
                            {singleReview.title}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            className="padding-top-1"
                          >
                            {singleReview.review}
                          </Typography>
                        </Grid>
                      ))
                  ) : (
                    <Grid item md={12}>
                      <Typography
                        variant="h5"
                        className="padding-top-2 text-center"
                      >
                        Reviews Not Available
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </TabPanel>
            </div>
          </div>

          <div className="product-other-information-tab mobile">
            <div className="product-other-information-tabpanel">
              {/* =======================================Product Description================================= */}
              {props.details.description && (
                <Fragment>
                  <Typography component="h3" className="additional-info-title">
                    Description
                  </Typography>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: props.details.description,
                    }}
                  ></span>
                </Fragment>
              )}
              {/* =======================================End Product Description================================= */}

              {/* =======================================Product CustomField================================= */}
              {props.details.custom_field.length ? (
                <Fragment>
                  <Typography component="h3" className="additional-info-title">
                    Additional Information
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {props.details.custom_field.map((field, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Typography variant="h6">{field.key}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                component="h6"
                                className="text-capitalize"
                              >
                                {field.value}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Fragment>
              ) : (
                ""
              )}

              {/* =======================================END Product CustomField================================= */}

              {/* =======================================Reviews================================= */}

              <Box component="div" style={{ position: "relative" }}>
                <span className="write-a-review" onClick={writeReviewToggle}>
                  Write a review
                </span>
                <Typography component="h3" className="additional-info-title">
                  Reviews
                </Typography>
                <Collapse in={writeReview}>
                  <Grid item md={12} sm={12} xs={12}>
                    <Box className="leave-review-wrapper">
                      <Productotherdetail_review writeReviewToggle = {writeReviewToggle} productId={props.productId}/>
                    </Box>
                  </Grid>
                </Collapse>
              </Box>
              <Grid container spacing={2} className="product-reviews">
                {props.reviews &&
                props.reviews.filter((review) => review.status === "approved")
                  .length > 0 ? (
                  props.reviews
                    .filter((review) => review.status === "approved")
                    .map((singleReview, index) => (
                      <Grid
                        item
                        lg={6}
                        md={12}
                        sm={12}
                        xs={12}
                        key={index}
                        className="product-reviews-item"
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          borderBottom={1}
                          className="padding-bottom-1"
                        >
                          <Typography variant="button">
                            <span className="text-capitalize">
                              {singleReview.customer_id.first_name}
                            </span>{" "}
                            - {convertDate(singleReview.date)}
                          </Typography>
                          {/*<Rating
                            name="read-only"
                            value={parseInt(singleReview.rating, 10)}
                            readOnly
                          />*/}
                        </Box>
                        <Typography
                          variant="subtitle1"
                          className="padding-top-1"
                        >
                          {singleReview.title}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          className="padding-top-1"
                        >
                          {singleReview.review}
                        </Typography>
                      </Grid>
                    ))
                ) : (
                  <Grid item md={12}>
                    <Typography
                      variant="h5"
                      className="padding-top-2 text-center"
                    >
                      Reviews Not Available
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </div>
          </div>
          {/* =======================================Reviews End================================= */}
        </Fragment>
      ) : (
        ""
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    products: state.products,
  };
};

const mapDispatchToProps = {
  productAddReviewAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductOtherDetails);
