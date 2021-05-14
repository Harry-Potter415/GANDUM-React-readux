import React, { Fragment, useEffect, useState } from "react";
import {
  Box,
  Badge,
  Icon,
  MenuItem,
  Menu,
  Hidden,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import Auth from "../utils/auth";
import SearchBar from "material-ui-search-bar";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

import FavoriteIcon from '@material-ui/icons/Favorite';

import "./menu.css";

const Navigation = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [collaspeAccount, setCollaspeAccount] = useState(false);
  const [logoutConfrm, setLogoutConfrm] = useState(false);
  const [token, setToken] = useState(null);
  const [username, setUserName] = useState(null);
  const [searchbarText, setSearchbarText] = useState("");

  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const Logout = () => {
    setLogoutConfrm(true);
    handleClose();
    props.drawerCloseFunc();
  };

  useEffect(() => {
    window.wss.onmessage = (message) => {
      let data = JSON.parse(message.data)
      let user_id = Auth.getUserId()
      if(data.type == "frontend"){
        if(user_id == data.user){
          window.toast(data.message)
        }
      }
    };
  }, []);

  useEffect(() => {
    try {
      const token = Auth.getToken();
      const username = Auth.getUserName();
      if (token) {
        setToken(token);
      }
      if (username) {
        setUserName(username);
      }
    } catch (err) {
      console.log("menu component useeffect error ", "no token no login");
    }
    console.log("menu reloaded");
  });

  useEffect(() => {
    if(searchbarText !== ""){
      props.history.push("/shop");
    }
    dispatch({ type: "SET_TOP_SEARCH", payload: searchbarText });
  }, [searchbarText])

  return (
    <Fragment>
      <Box
        component="div"
        display="flex"
        alignItems="center"
        className="menu-item-wrapper"
      >
        <SearchBar value={searchbarText} onChange={(event)=>{setSearchbarText(event)}}/>
        <Box component="div" display="inline" m={2} className="menu-item">
          <Link onClick={() => props.drawerCloseFunc()} to="/">
            Home
          </Link>
        </Box>
        <Box component="div" display="inline" m={2} className="menu-item">
          <Link onClick={() => props.drawerCloseFunc()} to="/shop">
            Shopping
          </Link>
        </Box>
        <Hidden mdDown>
          <Box component="div" display="inline" m={2} className="menu-item">
            <Badge
              badgeContent={props.cart.products.length}
              color="secondary"
              style={{ backgroundColor: "transparent" }}
            >
              <Icon
                style={{ fontSize: 24 }}
                onClick={(e) => props.toggleCartFunc(e)}
                style={{
                  backgroundColor: "#9eb876",
                  borderRadius: 5,
                  padding: 5,
                }}
              >
                shopping_cart
              </Icon>
            </Badge>
          </Box>
        </Hidden>
        {username && (
          <Hidden mdDown>
            <Link to="/wishlist">
              <Box component="div" display="inline" m={2} className="menu-item">
                <IconButton style={{"padding": "12px 0px", "color": "#673ab7"}}>
                  <FavoriteIcon />
                </IconButton>
              </Box>
            </Link>
          </Hidden>
        )}
        {/* ==============================Account Menu for Desktop============================ */}
        <Hidden mdDown>
          {username && (
            <Box component="div" display="inline" m={2} className="menu-item">
              <Link onClick={() => props.drawerCloseFunc()} to="/shop"></Link>
              {username}
            </Box>
          )}
          <Box component="div" display="inline" m={2} className="menu-item">
            <Icon
              style={{ fontSize: 24 }}
              aria-controls="account-menu"
              aria-haspopup="true"
              onClick={handleClick}
              style={{
                backgroundColor: "#9eb876",
                borderRadius: 5,
                padding: 5,
              }}
              className="account-menu-link"
            >
              supervisor_account
            </Icon>
          </Box>
        </Hidden>
        {/* ==============================Account Menu for Mobile============================ */}
        <Hidden lgUp>
          <Box
            component="div"
            display="flex"
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            m={2}
            className="width-100"
            onClick={() => setCollaspeAccount(!collaspeAccount)}
          >
            <Box>Account</Box>
            <Box>
              <Icon>
                {collaspeAccount ? "keyboard_arrow_up" : "keyboard_arrow_down"}
              </Icon>
            </Box>
          </Box>
          {/* ==============================Collapsable Menu============================ */}
          <Collapse in={collaspeAccount} className="collapsible-menu-mobile">
            {!token && (
              <>
                <Box
                  component="div"
                  display="inline"
                  m={2}
                  className="menu-item"
                >
                  <Link onClick={() => props.drawerCloseFunc()} to="/login">
                    Login
                  </Link>
                </Box>

                <Box
                  component="div"
                  display="inline"
                  m={2}
                  className="menu-item"
                >
                  <Link onClick={() => props.drawerCloseFunc()} to="/register">
                    Register
                  </Link>
                </Box>
              </>
            )}
            {token && (
              <>
                <Box
                  component="div"
                  display="inline"
                  m={2}
                  className="menu-item"
                >
                  <Link
                    onClick={() => props.drawerCloseFunc()}
                    to="/account/orders"
                  >
                    Orders
                  </Link>
                </Box>
                <Box
                  component="div"
                  display="inline"
                  m={2}
                  className="menu-item"
                >
                  {/* <Link
                    onClick={() => props.drawerCloseFunc()}
                    to="/account/address"
                  >
                    Address
                  </Link> */}
                </Box>
                {/* <Box
                  component="div"
                  display="inline"
                  m={2}
                  className="menu-item"
                >
                  <Link
                    onClick={() => props.drawerCloseFunc()}
                    to="/account/recently-viewed"
                  >
                    Recently Viewed
                  </Link>
                </Box> */}
                <Box
                  component="div"
                  display="inline"
                  m={2}
                  className="menu-item"
                >
                  <Link
                    onClick={() => props.drawerCloseFunc()}
                    to="/account/profile"
                  >
                    Profile
                  </Link>
                </Box>
                <Box
                  component="div"
                  display="inline"
                  m={2}
                  className="menu-item"
                >
                  <Link onClick={() => props.drawerCloseFunc()} to="/login">
                    Logout
                  </Link>
                </Box>
              </>
            )}
          </Collapse>
        </Hidden>
      </Box>
      {/* ==============================Account Menu for Desktop============================ */}
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        keepMounted
        style={{ zIndex: 9999, minWidth: 200 }}
      >
        {!token && (
          <>
            <Link to="/login">
              <MenuItem onClick={handleClose}>Login</MenuItem>
            </Link>
            <Link to="/register">
              <MenuItem onClick={handleClose}>Register</MenuItem>
            </Link>
          </>
        )}
        {token && (
          <>
            <Link to="/account/orders">
              <MenuItem onClick={handleClose}>Orders</MenuItem>
            </Link>
            {/* <Link to="/account/address">
              <MenuItem onClick={handleClose}>Address</MenuItem>
            </Link> */}
            {/* <Link to="/account/recently-viewed">
              <MenuItem onClick={handleClose}>Recently Viewed</MenuItem>
            </Link> */}
            <Link to="/account/profile">
              <MenuItem onClick={handleClose}>Profile</MenuItem>
            </Link>
            <MenuItem onClick={Logout}>Logout</MenuItem>
          </>
        )}
      </Menu>

      {/* ==============================Logout Dialog============================ */}
      <Dialog
        open={logoutConfrm}
        onClose={handleClose}
        aria-labelledby="logout-dailog"
        aria-describedby="logout-confirmation"
        fullWidth={false}
        maxWidth={"xs"}
      >
        <DialogTitle id="logout-dailog">{"LogOut"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-confirmation">
            Are you sure you would like to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutConfrm(false)} color="primary">
            Cancel
          </Button>
          <Link
            to="/login"
            onClick={() => {
              setLogoutConfrm(false);
              Auth.logout();
              dispatch({ type: "USER_LOGOUT", payload: null });
            }}
          >
            <Button color="primary" autoFocus>
              Logout
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
});

export default connect(mapStateToProps)(withRouter(Navigation));
