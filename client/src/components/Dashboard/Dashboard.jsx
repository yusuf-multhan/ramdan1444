import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import {
  CHAIRS_UNIT,
  GrandTotal,
  MARKAZ_CONST,
  ZABIHAT_UNIT,
} from "../../constants";
import { formService } from "../../services/formService";
import { receiptService } from "../../services/receiptService";
import { GET_FORMS, GET_RECEIPTS } from "../../store/actionTypes";
import {
  getDashboardMetric,
  getReceiptMetric,
  useCustomHook,
} from "../common-components";
import Header from "../Header";
import BarChart from "./BarChart";
import RadialBar from "./RadialBar";

const Dashboard = () => {
  const { state, dispatch, startLoading, endLoading, addToastMsg } =
    useCustomHook();
  const [dashboardMetric, setDashboardMetric] = React.useState({});
  const [receiptMetric, setReceiptMetric] = React.useState({});

  React.useEffect(() => {
    const t = async () => {
      try {
        startLoading();
        const res = await Promise.all([
          formService.getForms().catch((e) => {
            addToastMsg("unable to fetch form details", "error");
          }),
          receiptService.getReceipts().catch((e) => {
            addToastMsg("unable to fetch receipt details", "error");
          }),
        ]);
        if (res?.[0]?.isOK) {
          dispatch({
            type: GET_FORMS,
            payload: res[0].data,
          });
        }
        if (res?.[1]?.isOK) {
          dispatch({
            type: GET_RECEIPTS,
            payload: res[1].data,
          });
        }
      } catch (e) {
        console.log("Unable to fetch details", e);
        addToastMsg("Unable to fetch details", "error");
      }
      endLoading();
    };
    t();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setDashboardMetric(getDashboardMetric(state.forms));
  }, [state.forms, setDashboardMetric]);

  React.useEffect(() => {
    setReceiptMetric(getReceiptMetric(state.receipts));
  }, [state.receipts, setReceiptMetric]);

  // No Data Scenario
  return (
    <>
      <Header header={"Dashboard"} />
      {dashboardMetric.total ? (
        <Grid container spacing={2} direction="row" alignContent={"center"}>
          <Grid item xs={6}>
            <Paper>
              <RadialBar dashboardMetric={dashboardMetric} />
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper>
              <BarChart dashboardMetric={dashboardMetric} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        By Cash
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        By Cheque
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        Online
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        Total Collection
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(receiptMetric).map((key) => {
                      return (
                        key !== GrandTotal && (
                          <TableRow key={key}>
                            <TableCell>{key}</TableCell>
                            <TableCell align="right">
                              {receiptMetric[key].cash ?? 0}
                            </TableCell>
                            <TableCell align="right">
                              {receiptMetric[key].cheque ?? 0}
                            </TableCell>
                            <TableCell align="right">
                              {receiptMetric[key].online ?? 0}
                            </TableCell>
                            <TableCell align="right">
                              {receiptMetric[key].collection ?? 0}
                            </TableCell>
                          </TableRow>
                        )
                      );
                    })}
                    <TableRow key={GrandTotal}>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        {GrandTotal}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        {receiptMetric[GrandTotal].cash ?? 0}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        {receiptMetric[GrandTotal].cheque ?? 0}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        {receiptMetric[GrandTotal].online ?? 0}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        {receiptMetric[GrandTotal].collection ?? 0}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        Niyaaz takhmeen
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        Zabihat
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        Iftaari
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        Chairs
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        Total
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        Pending amount
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {MARKAZ_CONST.map((item) => {
                      return (
                        <TableRow key={item.value}>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            {item.displayVal}
                          </TableCell>
                          <TableCell align="right">
                            {dashboardMetric[item.value]?.takhmeenAmount ?? 0}
                          </TableCell>
                          <TableCell align="right">
                            {dashboardMetric[item.value]?.zabihat
                              ? `${
                                  dashboardMetric[item.value]?.zabihat
                                } x ${ZABIHAT_UNIT}`
                              : 0}
                          </TableCell>
                          <TableCell align="right">
                            {dashboardMetric[item.value]?.iftaari ?? 0}
                          </TableCell>
                          <TableCell align="right">
                            {dashboardMetric[item.value]?.chairs
                              ? `${
                                  dashboardMetric[item.value]?.chairs
                                } x ${CHAIRS_UNIT}`
                              : 0}
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }} align="right">
                            {dashboardMetric[item.value]?.grandTotal ?? 0}
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }} align="right">
                            {dashboardMetric[item.value]?.pendingAmount ?? 0}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Grand Total
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        {dashboardMetric["total"].takhmeenAmount}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        {dashboardMetric["total"].zabihat
                          ? `${dashboardMetric["total"].zabihat} x ${ZABIHAT_UNIT}`
                          : 0}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        {dashboardMetric["total"].iftaari}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        {dashboardMetric["total"].chairs
                          ? `${dashboardMetric["total"].chairs} x ${CHAIRS_UNIT}`
                          : 0}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        {dashboardMetric["total"].grandTotal}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        {dashboardMetric["total"].pendingAmount}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        # of Forms
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        # of Mumineen
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        # of Males
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        # of Females
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        # of Children
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {MARKAZ_CONST.map((item) => {
                      return (
                        <TableRow key={item.value}>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            {item.displayVal}
                          </TableCell>
                          <TableCell align="right">
                            {dashboardMetric[item.value]?.forms ?? 0}
                          </TableCell>
                          <TableCell align="right">
                            {dashboardMetric[item.value]?.totalMembers ?? 0}
                          </TableCell>
                          <TableCell align="right">
                            {dashboardMetric[item.value]?.males ?? 0}
                          </TableCell>
                          <TableCell align="right">
                            {dashboardMetric[item.value]?.females ?? 0}
                          </TableCell>
                          <TableCell align="right">
                            {dashboardMetric[item.value]?.children ?? 0}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow key={"tptal"}>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        {"Grand Total"}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        {dashboardMetric.total.forms}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        {dashboardMetric.total.totalMembers}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        {dashboardMetric.total.males}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        {dashboardMetric.total.females}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        {dashboardMetric.total.children}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      ) : null}
    </>
  );
};

export default Dashboard;
