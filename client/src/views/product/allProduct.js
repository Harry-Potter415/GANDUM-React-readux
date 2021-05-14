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
  Avatar,
  Button,
  Tooltip,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  productsAction,
  productDeleteAction,
  productsDeleteManyAction,
} from "../../store/action";
import jumpTo from "../../utils/navigation";
import ImageIcon from "@material-ui/icons/Image";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import viewStyles from "../viewStyles";
import { convertDateToStringFormat } from "../utils/convertDate";
import { Alert, Loading } from "../components";
import { CSVLink } from "react-csv";
import SearchBar from "../components/SearchBar.js";

const AllProduct = () => {
  const classes = viewStyles();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    dispatch(productsAction());
  }, []);

  const [dataToShow, setDataToShow] = useState(products.products);
  dataToShow.forEach((product) => {
    product.category = product.categoryId.map((cat) => cat.name).join(", ");
    product["brand name"] = product.brand?.name;
  });
  useEffect(() => {
    setDataToShow(products.products);
  }, [products]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  console.log(dataToShow);

  return (
    <Fragment>
      <Alert />
      <Grid container spacing={2} className={classes.mainrow}>
        <Grid item xl={12}>
          <Card className="calendar_overlay">
            {products.loading ? <Loading /> : null}
            <CardHeader
              action={
                <>
                  <Link to="/admin/add-product">
                    <Button
                      color="primary"
                      className={classes.addUserBtn}
                      size="small"
                      variant="contained"
                    >
                      Add Product
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
                          // selected.forEach((datum) =>
                          //   dispatch(productDeleteAction(datum.id))
                          // );
                          dispatch(
                            productsDeleteManyAction(
                              selected.map((datum) => datum.id)
                            )
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
                          "products_" + new Date().toLocaleDateString() + ".csv"
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
                          "products_" + new Date().toLocaleDateString() + ".csv"
                        }
                        data={products.products}
                      >
                        Download CSV All Data
                      </CSVLink>
                    </Button>
                  </span>
                </>
              }
              title="All Products"
            />
            <Divider />
            <div>
              <SearchBar
                data={products.products}
                // field={"name"}
                fields={["name", "brand name", "category"]}
                onQuery={(data) => setDataToShow(data)}
              ></SearchBar>
            </div>
            <CardContent>
              <TableContainer>
                <Table stickyHeader aria-label="all-products" size="small">
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
                      <TableCell className={classes.avtarTd}>
                        <ImageIcon />
                      </TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Brand</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className={classes.container}>
                    {dataToShow
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((product, i) => (
                        <TableRow key={product.id} hover>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selected.includes(product)}
                              onChange={(e) => {
                                if (
                                  e.target.checked &&
                                  !selected.includes(product)
                                ) {
                                  setSelected([...selected, product]);
                                } else if (selected.includes(product)) {
                                  setSelected(
                                    selected.filter((s) => s != product)
                                  );
                                }
                              }}
                            ></input>
                          </TableCell>
                          <TableCell>
                            <Avatar
                              alt={product.name}
                              src={
                                product.feature_image &&
                                product.feature_image.thumbnail
                              }
                            />
                          </TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>
                            {convertDateToStringFormat(product.date)}
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.brand?.name}</TableCell>
                          <TableCell>{product.status}</TableCell>
                          <TableCell>
                            <Tooltip title="Edit Product" aria-label="edit">
                              <IconButton
                                aria-label="Edit"
                                onClick={() =>
                                  jumpTo(`edit-product/${product.id}`)
                                }
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Product" aria-label="delete">
                              <IconButton
                                aria-label="Delete"
                                className={classes.deleteicon}
                                onClick={() =>
                                  window.confirm(
                                    "Are you sure you want to delete this product? " +
                                      product.name
                                  )
                                    ? dispatch(productDeleteAction(product.id))
                                    : null
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
                rowsPerPageOptions={[5, 10, 20, 50, 100, 200]}
                component="div"
                count={products.products.length}
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

export default AllProduct;
