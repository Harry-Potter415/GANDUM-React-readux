import React, { Fragment, useState, useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { connect } from "react-redux";

function CustomAlert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Alert = props => {
  const [isOpen, setisOpen] = useState(false);
  useEffect(() => {
    if (props.alert.success) {
      setisOpen(true);
      window.setTimeout(() => {
        setisOpen(false);
        props.dispatch({
          type: "ALERT_SUCCESS",
          payload: { boolean: false, message: "", error: false }
        });
      }, 3000);
    }
  }, [props.alert.success]);

  return (
    <Fragment>
      <Snackbar
        autoHideDuration={3000}
        open={isOpen}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <CustomAlert severity={props.alert.error ? "error" : "success"}>
          {props.alert.message}
        </CustomAlert>
      </Snackbar>
    </Fragment>
  );
};

const mapStateToProps = state => {
  return { alert: state.alert };
};

export default connect(mapStateToProps)(Alert);