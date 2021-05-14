import React, { Fragment, useEffect } from "react";
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
import { connect } from "react-redux";
import { ordersAction, orderDeleteAction } from "../../store/action";
import jumpTo from "../../utils/navigation";
import { isEmpty } from "../../utils/helper";
import Alert from "../utils/Alert";
import Loading from "../utils/loading";
import DeleteIcon from "@material-ui/icons/Delete";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@material-ui/icons/Edit";
import viewStyles from "../viewStyles";
import { convertDateToStringFormat } from "../utils/convertDate";
import { CSVLink } from "react-csv";
import SearchBar from "../components/OrderSearchBar";

const AllOrders = (props) => {
  const classes = viewStyles();

  useEffect(() => {
    if (isEmpty(props.orders.orders)) {
      props.ordersAction();
    }
  }, []);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const dispatch = useDispatch();

  const [selected, setSelected] = React.useState([]);
  const [dataToShow, setDataToShow] = React.useState(props.orders.orders);
  // dataToShow.forEach((datum) => {
  //   datum.category = datum.categoryId.map((cat) => cat.name).join(", ");
  //   datum["brand name"] = datum.brand.name;
  // });
  useEffect(() => {
    setDataToShow(props.orders.orders);
    console.log("allorders ye hain", props.orders.orders);
  }, [props.orders]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // console.log(props.orders.orders);

  return (
    <Fragment>
      <Alert />
      <Grid container spacing={4} className={classes.mainrow}>
        <Grid item lg={12}>
          <Card>
            {props.orders.loading && <Loading />}

            <CardHeader
              action={
                <>
                  <Tooltip title="Delete Selected Entries" aria-label="delete">
                    <IconButton
                      aria-label="Delete"
                      className={classes.deleteicon}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete selected items from database?"
                          )
                        )
                          selected.forEach((datum) =>
                            dispatch(orderDeleteAction(datum.id))
                          );
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>

                  <span>
                    <Button
                      color="primary"
                      className={classes.addUserBtn}
                      size="small"
                      variant="contained"
                      disabled={!selected.length}
                      style={{ marginRight: "1rem" }}
                    >
                      <CSVLink
                        filename={
                          "orders_" + new Date().toLocaleDateString() + ".csv"
                        }
                        data={selected}
                      >
                        Generate Selected Data CSV
                      </CSVLink>
                    </Button>
                  </span>
                  <span>
                    <Button
                      color="primary"
                      className={classes.addUserBtn}
                      size="small"
                      variant="contained"
                    >
                      <CSVLink
                        filename={
                          "orders_" + new Date().toLocaleDateString() + ".csv"
                        }
                        data={props.orders.orders}
                      >
                        Download CSV All Data
                      </CSVLink>
                    </Button>
                  </span>
                </>
              }
              title="All Orders"
            />
            <Divider />

            <div>
              <SearchBar
                data={props.orders.orders}
                // field={"name"}
                fields={["name"]}
                onQuery={(data) => setDataToShow(data)}
              ></SearchBar>
            </div>
            <CardContent>
              <TableContainer className={classes.container}>
                <Table
                  stickyHeader
                  aria-label="sticky table and Dense Table"
                  size="small"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelected([...dataToShow]);
                            } else {
                              setSelected([]);
                            }
                          }}
                        ></input>
                      </TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Total Amount</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataToShow
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((order) => (
                        <TableRow key={order.id} hover>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selected.includes(order)}
                              onChange={(e) => {
                                if (
                                  e.target.checked &&
                                  !selected.includes(order)
                                ) {
                                  setSelected([...selected, order]);
                                } else if (selected.includes(order)) {
                                  setSelected(
                                    selected.filter((s) => s != order)
                                  );
                                }
                              }}
                            ></input>
                          </TableCell>
                          <TableCell>
                            {order.customer_id ? (order.customer_id.first_name +
                              " " +
                              order.customer_id.last_name): null}
                          </TableCell>
                          <TableCell>
                            {convertDateToStringFormat(order.date)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={"product-status-chip " + order.status}
                            >
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {order.total}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Edit Order" aria-label="edit">
                              <IconButton
                                aria-label="Edit"
                                onClick={() => jumpTo(`view-order/${order.id}`)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Order" aria-label="delete">
                              <IconButton
                                aria-label="Delete"
                                className={classes.deleteicon}
                                onClick={() =>
                                  props.orderDeleteAction(order.id)
                                }
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
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={props.orders.orders.length}
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

const mapStateToProps = (state) => {
  return { orders: state.orders };
};

const mapDispatchToProps = {
  ordersAction,
  orderDeleteAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(AllOrders);
