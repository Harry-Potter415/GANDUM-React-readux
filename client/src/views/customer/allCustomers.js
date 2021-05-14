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
  useMediaQuery,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { Link } from "react-router-dom";
import { customersAction, customerDeleteAction } from "../../store/action";
import jumpTo from "../../utils/navigation";
import { isEmpty } from "../../utils/helper";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import viewStyles from "../viewStyles";
import { convertDateToStringFormat } from "../utils/convertDate";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Loading } from "../components";
import { CSVLink } from "react-csv";
import SearchBar from "../components/SearchBar";

const AllCustomers = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = viewStyles();
  const dispatch = useDispatch();
  const Customers = useSelector((state) => state.customers);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (isEmpty(Customers.customers)) {
      dispatch(customersAction());
    }
  }, []);
  const [dataToShow, setDataToShow] = useState(Customers.customers);
  useEffect(() => {
    setDataToShow(Customers.customers);
  }, [Customers]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Fragment>
      <Alert />
      <Grid container spacing={isSmall ? 2 : 4} className={classes.mainrow}>
        <Grid item lg={12}>
          <Card>
            {Customers.loading && <Loading />}

            <CardHeader
              action={
                <>
                  <Link to="/admin/add-customer">
                    <Button
                      color="primary"
                      className={classes.addUserBtn}
                      size="small"
                      variant="contained"
                    >
                      Add Customer
                    </Button>
                  </Link>
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
                            dispatch(customerDeleteAction(datum.id))
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
                          "customers_" +
                          new Date().toLocaleDateString() +
                          ".csv"
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
                          "customers_" +
                          new Date().toLocaleDateString() +
                          ".csv"
                        }
                        data={Customers.customers}
                      >
                        Download CSV All Data
                      </CSVLink>
                    </Button>
                  </span>
                </>
              }
              title="All Customers"
            />
            <Divider />
            <div>
              <SearchBar
                data={Customers.customers.map((c) => ({
                  ...c,
                  name: c.first_name + c.last_name,
                }))}
                fields={["name", "email", "phone"]}
                onQuery={(data) => setDataToShow(data)}
              ></SearchBar>
            </div>
            <CardContent>
              <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="customers-table" size="small">
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
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataToShow
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((customer) => (
                        <TableRow key={customer.id} hover>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selected.includes(customer)}
                              onChange={(e) => {
                                if (
                                  e.target.checked &&
                                  !selected.includes(customer)
                                ) {
                                  setSelected([...selected, customer]);
                                } else if (selected.includes(customer)) {
                                  setSelected(
                                    selected.filter((s) => s != customer)
                                  );
                                }
                              }}
                            ></input>
                          </TableCell>
                          <TableCell>
                            {customer.first_name + " " + customer.last_name}
                          </TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>{customer.phone}</TableCell>
                          <TableCell>
                            {convertDateToStringFormat(customer.date)}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Edit Customer" aria-label="edit">
                              <IconButton
                                aria-label="Edit"
                                onClick={() =>
                                  jumpTo(`edit-customer/${customer.id}`)
                                }
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              title="Delete Customer"
                              aria-label="delete"
                            >
                              <IconButton
                                aria-label="Delete"
                                className={classes.deleteicon}
                                onClick={() =>
                                  dispatch(customerDeleteAction(customer.id))
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
                count={Customers.customers.length}
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

export default AllCustomers;
