import React, { Fragment, useState, useEffect } from "react";
import {
  Grid,
  Button,
  Box,
  RadioGroup,
  FormControlLabel,
  useMediaQuery,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { useDispatch, useSelector } from "react-redux";
import { pageUpdateAction, pageAction } from "../../store/action/";
import TinymceEditor from "./TinymceEditor.js";
import { isEmpty } from "../../utils/helper";
import viewStyles from "../viewStyles";
import {
  Alert,
  Loading,
  TopBar,
  TextInput,
  StyledRadio,
  CardBlocks,
} from "../components";

var defaultObj = {
  status: "Publish",
  title: "",
  meta: {
    title: "",
    description: "",
    keywords: "",
  },
};

const EditPage = (props) => {
  const PageID = props.match.params.id;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = viewStyles();
  const dispatch = useDispatch();
  const pageState = useSelector((state) => state.pages);
  const [editPremalink, setEditPermalink] = useState(false);
  const [page, setPage] = useState(defaultObj);

  useEffect(() => {
    if (PageID) {
      dispatch(pageAction(PageID));
    }
  }, [PageID]);

  useEffect(() => {
    if (!isEmpty(pageState.page)) {
      setPage({ ...pageState.page });
    }
  }, [pageState.page]);

  const updatePage = (e) => {
    e.preventDefault();
    dispatch(pageUpdateAction(page));
  };

  const handleChange = (e) => {
    setPage({ ...page, [e.target.name]: e.target.value });
  };

  const changePermalink = () => {
    setEditPermalink(!editPremalink);
  };

  const metaChange = (e) => {
    setPage({
      ...page,
      meta: { ...page.meta, [e.target.name]: e.target.value },
    });
  };

  return (
    <Fragment>
      <Alert />
      {pageState.loading ? <Loading /> : null}
      <form>
        <TopBar
          title="Edit Page"
          onSubmit={updatePage}
          submitTitle="Update"
          backLink={"/admin/all-pages"}
        />

        <Grid
          container
          spacing={isSmall ? 2 : 3}
          className={classes.secondmainrow}
        >
          <Grid item lg={9} md={12} xs={12}>
            <CardBlocks title="Page Information" nomargin>
              <Box component="div" mb={2}>
                <TextInput
                  value={page.title}
                  label="Title"
                  name="title"
                  onInputChange={handleChange}
                />
              </Box>

              <Box component="div" mb={2}>
                {page.title ? (
                  <span style={{ marginBottom: 10, display: "block" }}>
                    <strong>Link: </strong>
                    https://www.google.com/product/
                    {editPremalink === false && page.url}
                    {editPremalink === true && (
                      <input
                        id="url"
                        name="url"
                        value={page.url}
                        onChange={handleChange}
                        variant="outlined"
                        className={classes.editpermalinkInput}
                      />
                    )}
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={changePermalink}
                      className={classes.editpermalinkInputBtn}
                    >
                      {editPremalink ? "Ok" : "Edit"}
                    </Button>
                  </span>
                ) : null}
              </Box>
              <Box component="div">
                <TinymceEditor value={page.content} />
              </Box>
            </CardBlocks>

            <CardBlocks title="Meta Information">
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextInput
                    label="Meta Title"
                    name="title"
                    value={page.meta.title}
                    onInputChange={metaChange}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextInput
                    label="Meta Keyword"
                    name="keywords"
                    value={page.meta.keywords}
                    onInputChange={metaChange}
                  />
                </Grid>

                <Grid item md={12} xs={12}>
                  <TextInput
                    label="Description"
                    name="description"
                    value={page.meta.description}
                    onInputChange={metaChange}
                    multiline
                    rows="4"
                  />
                </Grid>
              </Grid>
            </CardBlocks>
          </Grid>

          <Grid item lg={3} md={12} xs={12}>
            <CardBlocks title="Status" nomargin>
              <RadioGroup
                defaultValue="Publish"
                name="status"
                onChange={handleChange}
                row
                value={page.status}
              >
                <FormControlLabel
                  value="Publish"
                  control={<StyledRadio />}
                  label="Publish"
                />
                <FormControlLabel
                  value="Draft"
                  control={<StyledRadio />}
                  label="Draft"
                />
              </RadioGroup>
            </CardBlocks>
          </Grid>
        </Grid>
      </form>
    </Fragment>
  );
};

export default EditPage;
