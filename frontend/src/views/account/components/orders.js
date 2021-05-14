import React, { Fragment, useEffect, useState } from "react";
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions,
  Grid,
  Button,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Box,
} from "@material-ui/core";
import { connect } from "react-redux";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import palette from "../../../theme/palette";
import { useDispatch } from "react-redux";
import Auth from "../../../utils/auth";
import { getUserOrdersAction } from "../../../store/action/checkoutAction";
import OrderProductItem from "./orderproductitem";
import Alert from "../../components/alert";

const Orders = (props) => {
  // useEffect(() => {
  //   console.log("inside orders");
  //   try {
  //     const customer_id = Auth.getUserId();
  //     props.getUserOrdersAction(customer_id);
  //   } catch (err) {
  //     console.log("err in useeffect of orders");
  //   }
  //   console.log("order local var", orders);
  // }, [props.orders]);

  useEffect(() => {
    const customer_id = Auth.getUserId();
    props.getUserOrdersAction(customer_id);
    setOrders(props.orders);
  }, [props.orders])

  const [orders, setOrders] = useState([]);

  return (
    <Fragment>
      <Alert />
      <Grid container>
        <Grid item md={12} xs={12}>
          {orders && orders.map((order, index) => (
            <OrderProductItem history={props.history} order={order} key={index} />
          ))}
        </Grid>
      </Grid>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    orders: state.checkoutDetail.orders,
  };
};

const mapDispatchToProps = {
  getUserOrdersAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
