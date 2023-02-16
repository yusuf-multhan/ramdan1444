import dayjs from "dayjs";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { RECEIPT_ADD_HEADER } from "../../constants";
import {
  calculateTakhmeenDetails,
  TakhmeenSummary,
  useCustomHook,
} from "../common-components";
import Header from "../Header";
import { formService } from "../../services/formService";
import { receiptService } from "../../services/receiptService";
import { useNavigate } from "react-router-dom";

const Receipt = (props) => {
  const { startLoading, endLoading, addToastMsg } = useCustomHook();
  const navigate = useNavigate();
  const takhmeenDetailsInitVal = {
    takhmeenAmount: 0,
    zabihat: 0,
    iftaari: 0,
    niyaaz: 0,
    chairs: 0,
    paidAmount: 0,
    pendingAmount: 0,
    grandTotal: 0,
    formNo: "",
    HOFName: "",
  };
  const [paymentDate, setPaymentData] = useState(
    dayjs(new Date().toISOString().substring(0, 19))
  );
  const handleDateChange = (newValue) => {
    setPaymentData(newValue);
  };

  const [takhmeenDetails, setTakhmeenDetails] = useState(
    takhmeenDetailsInitVal
  );
  const initialValues = {
    formNo: "",
    HOFId: "",
    date: "",
    amount: null,
    mode: "cash",
    details: "",
  };
  const {
    register,
    handleSubmit: submitIt,
    reset,
    setValue,
    watch,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: initialValues,
  });
  watch("HOFId", "formNo");
  const { HOFId, mode, formNo } = getValues();
  const handleSubmit = async () => {
    const vals = getValues();
    startLoading();
    try {
      const { data, isOK } = await receiptService.addToReceipts({
        ...vals,
        date: paymentDate,
        formNo: takhmeenDetails.formNo,
        HOFName: takhmeenDetails.HOFName,
        markaz: takhmeenDetails.markaz,
        total: takhmeenDetails.grandTotal,
      });
      if (isOK) {
        addToastMsg("Receipt saved : " + data.receiptNo, "success");
        reset();
        navigate("/");
      } else {
        throw new Error("Internal server error");
      }
    } catch (e) {
      console.error("error saving form", e);
      addToastMsg(
        "Unable to save details, please re validate entered values",
        "error"
      );
    }
    endLoading();
  };

  // I know its dirty, but got no other way to re render when delete member
  const [render, reRender] = useState(false);

  const getFormData = async (e) => {
    if (!e.target.value) return;
    startLoading();
    try {
      const { data } = await formService.getFormbyFormNo(e.target.value);
      if (!data.formNo) {
        addToastMsg(
          "Data not registered, please fill registration form first",
          "error"
        );
      } else {
        setValue("HOFId", data.HOFId);
        setTakhmeenDetails({
          ...calculateTakhmeenDetails(data),
          formNo: data.formNo,
          HOFName: data.HOFName,
          markaz: data.markaz,
        });
      }
    } catch (e) {
      console.error("error getting form details", e);
      addToastMsg("Unable to fetch form details", "error");
      reset({ ...initialValues });
      setTakhmeenDetails(takhmeenDetailsInitVal);
    }
    endLoading();
  };

  return (
    <>
      <Header header={RECEIPT_ADD_HEADER} />
      <Paper>
        <div className="p-3">
          <form onSubmit={submitIt(handleSubmit)}>
            <Grid
              container
              spacing={3}
              direction={"row"}
              alignContent={"center"}
            >
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  id="formNo"
                  name="formNo"
                  label="Form No"
                  type="text"
                  value={formNo}
                  onChange={(e) => {
                    setValue("formNo", e.currentTarget?.value ?? "");
                    reRender(!render);
                  }}
                  onBlur={(e) => {
                    getFormData(e);
                  }}
                  error={errors.formNo ? true : false}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  id="HOFId"
                  name="HOFId"
                  label="HOF Id"
                  type="text"
                  value={HOFId}
                  disabled
                />
              </Grid>
              <Grid item xs={6} />
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  id="HOFName"
                  name="HOFName"
                  label="HOF Name"
                  type="text"
                  value={takhmeenDetails.HOFName}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <FormLabel>Takhmeen summary</FormLabel>
                {TakhmeenSummary({
                  takhmeenDetails,
                })}
              </Grid>
              <Grid item xs={6}>
                <FormLabel>Total payments till date</FormLabel>
                <TextField
                  disabled
                  fullWidth
                  size="small"
                  id="paidAmount"
                  name="paidAmount"
                  type="number"
                  value={takhmeenDetails.paidAmount}
                />
              </Grid>
              <Grid item xs={6}>
                <FormLabel>Total pending amount</FormLabel>
                <TextField
                  disabled
                  fullWidth
                  size="small"
                  id="pendingAmount"
                  name="pendingAmount"
                  type="number"
                  value={takhmeenDetails.pendingAmount}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  id="amount"
                  name="amount"
                  label="Payment amount"
                  type="number"
                  {...register("amount")}
                />
              </Grid>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="Date desktop"
                    inputFormat="MM/DD/YYYY"
                    value={paymentDate}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField {...params} size="small" fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <FormLabel>Mode</FormLabel>
                  <RadioGroup
                    size="small"
                    name="paymentMode"
                    value={mode}
                    onChange={(e) => {
                      setValue("mode", e.target.value);
                      reRender(!render);
                    }}
                    row
                  >
                    <FormControlLabel
                      key="cash"
                      value="cash"
                      control={<Radio size="small" />}
                      label="Cash"
                    />
                    <FormControlLabel
                      key="cheque"
                      value="cheque"
                      control={<Radio size="small" />}
                      label="Cheque"
                    />
                    <FormControlLabel
                      key="online"
                      value="online"
                      control={<Radio size="small" />}
                      label="Online"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  id="details"
                  name="details"
                  label="Payment details"
                  type="textarea"
                  {...register("details")}
                />
              </Grid>
              <Grid
                className="d-flex"
                item
                xs={12}
                alignSelf="center"
                justifyContent={"center"}
              >
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  style={{
                    backgroundColor: "green",
                    margin: "5px",
                  }}
                >
                  {props.isEdit ? "Update" : "Submit"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Paper>
    </>
  );
};

export default Receipt;
