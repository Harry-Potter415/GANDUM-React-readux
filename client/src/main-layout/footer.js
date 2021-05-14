import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    backgroundColor: "#e4e7ea",
    textAlign: "center",
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="body1">
        &copy; Copyright - 2021{" "}
        <a href="#" target="_blank" style={{ color: "#000" }}>
          Gandom Mart
        </a>
      </Typography>
      <Typography variant="caption">All rights reserved</Typography>
    </div>
  );
};

export default Footer;
