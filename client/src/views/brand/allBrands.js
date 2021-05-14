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
  Button,
  Tooltip,
  useMediaQuery,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import jumpTo from "../../utils/navigation";
import viewStyles from "../viewStyles.js";
import { isEmpty } from "../../utils/helper";
import { brandsAction, brandDeleteAction } from "../../store/action";
import { useDispatch, useSelector } from "react-redux";
import { Loading, Alert } from "../components";
import { convertDateToStringFormat } from "../utils/convertDate";
import { CSVLink } from "react-csv";
import SearchBar from "../components/SearchBar";

const AllBrands = (props) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = viewStyles();
  const dispatch = useDispatch();
  const Brands = useSelector((state) => state.brands);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const [selected, setSelected] = useState([]);
  const [dataToShow, setDataToShow] = useState(Brands.brands);
  useEffect(() => {
    setDataToShow(Brands.brands);
  }, [Brands]);

  useEffect(() => {
    if (isEmpty(Brands.brands)) {
      dispatch(brandsAction());
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
      <Grid container spacing={isSmall ? 2 : 4} className={classes.mainrow}>
        <Grid item lg={12}>
          <Card>
            {Brands.loading && <Loading />}

            <CardHeader
              action={
                <>
                  <Link to="/admin/add-brand">
                    <Button
                      color="primary"
                      className={classes.addUserBtn}
                      size="small"
                      variant="contained"
                    >
                      Add New Brand
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
                            dispatch(brandDeleteAction(datum.id))
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
                          "brands_" + new Date().toLocaleDateString() + ".csv"
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
                          "brands_" + new Date().toLocaleDateString() + ".csv"
                        }
                        data={Brands.brands}
                      >
                        Download CSV All Data
                      </CSVLink>
                    </Button>
                  </span>
                </>
              }
              title="All Brands"
            />
            <Divider />

            <div>
              <SearchBar
                data={Brands.brands}
                // field={"name"}
                fields={["name"]}
                onQuery={(data) => setDataToShow(data)}
              ></SearchBar>
            </div>
            <CardContent>
              <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="brands-table" size="small">
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
                      <TableCell>Brand Name</TableCell>
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
                      .map((brand) => (
                        <TableRow key={brand.id} hover>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selected.includes(brand)}
                              onChange={(e) => {
                                if (
                                  e.target.checked &&
                                  !selected.includes(brand)
                                ) {
                                  setSelected([...selected, brand]);
                                } else if (selected.includes(brand)) {
                                  setSelected(
                                    selected.filter((s) => s != brand)
                                  );
                                }
                              }}
                            ></input>
                          </TableCell>
                          <TableCell>{brand.name}</TableCell>
                          <TableCell>
                            {convertDateToStringFormat(brand.date)}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Edit Brand" aria-label="edit">
                              <IconButton
                                aria-label="Edit"
                                onClick={() => jumpTo(`edit-brand/${brand.id}`)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Brand" aria-label="delete">
                              <IconButton
                                aria-label="Delete"
                                className={classes.deleteicon}
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Are you sure you want to delete this brand?"
                                    )
                                  )
                                  dispatch(brandDeleteAction(brand.id))
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
                count={Brands.brands.length}
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

export default AllBrands;
