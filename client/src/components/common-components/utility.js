import ReactPDF from "@react-pdf/renderer";
import {
  CHAIRS_UNIT,
  GrandTotal,
  MARKAZ_CONST,
  PAYMENT_MODE_CONST,
  ZABIHAT_UNIT,
} from "../../constants";
import { Passes, ReceiptsPDF } from "../PDF";

export const getGrandTotal = (takhmeenDetails) => {
  return (
    Number(takhmeenDetails.takhmeenAmount) +
    Number(takhmeenDetails.zabihat * ZABIHAT_UNIT) +
    Number(takhmeenDetails.iftaari) +
    Number(takhmeenDetails.chairs) * CHAIRS_UNIT
  );
};

export const calculateTakhmeenDetails = (td) => {
  const grandTotal = getGrandTotal(td);
  return {
    takhmeenAmount: td.takhmeenAmount,
    zabihat: td.zabihat,
    iftaari: td.iftaari,
    chairs: td.chairs,
    paidAmount: td.paidAmount,
    pendingAmount: grandTotal - td.paidAmount,
    grandTotal,
  };
};

const getReceiptDetails = (item) => {
  return {
    receiptNo: item.receiptNo,
    date: new Date(item.date).toDateString(),
    amount: item.amount,
    mode: PAYMENT_MODE_CONST[item.mode] ?? item.mode,
    details: item.details,
  };
};

// Todo: Refactor method name
export const sortReceiptsByHOF = (receipts = []) => {
  return Object.values(
    receipts.reduce((acc, item) => {
      if (acc[item.formNo]?.formNo) {
        acc[item.formNo].subReceipts.push(getReceiptDetails(item));
      } else {
        acc[item.formNo] = {
          HOFId: item.HOFId,
          HOFName: item.HOFName,
          formNo: item.formNo,
          markaz:
            MARKAZ_CONST.find((i) => i.value === item.markaz)?.displayVal ??
            "Markaz Unavailable",
          subReceipts: [getReceiptDetails(item)],
          total: item.total,
        };
      }
      return acc;
    }, {})
  );
};

const downloadPDF = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob);
  let aTag = document.createElement("a");
  aTag.href = url;
  aTag.setAttribute("target", "_blank");
  aTag.style = "display: none";
  // aTag.download = fileName;
  document.body.appendChild(aTag);
  aTag.click();
  return;
};

export const downLoadPasses = async (row) => {
  const blob = await ReactPDF.pdf(
    <Passes
      familyMembers={row.familyMembers}
      HOFITS={row.HOFId}
      formNo={row.formNo}
      markaz={row.markaz}
    />
  ).toBlob();
  downloadPDF(blob, `${row.formNo}`);
};

