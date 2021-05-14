import React, { Fragment, useState, useEffect } from "react";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  IconButton,
  TextField,
  FormControl,
  Select,
  Tooltip,
  Box,
  TablePagination,
  Button,
  CardHeader,
} from "@material-ui/core";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import viewStyles from "../../viewStyles.js";
import {
  categoriesAction,
  categoryDeleteAction,
  categoryUpdateAction,
  categoryAddAction,
} from "../../../store/action/";
import { isEmpty } from "../../../utils/helper";
import { getUpdatedUrl } from "../../../utils/service";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { convertDateToStringFormat } from "../../utils/convertDate";
import {
  Alert,
  Loading,
  URLComponent,
  TextInput,
  CardBlocks,
  CardBlocksWithAction,
} from "../../components";
import { CSVLink } from "react-csv";
import SearchBar from "../../components/SearchBar.js";

var categoryObject = {
  name: "",
  parentId: null,
  description: "",
  url: "",
  meta: {
    title: "",
    description: "",
    keywords: "",
  },
};
const AllCategory = (props) => {
  const classes = viewStyles();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const [categories, setCategories] = useState([]);
  const [singlecategory, setSingleCategory] = useState(categoryObject);
  const [editMode, setEditmode] = useState(false);
  const [featuredImage, setfeaturedImage] = useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  const [selected, setSelected] = useState([]);
  const [dataToShow, setDataToShow] = useState(products.categories);
  useEffect(() => {
    setDataToShow(products.categories);
  }, [products]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    if (!products.categories.length) {
      dispatch(categoriesAction());
    }
  }, []);

  useEffect(() => {
    setCategories(products.categories);
    cancelCat();
  }, [products.categories]);

  const editCategory = (cat) => {
    setEditmode(true);
    setfeaturedImage(null);
    if (cat.image && cat.image.original) {
      setfeaturedImage(cat.image.original);
    }
    setSingleCategory({ ...singlecategory, ...cat });
  };

  const handleChange = (e) => {
    if (e.target.name === "parentId" && !e.target.value) {
      setSingleCategory({ ...singlecategory, [e.target.name]: null });
      return;
    }
    setSingleCategory({ ...singlecategory, [e.target.name]: e.target.value });
  };

  const updateCat = () => {
    dispatch(categoryUpdateAction(singlecategory));
    setEditmode(false);
    setSingleCategory(categoryObject);
  };

  const addCat = () => {
    dispatch(categoryAddAction(singlecategory));
  };

  const cancelCat = () => {
    document.forms[0].reset();
    setEditmode(false);
    setfeaturedImage(null);
    setSingleCategory(categoryObject);
  };

  const fileChange = (e) => {
    setfeaturedImage(null);
    setfeaturedImage(URL.createObjectURL(e.target.files[0]));
    setSingleCategory({
      ...singlecategory,
      [e.target.name]: e.target.files,
    });
  };

  const isUrlExist = async (url) => {
    let updatedUrl = await getUpdatedUrl("ProductCat", url);
    setSingleCategory({
      ...singlecategory,
      url: updatedUrl,
    });
  };

  return (
    <Fragment>
      <Alert />
      {products.loading ? <Loading /> : null}
      <Grid container className={classes.mainrow} spacing={2}>
        <Grid item md={6} xs={12}>
          <CardBlocks title="All Categories" nomargin>
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
                            dispatch(categoryDeleteAction(datum.id))
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
                          "categories_" +
                          new Date().toLocaleDateString() +
                          ".csv"
                        }
                        data={selected}
                      >
                        Selected CSV
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
                        data={products.categories}
                      >
                        CSV All Data
                      </CSVLink>
                    </Button>
                  </span>
                </>
              }
              title="All Categories"
            />

            <div>
              <SearchBar
                data={products.categories}
                // field={"name"}
                fields={["name"]}
                onQuery={(data) => setDataToShow(data)}
              ></SearchBar>
            </div>
            <TableContainer className={classes.container}>
              <Table
                stickyHeader
                aria-label="All-Categories-Table"
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
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories &&
                    dataToShow
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((cat) => (
                        <TableRow key={cat.id} hover>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selected.includes(cat)}
                              onChange={(e) => {
                                if (
                                  e.target.checked &&
                                  !selected.includes(cat)
                                ) {
                                  setSelected([...selected, cat]);
                                } else if (selected.includes(cat)) {
                                  setSelected(selected.filter((s) => s != cat));
                                }
                              }}
                            ></input>
                          </TableCell>
                          <TableCell>{cat.name}</TableCell>
                          <TableCell>
                            {convertDateToStringFormat(cat.date)}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Edit Category" aria-label="edit">
                              <IconButton
                                aria-label="Edit"
                                onClick={() => editCategory(cat)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              title="Delete Category"
                              aria-label="delete"
                            >
                              <IconButton
                                aria-label="Delete"
                                className={classes.deleteicon}
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Are you sure you want to delete this category?"
                                    )
                                  )
                                  dispatch(categoryDeleteAction(cat.id))
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
              rowsPerPageOptions={[100 , 200, 500]}
              component="div"
              count={categories.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </CardBlocks>
        </Grid>

        <Grid item md={6} xs={12}>
          <form>
            <CardBlocksWithAction
              title={`${editMode ? "Edit" : "Add"} Category`}
              successBtnLable={editMode ? "Update" : "Add"}
              successBtnOnChange={editMode ? updateCat : addCat}
              cancelBtnOnChange={cancelCat}
              nomargin
            >
              <TextField
                label="Name"
                name="name"
                variant="outlined"
                className={clsx(classes.marginBottom, classes.width100)}
                onChange={handleChange}
                value={singlecategory.name}
                onBlur={(e) =>
                  !singlecategory.url && isUrlExist(singlecategory.name)
                }
              />

              <Box component="div" mb={singlecategory.url ? 2 : 0}>
                <URLComponent
                  url={singlecategory.url}
                  onInputChange={(updatedUrl) => {
                    setSingleCategory({ ...singlecategory, url: updatedUrl });
                  }}
                  pageUrl="category"
                  tableUrl="ProductCat"
                />
              </Box>

              <Box component="div" mb={2}>
                <FormControl variant="outlined" fullWidth>
                  <span className={classes.selectCatLabel}>Parent</span>
                  <Select
                    native
                    value={
                      singlecategory.parentId === null
                        ? ""
                        : singlecategory.parentId
                    }
                    onChange={handleChange}
                    inputProps={{
                      name: "parentId",
                    }}
                  >
                    <option value="">---Select---</option>
                    {categories &&
                      categories.map((cat) => (
                        <option
                          key={cat.id}
                          value={cat.id}
                          disabled={
                            editMode && cat.id === singlecategory.id
                              ? true
                              : false
                          }
                        >
                          {cat.name}
                        </option>
                      ))}
                  </Select>
                </FormControl>
              </Box>

              <Grid container>
                <Grid item className={classes.flex1}>
                  {editMode ? (
                    <TextField
                      helperText="Featured Image"
                      name="update_image"
                      variant="outlined"
                      className={clsx(
                        classes.marginBottom,
                        classes.width100,
                        "top-helper"
                      )}
                      onChange={fileChange}
                      type="file"
                    />
                  ) : (
                    <TextField
                      helperText="Featured Image"
                      name="image"
                      variant="outlined"
                      className={clsx(
                        classes.marginBottom,
                        classes.width100,
                        "top-helper"
                      )}
                      onChange={fileChange}
                      type="file"
                    />
                  )}
                </Grid>
                <Grid item>
                  {featuredImage !== null && (
                    <Box className={classes.logoImageBox}>
                      <img
                        src={featuredImage}
                        className={classes.logoImagePreview}
                      />
                    </Box>
                  )}
                </Grid>
              </Grid>

              <TextField
                label="Short Description"
                name="description"
                variant="outlined"
                className={clsx(classes.marginBottom, classes.width100)}
                multiline
                rows={3}
                value={singlecategory.description}
                onChange={handleChange}
              />

              <Box component="div" mb={2}>
                <TextInput
                  value={singlecategory.meta.title}
                  label="Meta Title"
                  name="metatitle"
                  onInputChange={(e) => {
                    setSingleCategory({
                      ...singlecategory,
                      meta: {
                        ...singlecategory.meta,
                        title: e.target.value,
                      },
                    });
                  }}
                />
              </Box>

              <Box component="div" mb={2}>
                <TextInput
                  value={singlecategory.meta.keywords}
                  label="Meta Keyword"
                  name="metakeyword"
                  onInputChange={(e) => {
                    setSingleCategory({
                      ...singlecategory,
                      meta: {
                        ...singlecategory.meta,
                        keywords: e.target.value,
                      },
                    });
                  }}
                />
              </Box>

              <Box component="div" mb={2}>
                <TextInput
                  value={singlecategory.meta.description}
                  label="Meta Description"
                  name="metadescription"
                  onInputChange={(e) => {
                    setSingleCategory({
                      ...singlecategory,
                      meta: {
                        ...singlecategory.meta,
                        description: e.target.value,
                      },
                    });
                  }}
                  multiline
                  rows={3}
                />
              </Box>
            </CardBlocksWithAction>
          </form>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default AllCategory;
