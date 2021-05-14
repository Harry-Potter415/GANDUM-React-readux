import React, { Fragment, useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
} from "@material-ui/core";
import Select from "react-select";
import Rating from "@material-ui/lab/Rating";
import {
  productsAction,
  customersAction,
  reviewsAction,
  reviewUpdateAction,
} from "../../store/action";
import { useSelector, useDispatch } from "react-redux";
import {
  StyledRadio,
  Loading,
  TopBar,
  TextInput,
  CardBlocks,
} from "../components";
import viewStyles from "../viewStyles";
import ReactStars from "react-rating-stars-component";

var reviewObj = {
  title: "",
  customer_id: "",
  product_id: "",
  email: "",
  review: "",
  rating: "",
  status: "Pending",
  customer: {},
  product: {},
};
const EditReview = (props) => {
  const classes = viewStyles();
  const dispatch = useDispatch();
  const productState = useSelector((state) => state.products);
  const customerState = useSelector((state) => state.customers);
  const reviewState = useSelector((state) => state.reviews);
  const [review, setreview] = useState(reviewObj);
  const [products, setproducts] = useState([]);
  const [customers, setcustomers] = useState([]);

  useEffect(() => {
    if (!reviewState.reviews.length) {
      dispatch(reviewsAction());
    }

    for (let i in reviewState.reviews) {
      if (reviewState.reviews[i].id === props.match.params.id) {
        dispatch(customersAction());
        dispatch(productsAction());
        setreview({
          ...review,
          ...reviewState.reviews[i],
          customer_id: reviewState.reviews[i].customer_id.id,
          product_id: reviewState.reviews[i].product_id.id,
          customer: {
            value: reviewState.reviews[i].customer_id.id,
            label: reviewState.reviews[i].customer_id.first_name,
          },
          product: {
            value: reviewState.reviews[i].product_id.id,
            label: reviewState.reviews[i].product_id.name,
          },
        });
        break;
      }
    }
  }, [reviewState.reviews]);

  useEffect(() => {
    const prodcutArr = productState.products.map((product) => {
      return {
        value: product.id,
        label: product.name,
      };
    });

    setproducts([...prodcutArr]);
  }, [productState.products]);

  useEffect(() => {
    const customerArr = customerState.customers.map((customer) => {
      return {
        value: customer.id,
        label: customer.first_name,
      };
    });

    setcustomers([...customerArr]);
  }, [customerState.customers]);

  const updateReview = () => {
    console.log(review);
    dispatch(reviewUpdateAction(review));
  };

  const handleChange = (e) => {
    setreview({
      ...review,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Fragment>
      {reviewState.loading && <Loading />}
      <TopBar
        title="Edit Customer Review"
        onSubmit={updateReview}
        submitTitle="Update"
        backLink={"/admin/reviews"}
      />

      <Grid container spacing={4} className={classes.secondmainrow}>
        <Grid item lg={9} md={12} sm={12} xs={12}>
          <CardBlocks title="Review Information" nomargin>
            <Box component="div" mb={2}>
              <TextInput
                value={review.title}
                label="Title"
                name="title"
                onInputChange={handleChange}
              />
            </Box>
            <Box component="div" mb={2}>
              <TextInput
                value={review.review}
                name="review"
                label="Review"
                onInputChange={handleChange}
              />
            </Box>
          </CardBlocks>

          <CardBlocks title="Review Details">
            {review.product.value && (
              <Box component="div" mb={2}>
                <Typography component="legend">Products</Typography>
                <Select
                  value={review.product}
                  name="product_id"
                  onChange={(e) =>
                    setreview({
                      ...review,
                      product_id: e.value,
                      product: { value: e.value, label: e.label },
                    })
                  }
                  options={products}
                />
              </Box>
            )}

            {review.customer.value && (
              <Box component="div" mb={2}>
                <Typography component="legend">Customer</Typography>
                <Select
                  value={review.customer}
                  name="customer_id"
                  onChange={(e) =>
                    setreview({
                      ...review,
                      customer_id: e.value,
                      customer: { value: e.value, label: e.label },
                    })
                  }
                  options={customers}
                  className={classes.marginBottom}
                />
              </Box>
            )}

            <Box component="div" mb={2}>
              <TextInput
                value={review.email}
                label="Email"
                name="email"
                onInputChange={handleChange}
              />
            </Box>

            <Box component="fieldset" mb={3} borderColor="transparent">
              <Typography component="legend">Rating</Typography>
{/*              <Rating
                name="simple-controlled"
                value={Number(review.rating)}
                onChange={(event, newValue) => {
                  setreview({
                    ...review,
                    rating: String(newValue),
                  });
                }}
              />*/}
              <ReactStars
                count={parseInt(review.rating)}
                onChange={(newRating) => {
                  setreview({...review, rating: newRating.toString()})
                }}
                size={24}
                emptyIcon={<i className="far fa-star"></i>}
                halfIcon={<i className="fa fa-star-half-alt"></i>}
                fullIcon={<i className="fa fa-star"></i>}
                activeColor="#ffd700"
              />
            </Box>
          </CardBlocks>
        </Grid>

        <Grid item lg={3} md={12} xs={12}>
          <CardBlocks title="Status" nomargin>
            <RadioGroup
              defaultValue="Publish"
              name="status"
              onChange={handleChange}
              row
              value={review.status}
            >
              <FormControlLabel
                value="approved"
                control={<StyledRadio />}
                label="Approved"
              />
              <FormControlLabel
                value="pending"
                control={<StyledRadio />}
                label="Pending"
              />
            </RadioGroup>
          </CardBlocks>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default EditReview;
