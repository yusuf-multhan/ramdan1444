const XLSX = require("sheetjs-style");
const dotenv = require("dotenv");
const TakhmeenForm = require("./models/takhmeenFormModel");
dotenv.config({ path: "./config/config.env" });

const connectDB = require("./config/db");
connectDB().then(async () => {
  console.log("DB connected successfully!!!!");
  const data = await TakhmeenForm.find({ markaz: "ZM" });
  const wb = XLSX.utils.book_new();
  const finalArr = [];
  data.map((item) => {
    const fm = item.familyMembers;
    const fm2Book = fm?.map((member) => {
      return {
        "Form No": item.formNo,
        "HOF ID": item.HOFId,
        "ITS ID": member.its,
        Name: member.name,
        Gender: member.gender,
        Age: member.age,
      };
    });
    Array.prototype.push.apply(finalArr, fm2Book);
  });
  const ws = XLSX.utils.json_to_sheet(finalArr);
  XLSX.utils.book_append_sheet(wb, ws, "ZM");

  XLSX.writeFile(wb, "ZM.xlsx");
});
