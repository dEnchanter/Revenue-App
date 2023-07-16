import { forwardRef, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import InputMask from "react-input-mask";
import AsyncSelect from "react-select/async";
import { formatDate } from "../util/common";
import { Button, IconButton } from "./Button";
import { DatePickerIcon } from "./Icons";
import { Switch } from '@headlessui/react'

export function TextInput({
  width = "w-full",
  padding = "px-2 py-2 ",
  bg = "bg-gray-50",
  color = "text-gray-700",
  height = "h-auto",
  margin = "",
  register,
  innerRef,
  ...rest
}) {
  return (
    <input
      className={`${width} ${padding} ${margin} ${bg} ${color} ${height} focus:outline-none appearance-none ring-1 ring-gray-300 ring-opacity-50 focus:ring-1 rounded text-sm`}
      type="text"
      ref={innerRef || register} // InnerRef will eventually replace register
      {...rest}
    />
  );
}

export function Select({
  width = "w-full",
  padding = "px-2 py-2 ",
  bg = "bg-[#189FB8]/30",
  color = "text-gray-700",
  height = "h-auto",
  margin = "",
  register,
  children,
  ...rest
}) {
  return (
    <select
      className={`${width} ${padding} ${margin} ${bg} ${color} ${height} focus:outline-none ring-1 ring-gray-300 ring-opacity-50 focus:ring-1 rounded text-sm`}
      ref={register}
      {...rest}
    >
      {children}
    </select>
  );
}

export function Label({
  children,
  font = "text-sm",
  margin = "mb-1",
  className,
  required,
  ...rest
}) {
  return (
    <label
      className={`${font} text-gray-700 block ${margin} opacity-80`}
      {...rest}
    >
      <span>{children}</span>
      {required && (
        <span className="italic text-gray-500 text-sm ml-2">(Required)</span>
      )}
    </label>
  );
}

// function TextInputGroup({ label, name, children, ...rest }) {
//   return (
//     <div className="">
//       <label htmlFor={name}>{label}</label>
//       <Input name={name} />
//     </div>
//   );
// }

export function FieldError({ children }) {
  return (
    <small className="text-yellow-600 opacity-80 italic">{children}</small>
  );
}

// export const IndeterminateCheckbox = forwardRef(
//   ({ indeterminate, toggleAllPageRowsSelected, onChange, ...rest }, ref) => {
//     const defaultRef = useRef();
//     const resolvedRef = ref || defaultRef;

//     function onChangeHandler(e) {
//       toggleAllPageRowsSelected(false);
//       onChange(e);
//     }

//     useEffect(() => {
//       resolvedRef.current.indeterminate = indeterminate;
//     }, [resolvedRef, indeterminate]);

//     return (
//       <>
//         <input
//           type="checkbox"
//           onChange={onChangeHandler}
//           ref={resolvedRef}
//           {...rest}
//         />
//       </>
//     );
//   }
// );

export function CustomSelect({
  onChange,
  placeholder = "Select",
  getLabel,
  getValue,
  defaultInputValue,
  defaultValue,
  fetchAsyncOptions,
  filterPredicate,
  onLoadError,
}) {
  const [options, setOptions] = useState(null);

  const customStyles = {
    control: (provided, state) => {
      // console.log(state);
      return {
        ...provided,
        minHeight: false,
        borderColor: false,
        borderStyle: false,
        borderWidth: false,
        borderRadius: false,
        backgroundColor: false,
        boxShadow: false,
      };
    },
  };

  async function loadOptions(input) {
    let _options;
    // cache is new or empty
    if (!options || options.length < 1) {
      try {
        _options = await fetchAsyncOptions();
        // cache
        setOptions(_options || []);
      } catch (error) {
        console.error(error);
        onLoadError && onLoadError(error);
        return;
      }
    } else {
      _options = options;
    }
    // filter and map
    return _options.reduce((acc, opt) => {
      if (filterPredicate(input, opt)) {
        acc.push({ value: getValue(opt), label: getLabel(opt) });
      }
      return acc;
    }, []);
  }

  return (
    <AsyncSelect
      styles={customStyles}
      className="focus:outline-none ring-2 ring-gray-200 ring-opacity-50 focus:ring-2 focus:ring-gray-300 focus:ring-opacity-80 rounded-sm text-sm bg-gray-50 text-gray-700"
      classNamePrefix="react-select"
      placeholder={placeholder}
      defaultValue={defaultValue}
      defaultOptions
      defaultInputValue={defaultInputValue}
      loadOptions={loadOptions}
      onChange={(data) => onChange(data.value)}
    />
  );
}

function DateInput({
  width = "w-full",
  padding = "px-2 py-1 ",
  bg = "bg-gray-50",
  color = "text-gray-700",
  margin = "",
  grouped,
  groupedPadding = "p-0",
  groupedBg = "",
  ...rest
}) {
  return (
    <TextInput
      readOnly
      className={`${width} ${margin} ${bg} ${color} p-0 text-sm focus:outline-none appearance-none `}
      {...rest}
    />
  );
}

export function DateRange({ register, required, initDate, onSelect }) {
  const [startDate, setStartDate] = useState(initDate);
  const [endDate, setEndDate] = useState(initDate);

  function onChange(dates) {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    onSelect && onSelect({ startDate: start, endDate: end });
  }

  const Picker = forwardRef(({ value, onClick }, ref) => (
    <IconButton
      bg="bg-none"
      font="text-purple-600"
      onClick={onClick}
      innerRef={ref}
      icon={DatePickerIcon}
      padding="p-0"
    />
  ));

  Picker.displayName = "Picker";

  return (
    <div className="flex justify-between items-center border border-gray-300 rounded px-2 py-1 h-12">
      <div className="w-24">
        <Label font="text-xs" margin="m-0">
          From
        </Label>
        <DateInput
          name="startDate"
          innerRef={register && register({ required: required })}
          value={formatDate(startDate) || ""}
        />
      </div>
      <div className="w-24">
        <Label font="text-xs" margin="m-0">
          To
        </Label>
        <DateInput
          name="endDate"
          innerRef={register && register({ required: required })}
          value={formatDate(endDate) || ""}
        />
      </div>
      <div className="self-end">
        <DatePicker
          selected={startDate}
          startDate={startDate}
          endDate={endDate}
          customInput={<Picker />}
          onChange={onChange}
          selectsRange
        />
      </div>
    </div>
  );
}

export function DatePickerInput({ onChange, register, initDate = new Date() }) {
  const [date, setDate] = useState(initDate);

  useEffect(() => {
    onChange && onChange(date);
  }, [date, onChange]);

  function handleOnChange(date) {
    setDate(date);
  }

  const Picker = forwardRef(({ value, onClick }, ref) => (
    <IconButton
      bg="bg-none"
      font="text-black"
      onClick={onClick}
      innerRef={ref}
      icon={DatePickerIcon}
      padding="p-0"
    />
  ));

  Picker.displayName = "Picker";
  
  return (
    <div className="flex justify-between items-center border border-gray-300 rounded px-2 py-1 h-12">
      <div className="mt-1">
        <DatePicker
          selected={date}
          startDate={date}
          customInput={<Picker />}
          onChange={handleOnChange}
        />
      </div>
      <div className="w-24 self-center">
        <DateInput
          name="date"
          innerRef={register && register({ required: required })}
          value={formatDate(date) || ""}
        />
      </div>
    </div>
  );
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function SwitchBtn(
  register,
  ...rest
) {
  const [enabled, setEnabled] = useState(false)

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={classNames(
        enabled ? 'bg-indigo-600' : 'bg-gray-200',
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
      )}
      //ref={register}
      {...rest} 
    >
      <span className="sr-only">Use setting</span>
      <span
        className={classNames(
          enabled ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
        )}
      >
        <span
          className={classNames(
            enabled ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200',
            'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
          )}
          aria-hidden="true"
        >
          <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
            <path
              d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span
          className={classNames(
            enabled ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100',
            'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
          )}
          aria-hidden="true"
        >
          <svg className="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 12 12">
            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
          </svg>
        </span>
      </span>
    </Switch>
  )
}
