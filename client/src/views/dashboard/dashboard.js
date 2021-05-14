import React, { useEffect, useState } from "react";
import { Grid, Box, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import LatestOrder from "./components/latestOrder";
import LatestProducts from "./components/latestProduct";
import DashboardCard from "./components/dashboardCard";
import { getDashboardData } from "../../utils/service";
import { useSelector, useDispatch } from "react-redux";
import { ordersAction } from "../../store/action";
import PeopleIcon from "@material-ui/icons/PeopleOutlined";
import StorefrontIcon from "@material-ui/icons/Storefront";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";

const Dashboard = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const Orders = useSelector((state) => state.orders);
  console.log("Orders are", Orders);
  const [dashBoardCount, setdashBoardCount] = useState({});
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    async function fetchData() {
      dispatch(ordersAction());
      setLoader(true);
      var data = {};
      try {
        data = await getDashboardData();
        console.log("dashboarddata  ", data);
        setLoader(false);
        setdashBoardCount(data);
      } catch {
        setLoader(false);
        setdashBoardCount({});
      }
    }
    fetchData();
  }, []);

  return (
    <Box component="div" p={isSmall ? 1 : 4}>
      <Grid container spacing={isSmall ? 1 : 4}>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <DashboardCard
            count={dashBoardCount.user_count}
            title={"TOTAL USERS"}
            Icon={({ className }) => <PeopleIcon className={className} />}
            loader={loader}
          />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <DashboardCard
            count={dashBoardCount.product_count}
            title={"TOTAL PRODUCTS"}
            Icon={({ className }) => <StorefrontIcon className={className} />}
            loader={loader}
          />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <DashboardCard
            count={dashBoardCount.customer_count}
            title={"TOTAL CUSTOMERS"}
            Icon={({ className }) => <PeopleIcon className={className} />}
            loader={loader}
          />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <DashboardCard
            count={"$"+dashBoardCount.totalsale}
            title={"TOTAL SALES"}
            Icon={({ className }) => <AttachMoneyIcon className={className} />}
            loader={loader}
          />
        </Grid>
        <Grid item lg={4} xl={3} md={12} xs={12}>
          <LatestProducts
            products={dashBoardCount.latest_products}
            loader={loader}
          />
        </Grid>
        <Grid item lg={8} xl={9} md={12} xs={12}>
          <LatestOrder ordersState={Orders} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
