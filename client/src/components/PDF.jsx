import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { MARKAZ_CONST, RECEIPT_HEADER } from "../constants";

// Register font
import robotoBold from "../Fonts/Roboto/Roboto-Bold.ttf";
import robotoItalic from "../Fonts/Roboto/Roboto-Italic.ttf";
Font.register({
  family: "Roboto-Bold",
  src: robotoBold,
});
Font.register({
  family: "Roboto-Italic",
  src: robotoItalic,
});

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    fontSize: 12,
  },
  sectionWrapper: {
    margin: 10,
    padding: 10,
    border: "1px solid black",
  },
  section: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    paddingLeft: "10px",
    paddingBottom: "5px",
    width: 55,
  },
  passHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: "10px",
    fontSize: 14,
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  textWrapper: {
    display: "flex",
    flexDirection: "row",
    paddingBottom: "5px",
  },
  textLabel: {
    width: "35%",
  },
  textValue: {
    width: "65%",
  },
  textHead: {
    textDecoration: "underline",
    fontWeight: 700,
  },
  passWrapper: {
    margin: "10 auto",
    border: "3px solid black",
    width: "50%",
  },
  passHead: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C4D5A7",
  },
  headerTextWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flexGrow: 1,
  },
  headTextCommon: {
    alignSelf: "center",
    color: "#3c4136",
    fontFamily: "Roboto-Bold",
    fontSize: "12px",
  },
  headText: {
    fontSize: "14px",
    letterSpacing: "1px",
  },
});

// Create Document Component
const Passes = ({ familyMembers = [], HOFITS, formNo, markaz }) => (
  <Document width={"100%"}>
    <Page size="A4" style={styles.page}>
      {familyMembers.map((fm, i) => {
        return (
          <View key={fm.its} style={styles.passWrapper} break={i !== 0}>
            <View style={styles.passHead}>
              <Image src={"/logo.png"} style={styles.logo} />
              <View style={styles.headerTextWrapper}>
                <Text style={{ ...styles.headTextCommon, ...styles.headText }}>
                  Anjuman-E-Fakhri Pune
                </Text>
                <Text style={styles.headTextCommon}>{`${
                  MARKAZ_CONST.find((i) => i.value === markaz)?.displayVal
                } Shehrulla1444`}</Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "5px",
              }}
            >
              <Text
                style={{
                  alignSelf: "flex-end",
                  paddingRight: "15px",
                  fontSize: "10px",
                  fontFamily: "Roboto-Bold",
                }}
              >{`Card # : ${formNo}/${i + 1}`}</Text>
              <View
                style={{
                  fontFamily: "Roboto-Bold",
                  fontSize: "13px",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ width: "20%" }}>ITS ID</Text>
                <Text style={{ marginRight: "10px" }}>:</Text>
                <Text
                  style={{
                    border: "2px solid black",
                    padding: "3px 5px",
                  }}
                >
                  {fm.its}
                </Text>
              </View>
              <View
                style={{
                  paddingTop: "3px",
                  fontSize: "12px",
                  flexDirection: "row",
                }}
              >
                <Text style={{ width: "20%" }}>Name</Text>
                <Text style={{ marginRight: "10px" }}>:</Text>
                <Text>{fm.name}</Text>
              </View>
              <View
                style={{
                  paddingTop: "3px",
                  fontSize: "12px",
                  flexDirection: "row",
                }}
              >
                <Text style={{ width: "20%" }}>Gender</Text>
                <Text style={{ marginRight: "10px" }}>:</Text>
                <Text>{fm.gender}</Text>
              </View>
              <View
                style={{
                  paddingTop: "3px",
                  fontSize: "12px",
                  flexDirection: "row",
                }}
              >
                <Text style={{ width: "20%" }}>Age</Text>
                <Text style={{ marginRight: "10px" }}>:</Text>
                <Text>{fm.age}</Text>
              </View>
              <Text
                style={{
                  marginTop: "15px",
                  fontFamily: "Roboto-Italic",
                  fontSize: "8px",
                }}
              >
                Note: Non-Transferable, Please carry this card everyday
              </Text>
            </View>
          </View>
        );
      })}
    </Page>
  </Document>
);

const ReceiptsPDF = ({ receipt, HOFITS, HOFName, formNo }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.sectionWrapper}>
        <View style={styles.passHeader}>
          <Text>{RECEIPT_HEADER}</Text>
        </View>
        <View style={styles.section} key={receipt.receiptNo}>
          <Image src={"/logo.png"} style={styles.logo} />
          <View style={styles.wrapper}>
            <View style={styles.textWrapper}>
              <Text style={styles.textLabel}>Receipt No</Text>
              <Text style={{ ...styles.textValue, ...styles.textHead }}>
                {receipt.receiptNo}
              </Text>
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.textLabel}>Form number</Text>
              <Text style={styles.textValue}>{formNo}</Text>
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.textLabel}>HOF ITS</Text>
              <Text style={styles.textValue}>{HOFITS}</Text>
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.textLabel}>HOF Name</Text>
              <Text style={styles.textValue}>{HOFName}</Text>
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.textLabel}>Amount</Text>
              <Text style={styles.textValue}>{receipt.amount}</Text>
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.textLabel}>Mode</Text>
              <Text style={styles.textValue}>{receipt.mode}</Text>
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.textLabel}>Payment date</Text>
              <Text style={styles.textValue}>{receipt.date}</Text>
            </View>
            {receipt.details ? (
              <View style={styles.textWrapper}>
                <Text style={styles.textLabel}>Payment remarks</Text>
                <Text style={styles.textValue}>{receipt.details}</Text>
              </View>
            ) : (
              ""
            )}
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export { Passes, ReceiptsPDF };
