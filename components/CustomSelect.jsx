'use client'

import { useState } from "react";
import AsyncSelect from "react-select/async";

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
      className="focus:outline-none ring-2 ring-gray-300 ring-opacity-50 focus:ring-2 focus:ring-gray-300 focus:ring-opacity-80 rounded-sm text-sm bg-[#189FB8]/30 text-gray-700"
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