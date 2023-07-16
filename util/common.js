import { parse, parseISO } from "date-fns";
import { format } from "date-fns";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";

export function exportToExcel({ data, header, filename }) {
  let worksheet = utils.json_to_sheet(data, { header });
  let workbook = { Sheets: { "sheet 1": worksheet }, SheetNames: ["sheet 1"] };
  let buffer = write(workbook, { bookType: "csv", type: "array" });

  let blob = new Blob([buffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
  let finalFilename = `tms_${filename || "report"}_${format(
    new Date(),
    "dd_MM_yyyy_HH_mm_ss"
  )}.csv`;
  saveAs(blob, finalFilename);
}

export function formatNumber(number, options) {
  return new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 2,
    ...options,
  }).format(number);
}

export function calculatePercentage(part, total) {
  let percentFormat = new Intl.NumberFormat("en-NG", {
    style: "unit",
    unit: "percent",
    maximumFractionDigits: 2,
  });
  let safeTotal = 1;
  if (!!total) {
    safeTotal = total;
  }
  return percentFormat.format((part * 100) / safeTotal);
}

export function formatTimestamp(timestamp) {
  return format(parseISO(timestamp), "dd-MM-yyyy hh:mm a");
}

export function formatDate(date) {
  return date && format(date, "dd-MM-yyyy");
}

export function formatTime(time) {
  return format(parseISO(time), "hh:mm a");
}

export function reformateDate(oldFormat, newFormat, dateString) {
  return format(parse(dateString, oldFormat, new Date()), newFormat);
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function randomGenerator(length) {
  let generated = "";
  let bag = getBag();
  let size = bag.length;
  for (let i = 0; i < length; i++) {
    generated += Math.floor(Math.random() * size) + 0;
  }
  return generated;

  function getBag() {
    return [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
    ];
  }
}
