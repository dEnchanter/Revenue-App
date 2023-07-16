'use client'

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  HistoryIcon,
  Loading,
  Exclamation,
  ChevronLeftSmallIcon,
  ChevronRightSmallIcon,
} from "./Icons";
import { Button, IconButton } from "./Button";

const presets = {
  color: {
    brandLemon: "bg-lemon-500",
    brandOrange: "bg-yellow-500",
    brandPurple: "bg-purple-500",
  },
};

const lookPreset = {
  default: "bg-purple-700 text-purple-300",
  success: "bg-green-700 text-green-300",
  failed: "bg-red-700 text-red-300",
  pending: "bg-yellow-700 text-yellow-300",
};

export function TableWrapper({ children }) {
  return (
    <div className="p-4 bg-white shadow-sm border border-gray-200 rounded">
      {children}
    </div>
  );
}

export function Card({
  children,
  margin = "",
  padding = "p-5",
  width = "",
  border = "rounded",
  look = "brandPurple",
  bg = "bg-white",
  font = "text-gray-800",
  flex = "",
  className,
}) {
  let _bg = bg || presets.color[look];
  let _className =
    className ||
    `${flex} ${width} ${margin} ${padding} ${_bg} ${border} ${font}`;
  return <div className={_className}>{children}</div>;
}

export function InfoCard({
  amount,
  count,
  look,
  label,
  loading,
  icon = HistoryIcon,
}) {
  const loadingClass = loading ? "animate-pulse" : "";
  const _look = lookPreset[look] || lookPreset.default;

  const Icon = icon;

  let _amount = new Intl.NumberFormat("en-GB", {
    notation: "compact",
  }).format(amount || 0);

  return (
    <div
      className={`flex w-52 mx-3 rounded bg-white overflow-hidden ${loadingClass}`}
    >
      <div className={`${_look} opacity-80 p-2`}>
        <Icon h="w-10" />
      </div>
      <div className="flex-grow bg-white text-gray-700 opacity-80 pl-4 flex flex-col justify-center">
        {/* {loading ? (
          <div className="text-purple-700">
            <Loading />
          </div>
        ) : ( */}
        <p className="text-2xl font-semibold text-opacity-60 overflow-hidden">
          {_amount}
        </p>
        {/* )} */}
        <p className="text-gray-500 text-xs">{label}</p>
      </div>
    </div>
  );
}

export function Tag({ value, look = "brandLemon", color }) {
  let bgColor = presets.color[look];
  return (
    <div className="bg-white">
      <div
        className={`inline-block ${bgColor} opacity-85 text-gray-900 text-sm px-1 rounded`}
      >
        {value}
      </div>
    </div>
  );
}

export function NewThemePaginator({
  canPreviousPage,
  canNextPage,
  pageOptions,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  setPageSize,
  pageIndex,
  loading,
}) {
  return (
    <div className="flex items-center mt-5 sticky ml-5">
      <div className="text-sm text-gray-700 opacity-75 mr-4">{`${
        pageIndex + 1
      } of ${pageCount}`}</div>
      <div>
        <IconButton
          round
          icon={ChevronLeftSmallIcon}
          disabled={!canPreviousPage}
          margin="mr-4"
          font="text-sm text-gray-700"
          bg="opacity-90 bg-[#189FB8]/30 hover:bg-[#189FB8]/80"
          border="focus:ring-opacity-7 focus:outline-none focus:ring-2 rounded-sm focus:ring-[#189FB8]"
          onClick={() => previousPage()}
        >
          Prev
        </IconButton>
      </div>
      <div>
        <IconButton
          round
          icon={ChevronRightSmallIcon}
          disabled={!canNextPage}
          margin="mr-4"
          font="text-sm text-gray-700"
          bg="opacity-80 bg-[#189FB8]/30 hover:bg-[#189FB8]/80"
          border="focus:ring-opacity-7 focus:outline-none focus:ring-2 rounded-sm focus:ring-[#189FB8]"
          onClick={() => nextPage()}
        >
          Next
        </IconButton>
      </div>
      {/* <div>
        <select
          className="px-2 py-1 text-sm text-gray-700 focus:outline-none border opacity-80 w-28 mr-1"
          onChange={(ev) => {
            console.log(parseInt(ev.target.value));
            setPageSize(parseInt(ev.target.value));
          }}
        >
          <option value="1">show 1</option>
          <option value="10">show 10</option>
          <option value="20">show 20</option>
          <option value="50">show 50</option>
        </select>
      </div> */}
      {loading && (
        <div className="text-[#189FB8] ml-2">
          <Loading />
        </div>
      )}
    </div>
  );
}

