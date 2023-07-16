import { Loading } from './Icons';
import { Modal } from './Modal';

const presets = {
  color: {
    brandLemon: "bg-lemon-500 hover:bg-lemon-600 focus:ring-lemon-400",
    brandOrange: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
    brandPurple:
      "bg-purple-700 border-purple-700 hover:bg-purple-800 focus:ring-purple-400",
    brandBlue: {
      normal: "text-white bg-[#189FB8] border border-[#189FB8] active:text-gray-100 active:border-[#189FB8] active:bg-[#189FB8]",
    },
    cancel:
      "bg-gray-200 hover:bg-gray-300 focus:ring-gray-400 hover:bg-opacity-80",
  },
  hollowColor: {
    brandLemon: {
      normal: "text-lemon-500 ",
      hover: "focus:ring-lemon-400 hover:text-lemon-600",
    },
    brandOrange: {
      text: "text-yellow-600 hover:text-yellow-700",
      border: "focus:ring-yellow-500",
    },
    brandPurple: {
      normal: "text-purple-500 border border-purple-400",
      hover:
        "hover:text-gray-50 hover:border-purple-700 hover:bg-purple-700 active:text-gray-100 active:border-purple-800 active:bg-purple-800",
    },
    brandBlue: {
      normal: "text-purple-500 border border-[#189FB8]",
      hover:
        "hover:text-gray-50 hover:border-[#189FB8] hover:bg-[#189FB8] active:text-gray-100 active:border-[#189FB8] active:bg-[#189FB8]",
    },
    cancel: {
      text: "text-gray-200 hover:text-gray-300 hover:text-opacity-80",
      border: "focus:ring-gray-400",
    },
  },
};

export function Button({
  children,
  type = "button",
  icon,
  iconSize = "w-5",
  loading,
  padding = "px-4 py-2",
  width = "",
  margin = "",
  bg = "",
  font = "text-gray-50 text-sm",
  iconMargin = "mr-2",
  loadingMargin = "ml-2",
  disabled,
  border = "border focus:ring-opacity-80 focus:ring-1 rounded",
  className,
  onClick,
  innerRef,
  ...rest
}) {
  let Icon = icon;
  let _bg = bg;
  let disabledClass = disabled ? " cursor-not-allowed" : "";
  let _className =
    className ||
    `focus:outline-none ${font} ${_bg} ${border} ${padding} ${margin} ${width} ${disabledClass}`;

  function _onClick(event) {
    if (loading) {
      event.preventDefault();
    } else {
      onClick && onClick(event);
    }
  }

  return (
    <button
      ref={innerRef}
      type={type}
      className={_className + disabledClass}
      disabled={disabled}
      onClick={_onClick}
      {...rest}
    >
      <div className="flex items-center justify-center">
        {icon && (
          <span className={`${iconMargin} inline-block leading-3}`}>
            <Icon h={iconSize} />
          </span>
        )}
        {children}
        {loading && !disabled && (
          <span className={`${loadingMargin} inline-block leading-3}`}>
            <Loading h={iconSize} />
          </span>
        )}
      </div>
    </button>
  );
}

export function IconButton({
  round,
  border = "focus:ring-2",
  padding = "p-1",
  icon,
  loading,
  innerRef,
  children,
  ...rest
}) {
  let Icon = icon;
  let roundClass = round ? "rounded-full" : "";
  return (
    <Button
      border={`${roundClass}`}
      padding={padding}
      {...rest}
      innerRef={innerRef}
    >
      {Icon && <Icon />}
    </Button>
  );
}

export function HollowButton({
  children,
  type = "button",
  icon,
  iconSize = "w-5",
  loading,
  textSize = "text-sm seno-bold",
  padding = "px-4 py-2",
  width = "",
  margin = "",
  iconMargin = "mr-2",
  loadingMargin = "ml-2",
  disabled,
  look = "brandBlue",
  height = "h-auto",
  className,
  onClick,
  ...rest
}) {
  let Icon = icon;
  let disabledClass = disabled ? " cursor-not-allowed" : "";
  let preset = presets.color[look];

  function _onClick(event) {
    if (loading) {
      event.preventDefault();
    } else {
      onClick && onClick(event);
    }
  }

  return (
    <button
      type={type}
      className={`focus:outline-none tracking-wide rounded ${preset.normal} ${
        disabled ? "cursor-not-allowed" : preset.hover
      } ${padding}  ${textSize} ${width} ${height}`}
      disabled={disabled}
      onClick={_onClick}
      {...rest}
    >
      <div className="flex items-center justify-center">
        {icon && (
          <span className={`${iconMargin} inline-block leading-3}`}>
            <Icon h={iconSize} />
          </span>
        )}
        {children}
        {loading && !disabled && (
          <span className={`${loadingMargin} inline-block leading-3}`}>
            <Loading h={iconSize} />
          </span>
        )}
      </div>
    </button>
  );
}

export function ConfirmButton({
  children,
  title = "Confirm?",
  message = "Do you want to proceed?",
  acceptLabel = "Yes",
  rejectLabel = "No",
  onClick,
  ...rest
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [clickEvent, setClickEvent] = useState(null);

  function _onClick(ev) {
    ev.preventDefault();
    setClickEvent(ev);
    setShowConfirm(true);
  }

  function accept() {
    onClick(clickEvent);
    setClickEvent(null);
    setShowConfirm(false);
  }

  function reject() {
    setClickEvent(null);
    setShowConfirm(false);
  }

  return (
    <>
      <Button onClick={_onClick} {...rest}>
        {children}
      </Button>
      <Modal show={showConfirm} title={title} width="w-96">
        <div>
          <p>{message}</p>
          <div className="flex justify-end mt-4">
            <Button
              onClick={accept}
              padding="py-1 px-4"
              margin="mr-2"
              look="brandOrange"
            >
              {acceptLabel}
            </Button>
            <Button onClick={reject} padding="py-1 px-4">
              {rejectLabel}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}