export const downloadReceipts = async (props) => {
  const { receipt, row } = props;
  const blob = await ReactPDF.pdf(
    <ReceiptsPDF
      receipt={receipt}
      HOFITS={row.HOFId}
      HOFName={row.HOFName}
      formNo={row.formNo}
      markaz={row.markaz}
      total={row.total}
    />
  ).toBlob();
  downloadPDF(blob, `${receipt.receiptNo}`);
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

export const filterRows = (rows = [], filters) => {
  let filteredRows = rows.filter((i) => {
    return filters.selectedMarkaz[i.markaz];
  });
  if (filters.sort.orderBy) {
    filteredRows = stableSort(
      filteredRows,
      getComparator(filters.sort.order, filters.sort.orderBy)
    );
  }
  if (filters.searchedVal.trim()) {
    filteredRows = filteredRows.filter((row) => {
      return (
        row.formNo.toLowerCase().includes(filters.searchedVal.toLowerCase()) ||
        row.HOFId.toLowerCase().includes(filters.searchedVal.toLowerCase()) ||
        row.HOFName.toLowerCase().includes(filters.searchedVal.toLowerCase()) ||
        row.markaz.toLowerCase().includes(filters.searchedVal.toLowerCase())
      );
    });
  }
  return filteredRows;
};

const getCountByGender = (fms = [], gender) => {
  return fms.filter((i) => i.gender?.toLowerCase() === gender).length;
};

const getChildrenCount = (fms = []) => {
  return fms.filter((i) => i.age < 5).length;
};

export const getDashboardMetric = (forms = []) => {
  return forms.reduce(
    (acc, item) => {
      const grandTotal = getGrandTotal(item);
      acc.total.takhmeenAmount += Number(item.takhmeenAmount);
      acc.total.zabihat += Number(item.zabihat);
      acc.total.iftaari += Number(item.iftaari);
      acc.total.chairs += Number(item.chairs);
      acc.total.grandTotal += grandTotal;
      acc.total.paidAmount += Number(item.paidAmount);
      acc.total.pendingAmount += grandTotal - Number(item.paidAmount);
      acc.total.forms += 1;
      acc.total.totalMembers += item.familyMembers.length;
      acc.total.males += getCountByGender(item.familyMembers, "male");
      acc.total.females += getCountByGender(item.familyMembers, "female");
      acc.total.children += getChildrenCount(item.familyMembers);
      if (acc[item.markaz]) {
        acc[item.markaz].takhmeenAmount += Number(item.takhmeenAmount);
        acc[item.markaz].zabihat += Number(item.zabihat);
        acc[item.markaz].iftaari += Number(item.iftaari);
        acc[item.markaz].chairs += Number(item.chairs);
        acc[item.markaz].grandTotal += grandTotal;
        acc[item.markaz].paidAmount += Number(item.paidAmount);
        acc[item.markaz].pendingAmount += grandTotal - Number(item.paidAmount);
        acc[item.markaz].forms += 1;
        acc[item.markaz].totalMembers += item.familyMembers.length;
        acc[item.markaz].males += getCountByGender(item.familyMembers, "male");
        acc[item.markaz].females += getCountByGender(
          item.familyMembers,
          "female"
        );
        acc[item.markaz].children += getChildrenCount(item.familyMembers);
      } else {
        acc[item.markaz] = {
          takhmeenAmount: Number(item.takhmeenAmount),
          zabihat: Number(item.zabihat),
          iftaari: Number(item.iftaari),
          chairs: Number(item.chairs),
          grandTotal: grandTotal,
          paidAmount: Number(item.paidAmount),
          pendingAmount: grandTotal - Number(item.paidAmount),
          forms: 1,
          totalMembers: item.familyMembers.length,
          males: getCountByGender(item.familyMembers, "male"),
          females: getCountByGender(item.familyMembers, "female"),
          children: getChildrenCount(item.familyMembers),
        };
      }
      return acc;
    },
    {
      total: {
        takhmeenAmount: 0,
        zabihat: 0,
        iftaari: 0,
        chairs: 0,
        grandTotal: 0,
        pendingAmount: 0,
        paidAmount: 0,
        forms: 0,
        totalMembers: 0,
        males: 0,
        females: 0,
        children: 0,
      },
    }
  );
};

const getMonthName = (month) => {
  switch (month) {
    case 0:
      return "Jan";
    case 1:
      return "Feb";
    case 2:
      return "Mar";
    case 3:
      return "Apr";
    case 4:
      return "May";
    case 5:
      return "Jun";
    case 6:
      return "Jul";
    case 7:
      return "Aug";
    case 8:
      return "Sep";
    case 9:
      return "Oct";
    case 10:
      return "Nov";
    case 11:
      return "Dec";
    default:
      return "Jan";
  }
};

const amountByMode = (
  mode,
  currA = { collection: 0, cash: 0, cheque: 0, online: 0 },
  newA = 0
) => {
  currA.collection += newA;
  switch (mode?.toLowerCase()) {
    case "cash":
      currA.cash += Number(newA);
      break;
    case "cheque":
      currA.cheque += Number(newA);
      break;
    case "online":
      currA.online += Number(newA);
      break;
    default:
      break;
  }
  return currA;
};
export const getReceiptMetric = (receipts = []) => {
  return receipts.reduce(
    (acc, receipt) => {
      const thisDate = new Date(receipt.date);
      const dateStr =
        thisDate.getDate() +
        "-" +
        getMonthName(thisDate.getMonth()) +
        "-" +
        thisDate.getFullYear();
      acc[GrandTotal] = {
        ...amountByMode(receipt.mode, acc[GrandTotal], receipt.amount),
      };
      if (acc[dateStr]) {
        acc[dateStr] = {
          ...amountByMode(receipt.mode, acc[dateStr], receipt.amount),
        };
      } else {
        acc[dateStr] = {
          ...amountByMode(receipt.mode, undefined, receipt.amount),
        };
      }
      return acc;
    },
    { [GrandTotal]: { collection: 0, cash: 0, cheque: 0, online: 0 } }
  );
};

export const radialChartConfig = (data) => {
  return {
    series: data.series,
    options: {
      chart: {
        height: data.height,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: "20%",
            background: "transparent",
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            },
          },
        },
      },
      title: {
        text: data.titleText,
        fontWeight: 700,
      },
      labels: data.labels,
      legend: {
        show: true,
        floating: true,
        fontSize: "14px",
        position: "left",
        offsetX: 120,
        offsetY: 30,
        labels: {
          useSeriesColors: true,
        },
        formatter: function (seriesName, opts) {
          return (
            seriesName + ":  " + opts.w.globals.series[opts.seriesIndex] + "%"
          );
        },
      },
    },
  };
};

export const barChartConfig = (data) => {
  return {
    series: data.series,
    options: {
      dataLabels: {
        enabled: false,
      },
      chart: {
        type: "bar",
        height: data.height,
        stacked: data.stacked,
        toolbar: {
          show: true,
          tools: {
            download: false,
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            position: "top",
            total: {
              enabled: true,
              offsetX: 0,
              style: {
                fontSize: "10px",
                fontWeight: 800,
              },
            },
          },
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      title: {
        text: data.titleText,
        fontWeight: 700,
      },
      xaxis: {
        categories: data.xaxisCategories,
        title: {
          text: data.yaxisTitle,
        },
      },
      yaxis: {},
      fill: {
        opacity: 1,
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40,
      },
    },
  };
};
