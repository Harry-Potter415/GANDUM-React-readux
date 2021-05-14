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
import toastr from "toastr";

import { deleteOrder, updateOrder } from "../../../store/action/checkoutAction";

const OrderProductItem = (props) => {
  const [order, setOrder] = useState(false);

  const deleteOrder = (item) => {
    var del = window.confirm("Are you sure?");
    if (del == true) {
      props.deleteOrder(item.id);
      window.toast("Order is cancelled succefully.");
      window.location.href = "/account/orders";
    }
  }

  const updateOrder = (item) => {
    var upd = window.confirm("Are you sure?");
    if (upd == true) {
      props.updateOrder(item);
      window.toast("Order is updated succefully.", "warning");
      window.location.href = "/account/orders";
    }
  }

  useEffect(() => {
    setOrder(props.order);
  }, [props.order])

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1c-content"
        id="panel1c-header"
      >
        <Grid container>
          <Grid item md={4} sm={4} xs={12}>
            <Typography variant="h6">Order #{order.id}</Typography>
          </Grid>
          <Grid item md={4} sm={4} xs={12}>
            <Typography variant="subtitle2">
              {order.products ? order.products.length : "" } product totaling ${order.total}
            </Typography>
          </Grid>
          <Grid item md={4} sm={4} xs={12}>
            <Typography variant="button">{order.status}</Typography>
          </Grid>
        </Grid>
      </ExpansionPanelSummary>
      <Divider />
      <ExpansionPanelDetails>
        <Grid container spacing={4} className="margin-top-2">
          <Grid item lg={6} xs={12}>
            <Typography
              variant="h5"
              className="margin-bottom-2"
              style={{ color: palette.primary.dark }}
            >
              Order Info
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h6">Order Number</Typography>
                    </TableCell>
                    <TableCell>{order.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h6">Date</Typography>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h6">Total</Typography>
                    </TableCell>
                    <TableCell>${order.total}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h6">
                        Payment Method
                      </Typography>
                    </TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item lg={6} xs={12}>  
              {order.billing && (
              <Box component="div">
                <Typography
                  variant="h5"
                  className="margin-bottom-2"
                  style={{ color: palette.primary.dark }}
                >
                  Billing Address
                </Typography>
                <Typography variant="h6">
                  { order.billing.firstname} {order.billing.lastname}
                </Typography>
                <Typography variant="subtitle2">
                  {order.billing.email}
                </Typography>
                <Typography variant="subtitle2">9997774441</Typography>
                <Typography variant="body1">
                  {order.billing.city},{order.billing.state},
                  {order.billing.country}
                </Typography>
              </Box>
              )}
            <Box className="margin-bottom-2 margin-top-2">
              <Divider />
            </Box>
            {order.shipping && (
              <Box component="div">
                <Typography
                  variant="h5"
                  className="margin-bottom-2"
                  style={{ color: palette.primary.dark }}
                >
                  Shipping Address
                </Typography>
                <Typography variant="h6">Firstname lastname</Typography>
                <Typography variant="subtitle2">
                  {order.shipping.email}
                </Typography>
                <Typography variant="subtitle2">9997774441</Typography>
                <Typography variant="body1">
                  {order.shipping.address_line_1},
                  {order.shipping.address_line_2}
                </Typography>
                <Typography variant="body1">
                  {order.shipping.city},{order.shipping.state},
                  {order.shipping.country}
                </Typography>
              </Box>
            )}
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography
              variant="h5"
              className="margin-bottom-2"
              style={{ color: palette.primary.dark }}
            >
              Order Details
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Products</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {order.products && order.products.map((product) => (
                    <TableRow>
                      <TableCell>
                        <Typography variant="h6">
                          {product.name}
                        </Typography>
                      </TableCell>
                      <TableCell>x {product.qty}</TableCell>
                      <TableCell align="right">
                        $ {product.cost}
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow>
                    <TableCell rowSpan={4} />
                    <TableCell>
                      <Typography variant="h6">Subtotal</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">
                        $ {order.subtotal}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h6">Tax</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">$ 50</Typography>
                    </TableCell>
                  </TableRow>
                  {/* <TableRow>
                    <TableCell>
                      <Typography variant="h6">Shipping</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">$ 20</Typography>
                    </TableCell>
                  </TableRow> */}
                  <TableRow>
                    <TableCell>
                      <Typography
                        variant="h5"
                        style={{ color: palette.primary.dark }}
                      >
                        Total
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="h5"
                        style={{ color: palette.primary.dark }}
                      >
                        ${order.total}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          {order.status === "Processing"&&(
            <Grid item md={12} xs={12}>
              <Button variant="contained" color="primary" style={{float: "right"}} onClick={() => deleteOrder(order)}>
                Cancel
              </Button>
            </Grid>
          )}
          {order.status === "Completed"&&(
            <Grid item md={12} xs={12}>
              <Button variant="contained" color="primary" style={{float: "right"}} onClick={() => updateOrder(order)}>
                Refund
              </Button>
            </Grid>
          )}
        </Grid>
      </ExpansionPanelDetails>
      <Divider />
    </ExpansionPanel>
  );
};

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = {
  deleteOrder,
  updateOrder
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderProductItem);
