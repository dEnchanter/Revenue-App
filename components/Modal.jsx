import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Button } from "./Button";

const widthPreset = {
  xl: "inset-x-40",
  lg: "inset-x-96",
  md: "inset-x-1/4 lg:inset-x-96",
};

export function useConfirmModal() {
  const [confirmControl, setConfirmControl] = useState({ show: false });

  function confirm(options) {
    setConfirmControl({
      ...options,
      show: true,
    });
  }

  function closeModal() {
    setConfirmControl({ show: false, loading: false });
  }

  function acceptHandler() {
    setConfirmControl({ ...confirmControl, loading: true });
    confirmControl?.onAccept && confirmControl.onAccept(closeModal);
  }

  function rejectHandler() {
    confirmControl?.onReject && confirmControl.onReject();
    setConfirmControl({ show: false });
  }

  return [
    { ...confirmControl, onAccept: acceptHandler, onReject: rejectHandler },
    confirm,
  ];
}

export function ConfirmModal({
  show,
  title = "Confirm?",
  message = "Do you want to proceed?",
  acceptLabel = "Yes",
  rejectLabel = "No",
  onAccept,
  onReject,
  loading,
  type = "default",
  ...rest
}) {
  const typeStyle = getConfirmModalStyle(type);
  return (
    <Modal show={show} width="lg" height="h-64">
      <div className="flex flex-col items-center mt-5">
        <h1 className={`text-2xl font-bold ${typeStyle.title}`}>{title}</h1>
        <div className="text-gray-500 text-center">{message}</div>
        <div className="pt-10">
          <Button
            margin="mr-4"
            border="border border-gray-300 hover:border-gray-500 rounded"
            bg="bg-none"
            font="text-gray-500 hover:text-gray-700 text-sm"
            width="w-32"
            onClick={onReject}
          >
            {rejectLabel}
          </Button>
          <Button
            loading={loading}
            bg="bg-none"
            border={`border ${typeStyle.acceptBorder} rounded`}
            font={`${typeStyle.acceptText} text-sm"`}
            width="w-36"
            onClick={onAccept}
          >
            {acceptLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function getConfirmModalStyle(type) {
  switch (type) {
    case "delete":
      return {
        title: "text-red-500",
        acceptBorder: "border-red-500 hover:border-red-600",
        acceptText: "text-red-500 hover:text-red-600",
      };
    default:
      return {
        title: "text-gray-500",
        acceptText: "text-purple-500 hover:text-purple-600",
        acceptBorder: "border-purple-500 hover:border-purple-800",
      };
  }
}

export function Modal({
  show,
  onClose,
  children,
  title,
  subTitle,
  width = "xl",
  height,
  top = "top-5",
  maxHeight = "max-h-104",
  rightComponent,
}) {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
  };

  let _width = widthPreset[width] || widthPreset.xl;
  let _height = height || maxHeight;

  const modalContent = show ? (
    <>
      <div
        className="fixed inset-0 items-center bg-gray-900 bg-opacity-50 z-30"
        onClick={onClose}
      ></div>
      <div className="relative z-30">
        {/* Make width configurable */}
        {/* <div className={`fixed top-2 ${_width} mx-auto`}> */}
        <div
          className={`bg-[#EBFBFE] fixed ${top} ${_width} mx-auto overflow-y-auto rounded text-gray-800 text-opacity-80`}
        >
          {(title || rightComponent) && (
            <div className="flex justify-between items-center border-b px-16 pt-10 pb-2">
              {title && (
                <div className="">
                  <h2 className="text-lg font-bold text-gray-600">{title}</h2>
                  <p className="text-sm text-gray-500">{subTitle}</p>
                </div>
              )}
              {rightComponent && <div>{rightComponent}</div>}
            </div>
          )}
          <div className="px-16 pt-8 pb-10">{children}</div>
          {/* </div> */}
        </div>
      </div>
    </>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")
    );
  } else {
    return null;
  }
}
