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
import { reviewsAction, newsletterAction } from "../../store/action";
import { Loading } from "../components";
import { convertDateToStringFormat } from "../utils/convertDate";
import { CSVLink } from "react-csv";

const AllReviews = () => {
  const classes = viewStyles();
  const dispatch = useDispatch();
  const reviewState = useSelector((state) => state.newsletter);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  useEffect(() => {
    if (!reviewState.newsletters.length) {
      dispatch(newsletterAction());
    }
  }, []);
console.log(reviewState);
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
                        "newsletter_" + new Date().toLocaleDateString() + ".csv"
                      }
                      data={reviewState.newsletters}
                    >
                      Download CSV
                    </CSVLink>
                  </Button>
                </span>
              }
              title="All Newsletter"
            />
            <Divider />
            <CardContent>
              <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="reviews-table" size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>No</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Last Modified</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reviewState.newsletters
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((newsletter, index) => (
                        <TableRow key={newsletter.id} hover>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            {newsletter.email}
                          </TableCell>
                          <TableCell>
                            {convertDateToStringFormat(newsletter.updated)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[100, 200, 500, "all"]}
                component="div"
                count={reviewState.newsletters.length}
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
