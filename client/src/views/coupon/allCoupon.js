import React, { Fragment, useEffect, useState } from "react";
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
  Button,
  Tooltip,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { couponsAction, couponDeleteAction } from "../../store/action";
import jumpTo from "../../utils/navigation";
import { isEmpty } from "../../utils/helper";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import viewStyles from "../viewStyles";
import { Alert, Loading } from "../components";
import { convertDateToStringFormat } from "../utils/convertDate";
import { CSVLink } from "react-csv";

const AllCoupons = () => {
  const classes = viewStyles();
  const dispatch = useDispatch();
  const Coupons = useSelector((state) => state.coupons);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  useEffect(() => {
    if (isEmpty(Coupons.coupons)) {
      dispatch(couponsAction());
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
      <Alert />
      <Grid container spacing={4} className={classes.mainrow}>
        <Grid item lg={12}>
          <Card>
            {Coupons.loading && <Loading />}
            <CardHeader
              action={
                <>
                  <Link to="/admin/add-coupon">
                    <Button
                      color="primary"
                      className={classes.addUserBtn}
                      size="small"
                      variant="contained"
                    >
                      Add Coupon
                    </Button>
                  </Link>
                  <span>
                    <Button
                      color="primary"
                      className={classes.addUserBtn}
                      size="small"
                      variant="contained"
                    >
                      <CSVLink
                        filename={
                          "coupons_" + new Date().toLocaleDateString() + ".csv"
                        }
                        data={Coupons.coupons}
                      >
                        Download CSV
                      </CSVLink>
                    </Button>
                  </span>
                </>
              }
              title="All Coupons"
            />
            <Divider />
            <CardContent>
              <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="allcoupons-table" size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Code</TableCell>
                      <TableCell>Coupon type</TableCell>
                      <TableCell>Coupon Amount</TableCell>
                      <TableCell>Expiry date</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Coupons.coupons
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((coupon) => (
                        <TableRow key={coupon.id} hover>
                          <TableCell>{coupon.code}</TableCell>
                          <TableCell>{coupon.discount_type}</TableCell>
                          <TableCell>{coupon.discount_value}</TableCell>
                          <TableCell>
                            {convertDateToStringFormat(coupon.expire)}
                          </TableCell>
                          <TableCell>
                            <Tooltip
                              title="Edit Coupon"
                              aria-label="edit-coupon"
                            >
                              <IconButton
                                aria-label="Edit"
                                onClick={() =>
                                  jumpTo(`edit-coupon/${coupon.id}`)
                                }
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              title="Delete Coupon"
                              aria-label="delete-coupon"
                            >
                              <IconButton
                                aria-label="Delete"
                                className={classes.deleteicon}
                                onClick={() =>{
                                  if(
                                    window.confirm("Are you sure you want to delete this coupon?")
                                  )
                                  dispatch(couponDeleteAction(coupon.id))
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
                count={Coupons.coupons.length}
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

export default AllCoupons;
