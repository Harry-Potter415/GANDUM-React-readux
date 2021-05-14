import React, { Fragment, useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
  IconButton,
  Tooltip,
  Button,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import viewStyles from "../viewStyles.js";
import jumpTo from "../../utils/navigation";
import Rating from "@material-ui/lab/Rating";
import { useSelector, useDispatch } from "react-redux";
import { reviewsAction, reviewDeleteAction } from "../../store/action";
import { Loading } from "../components";
import { convertDateToStringFormat } from "../utils/convertDate";
import { CSVLink } from "react-csv";
import ReactStars from "react-rating-stars-component";

const AllReviews = () => {
  const classes = viewStyles();
  const dispatch = useDispatch();
  const reviewState = useSelector((state) => {
    return {
      reviews: state.reviews.reviews,
      loading: state.reviews.loading
    };
  })

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  useEffect(() => {
    if (!reviewState.reviews.length) {
      dispatch(reviewsAction());
    }
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    if(event.target.value === "all"){
      setRowsPerPage(+99999);
    } else {
      setRowsPerPage(+event.target.value);
    }
    setPage(0);
  };

  return (
    <Fragment>
      <Grid container spacing={4} className={classes.mainrow}>
        <Grid item lg={12}>
          <Card>
            {reviewState.loading ? <Loading /> : null}
            <CardHeader
              action={
                <span>
                  <Button
                    color="primary"
                    className={classes.addUserBtn}
                    size="small"
                    variant="contained"
                  >
                    <CSVLink
                      filename={
                        "reviews_" + new Date().toLocaleDateString() + ".csv"
                      }
                      data={reviewState.reviews}
                    >
                      Download CSV
                    </CSVLink>
                  </Button>
                </span>
              }
              title="All Reviews"
            />
            <Divider />
            <CardContent>
              <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="reviews-table" size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Last Modified</TableCell>
                      <TableCell>Reviewed Product</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reviewState.reviews
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((review) => (
                        <TableRow key={review.id} hover>
                          <TableCell>{review.title}</TableCell>
                          <TableCell>
                            {review.customer_id.first_name} -{" "}
                            {convertDateToStringFormat(review.date)}
                          </TableCell>
                          <TableCell>
                            {convertDateToStringFormat(review.updated)}
                          </TableCell>
                          <TableCell> {review.product_id.name}</TableCell>
                          <TableCell>
                          {/*<Rating
                            name="read-only"
                            value={Number(review.rating)}
                            readOnly
                          />*/}
                          <ReactStars
                            readOnly
                            value={review.rating}
                            size={24}
                            emptyIcon={<i className="far fa-star"></i>}
                            halfIcon={<i className="fa fa-star-half-alt"></i>}
                            fullIcon={<i className="fa fa-star"></i>}
                            activeColor="#ffd700"
                            edit={false}
                          />
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Edit Review" aria-label="delete">
                              <IconButton
                                aria-label="Edit"
                                onClick={() =>
                                  jumpTo(`edit-review/${review.id}`)
                                }
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Review" aria-label="delete">
                              <IconButton
                                aria-label="Delete"
                                className={classes.deleteicon}
                                onClick={() =>{
                                  if(
                                    window.confirm("Are you sure you want to delete this review?")
                                  )
                                  dispatch(reviewDeleteAction(review.id))
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[100, 200, 500, "all"]}
                component="div"
                count={reviewState.reviews.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default AllReviews;
