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
import Auth from "../../utils/auth";
import { connect } from "react-redux";
import { productAddReviewAction } from "../../store/action/productAction";
import ReactStars from "react-rating-stars-component";

var reviewObject = {
  title: "",
  email: "review@email.com",
  review: "",
  rating: "5",
  status: "pending",
  customer_id: "5e58ddd73a4cf62a50a386a9",
  product_id: "",
};

const ProductOtherDetails_Review = (props) => {
  const [review, setReview] = useState(reviewObject);

  const addReview = () => {
    props.productAddReviewAction(review);
    setReview(reviewObject);
    props.writeReviewToggle()
  };

  useEffect(() => {
    setReview({ ...review, product_id: props.productId });
  }, [props.productId]);

  return (
    <Grid item md={12} sm={12} xs={12}>
      <Box className="leave-review-wrapper" component="div">
        <Grid container spacing={2}>
          <Grid item md={12} sm={12} xs={12}>
            <Typography
              variant="h3"
              className="margin-bottom-2 text-center"
            >
              Leave Us A Review
            </Typography>
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <TextField
              type="text"
              label="Title"
              variant="outlined"
              size="small"
              className="width-100"
              value={review.title}
              onChange={(e) =>
                setReview({ ...review, title: e.target.value })
              }
            />
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <Box
              component="fieldset"
              borderColor="transparent"
              className="fieldset-rating"
            >
              <Typography component="legend">Rating</Typography>
              <ReactStars
                count={parseInt(review.rating)}
                onChange={(newRating) => {
                  setReview({...review, rating: newRating.toString()})
                }}
                size={24}
                emptyIcon={<i className="far fa-star"></i>}
                halfIcon={<i className="fa fa-star-half-alt"></i>}
                fullIcon={<i className="fa fa-star"></i>}
                activeColor="#ffd700"
              />
            </Box>
          </Grid>
          <Grid item md={12} sm={6} xs={12}>
            <TextField
              type="text"
              label="Review"
              variant="outlined"
              size="small"
              className="width-100"
              multiline
              value={review.review}
              rows="4"
              onChange={(e) =>
                setReview({ ...review, review: e.target.value })
              }
            />
          </Grid>
          <Grid
            item
            md={12}
            xs={12}
            sm={12}
            className="text-center"
          >
            <Button
              variant="contained"
              color="primary"
              onClick={addReview}
            >
              Add Review
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  )
}

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
)(ProductOtherDetails_Review);