export function Paginator({
  canPreviousPage,
  canNextPage,
  pageOptions,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  setPageSize,
  pageIndex,
  loading,
}) {
  let firstOrLastPageClass = "bg-purple-800 text-gray-50";
  let notFirstOrLastPageClass =
    "bg-purple-100 hover:bg-purple-200 text-gray-700";
  return (
    <div className="flex items-center mt-5 sticky ml-5">
      <div>
        <Button
          disabled={!canPreviousPage}
          className={`px-2 py-1 mr-4 text-sm opacity-80 focus:ring-opacity-7 focus:outline-none focus:ring-2 rounded-sm focus:ring-purple-200 ${
            canPreviousPage ? notFirstOrLastPageClass : firstOrLastPageClass
          }`}
          onClick={() => gotoPage(0)}
        >
          First
        </Button>
      </div>
      <div>
        <Button
          disabled={!canPreviousPage}
          padding="px-2 py-1"
          margin="mr-4"
          font="text-sm text-gray-700"
          bg="opacity-90 bg-purple-100 hover:bg-purple-200"
          border="focus:ring-opacity-7 focus:outline-none focus:ring-2 rounded-sm focus:ring-purple-200"
          onClick={() => previousPage()}
        >
          Prev
        </Button>
      </div>
      <div>
        <Button
          disabled={!canNextPage}
          padding="px-2 py-1"
          margin="mr-4"
          font="text-sm text-gray-700"
          bg="opacity-80 bg-purple-100 hover:bg-purple-200"
          border="focus:ring-opacity-7 focus:outline-none focus:ring-2 rounded-sm focus:ring-purple-200"
          onClick={() => nextPage()}
        >
          Next
        </Button>
      </div>
      <div>
        <Button
          disabled={!canNextPage}
          className={`px-2 py-1 mr-4 text-sm opacity-80 focus:ring-opacity-7 focus:outline-none focus:ring-2 rounded-sm focus:ring-purple-200 ${
            canNextPage ? notFirstOrLastPageClass : firstOrLastPageClass
          }`}
          onClick={() => gotoPage(pageCount - 1)}
        >
          Last
        </Button>
      </div>
      <div className="text-sm text-gray-700 opacity-75 mr-4">{`page ${
        pageIndex + 1
      } of ${pageCount}`}</div>
      <div>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            let page = ev.target.elements.page.value;
            page > 0 && gotoPage(ev.target.elements.page.value - 1);
          }}
        >
          <input
            className="px-2 py-1 text-sm text-gray-700 focus:outline-none border opacity-80 w-14 mr-1"
            placeholder="Page"
            type="text"
            name="page"
          />
          <Button
            type="submit"
            padding="px-2 py-1"
            margin="mr-4"
            font="text-sm text-gray-50"
            bg="opacity-85 bg-purple-700 hover:bg-purple-800"
            border="focus:ring-opacity-80 focus:outline-none focus:ring-2 rounded-sm focus:ring-purple-300"
          >
            Go
          </Button>
        </form>
      </div>
      <div>
        <select
          className="px-2 py-1 text-sm text-gray-700 focus:outline-none border opacity-80 w-28 mr-1"
          onChange={(ev) => {
            console.log(parseInt(ev.target.value));
            setPageSize(parseInt(ev.target.value));
          }}
        >
          <option value="1">show 1</option>
          <option value="10">show 10</option>
          <option value="20">show 20</option>
          <option value="50">show 50</option>
        </select>
      </div>
      {loading && (
        <div className="text-purple-600 ml-2">
          <Loading />
        </div>
      )}
    </div>
  );
}

export function MoreInfo({ logo, text, width = "w-32" }) {
  const Logo = logo || Exclamation;

  return (
    <div
      className={`inline-flex justify-start text-xs opacity-75 align-middle ${width}`}
    >
      <Logo h={"w-5"} />
      <span className="ml-2 flex-grow">{text}</span>
    </div>
  );
}

// export function ModalExample({ open, children, ...rest }) {
//   return open ? <NewModal>{children}</NewModal> : null;
// }

export function Modal() {
  const [open, setOpen] = useState(false);

  let openClass = open ? "" : "opacity-0 pointer-events-none";
  return (
    <>
      <div className="flex items-center justify-center h-64">
        <button
          onClick={() => setOpen(true)}
          className="modal-button bg-teal-200 p-3 rounded-lg text-teal-900 hover:bg-teal-300"
        >
          Blast off
        </button>
      </div>
      <div
        className={`modal ${openClass} absolute w-full h-full top-0 left-0 flex items-center justify-center`}
      >
        <div
          onClick={() => setOpen(false)}
          className="modal-overlay absolute w-full h-full bg-black opacity-25 top-0 left-0 cursor-pointer"
        ></div>
        <div className="absolute w-1/2 h-32 bg-white rounded-sm shadow-lg flex items-center justify-center text-2xl">
          🚀
        </div>
      </div>
    </>
  );
}

export function SummaryBox({
  title,
  leftLabel,
  rightLabel,
  value,
  leftValue,
  rightValue,
  leftRatio,
  rightRatio,
  single,
}) {
  return (
    <div className="w-64 bg-white border border-gray-200 shadow-sm rounded mb-7 flex flex-col items-center text-sm text-gray-700 px-2 py-4">
      <h1 className="text-gray-500 font-medium h-8 overflow-hidden">{title}</h1>
      {single ? (
        <div className="text-3xl font-bold py-5 h-28 overflow-hidden">
          {value}
        </div>
      ) : (
        <>
          <p className="font-bold text-xl leading-4 h-8 overflow-hidden">
            {value}
          </p>
          <div className="flex divide-x-2 w-full h-12 overflow-hidden">
            <div className="text-center w-1/2 text-sm">
              <h5 className="text-gray-400 pb-1">{leftLabel}</h5>
              <p className="font-medium">{leftValue}</p>
            </div>
            <div className="text-center w-1/2 text-sm">
              <h5 className="text-gray-400 pb-1">{rightLabel}</h5>
              <p className="font-medium">{rightValue}</p>
            </div>
          </div>
          <div className="w-full h-4 overflow-hidden">
            <span
              style={{ width: leftRatio }}
              className="h-1 bg-green-500 inline-block rounded border-r-4  border-gray-50"
            ></span>
            <span
              style={{ width: rightRatio }}
              className="h-1 bg-red-500 inline-block rounded"
            ></span>
          </div>
          <div className="flex justify-between w-full text-xs h-4 overflow-hidden">
            <div>{leftRatio}</div>
            <div>{rightRatio}</div>
          </div>
        </>
      )}
    </div>
  );
}

export function PairBox({
  title,
  leftLabel,
  rightLabel,
  value,
  leftValue,
  rightValue,
  single,
}) {
  return (
    <div className="w-64 bg-white border border-gray-200 shadow-sm rounded mb-7 flex flex-col items-center text-sm text-gray-700 px-2 py-4">
      <h1 className="text-gray-500 font-medium h-8 overflow-hidden">{title}</h1>
      {single ? (
        <div className="text-3xl font-bold py-5 h-28 overflow-hidden">
          {value}
        </div>
      ) : (
        <>
          <div className="flex text-center w-full h-20 overflow-hidden text-gray-600">
            <div className="w-full self-center">
              <span className="pr-2 font-bold text-lg">{leftValue}</span>
              <span className="text-xl text-gray-200 self-stretch">/</span>
              <span className="pl-2 font-bold text-lg">{rightValue}</span>
            </div>
          </div>
          <div className="h-8 text-center text-gray-600">
            <span className="font-semibol">{leftLabel}</span>
            <span className="text-gray-200 px-1">/</span>
            <span className="font-semibod">{rightLabel}</span>
          </div>
        </>
      )}
    </div>
  );
}
