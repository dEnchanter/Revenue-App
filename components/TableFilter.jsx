import { useEffect, useReducer, useState } from "react";
import { formatDate } from "../util/common";
import { HollowButton, IconButton } from "./Button";
import { DatePickerInput, DateRange, Label, Select, TextInput } from "./Forms";
import { PlusIcon, DeleteIcon } from "./Icons";
import { SmartSelect } from "./SmartSelect";

export function TableFilter({ initialDate, searchKeys, onFilter, wardData }) {

  const [state, dispatch] = useReducer(filterReducer, {
    date: initialDate,
    activeParameter: { key: null, value: "" },
    parameters: {},
    wardData: wardData,
    searchKeys,
    remainingKeys: searchKeys,
    canFilter: false,
  });

  useEffect(() => {
    let firstKey = searchKeys[0];
    if (firstKey) {
      dispatch({ type: "active_param_update", payload: firstKey.name });
      dispatch({ type: "remaining_keys_update" });
    }
  }, []);

  useEffect(() => {
    if (state.canFilter) {
      handleOnFilter();
      dispatch({ type: "filter_end" });
    }
  }, [state.canFilter]);

  function handleOnFilter() {
    let filters = Object.keys(state.parameters).map((key) => ({
      id: key,
      value: state.parameters[key].value,
    }));
    filters.push({ id: "date", value: formatDate(state.date) });
    filters.push({ id: "wardId", value: state.wardId });

    console.log("filters", filters);
    onFilter(filters);
  }

  function handleDelete(name) {
    dispatch({ type: "parameters_remove", payload: name });
    dispatch({ type: "active_param_update", payload: name });
    dispatch({ type: "active_param_value_update", payload: "" });
    dispatch({ type: "remaining_keys_update" });
  }

  function handleClick({ name, value }) {
    dispatch({ type: "active_param_update", payload: name });
    dispatch({ type: "active_param_value_update", payload: value });
    dispatch({ type: "remaining_keys_update" });
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="w-44 h-30">
        <SmartSelect
          placeholder="Wards..."
          options={wardData}
          loading={!wardData}
          onChange={({ wardId }) => {
            console.log("wardId", id)
            dispatch({
              type: "ward_update",
              payload: { id },
            });
          }}
        />
      </div>
      <div className="w-[9.5rem]">
        <DatePickerInput 
          required
          initDate={initialDate}
          onSelect={({ date }) =>
            dispatch({
              type: "date_range_update",
              payload: { date },
            })
          }
          // onChange={onSelectDate} 
        />
      </div>
      <div className="w-24">
        <HollowButton
          type="submit"
          padding="px-2 py-3"
          width="w-full"
          height="h-12"
          onClick={() => {
            dispatch({ type: "parameters_add" });
            dispatch({ type: "remaining_keys_update" });
            dispatch({ type: "filter_start" });
          }}
        >
          Filter
        </HollowButton>
      </div>
    </div>
  );
}

export function TableFilter2({ searchKeys, onFilter }) {
  const [state, dispatch] = useReducer(filterReducer, {
    activeParameter: { key: null, value: "" },
    parameters: {},
    searchKeys,
    remainingKeys: searchKeys,
    canFilter: false,
  });

  useEffect(() => {
    let firstKey = searchKeys[0];
    if (firstKey) {
      dispatch({ type: "active_param_update", payload: firstKey.name });
      dispatch({ type: "remaining_keys_update" });
    }
  }, []);

  useEffect(() => {
    if (state.canFilter) {
      handleOnFilter();
      dispatch({ type: "filter_end" });
    }
  }, [state.canFilter]);

  function handleOnFilter() {
    let filters = Object.keys(state.parameters).map((key) => ({
      id: key,
      value: state.parameters[key].value,
    }));

    // console.log("filter", filters)

    onFilter(filters);
  }

  function handleDelete(name) {
    dispatch({ type: "parameters_remove", payload: name });
    dispatch({ type: "active_param_update", payload: name });
    dispatch({ type: "active_param_value_update", payload: "" });
    dispatch({ type: "remaining_keys_update" });
  }

  function handleClick({ name, value }) {
    dispatch({ type: "active_param_update", payload: name });
    dispatch({ type: "active_param_value_update", payload: value });
    dispatch({ type: "remaining_keys_update" });
  }

  return (
    <div className="">
      <div className="flex mb-3">
        <div className="w-full flex-grow flex justify-end flex-wrap">
          {Object.keys(state.parameters).map((keyName) => (
            <SearchParameterPill
              {...state.parameters[keyName]}
              key={keyName}
              onDelete={handleDelete}
              onClick={handleClick}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <div className="w-32 mr-1">
          <Label font="text-xs">Search column</Label>
          <Select
            name="column"
            padding="px-2 py-3"
            bg="bg-[#EBFBFE]"
            height="h-12"
            value={state.activeParameter?.key?.name}
            onChange={(e) => {
              dispatch({
                type: "active_param_update",
                payload: e.target.value,
              });
              dispatch({ type: "remaining_keys_update" });
            }}
          >
            <option
              key={state.activeParameter?.key?.name}
              value={state.activeParameter?.key?.name}
            >
              {state.activeParameter?.key?.label}
            </option>
            {state?.remainingKeys?.map((field) => (
              <option key={field.name} value={field.name}>
                {field.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="mr-2 flex items-center">
          <div className="w-56">
            <Label font="text-xs">Search value</Label>
            <TextInput
              name="search"
              bg="bg-[#EBFBFE]"
              disabled={!state.activeParameter}
              value={state.activeParameter.value}
              onChange={(e) =>
                dispatch({
                  type: "active_param_value_update",
                  payload: e.target.value,
                })
              }
              height="h-12"
              placeholder="Enter search value"
            />
          </div>
          <div className="self-end ml-1 -mb-1">
            <IconButton
              padding="p-2"
              icon={PlusIcon}
              className="bg-[#189FB8]/30 rounded-sm h-12"
              onClick={() => {
                dispatch({ type: "parameters_add" });
                dispatch({ type: "remaining_keys_update" });
              }}
            />
          </div>
        </div>

        <div className="w-[7rem] self-end">
          <HollowButton
            type="submit"
            padding="px-2 py-3"
            width="w-full"
            height="h-12"
            onClick={() => {
              dispatch({ type: "parameters_add" });
              dispatch({ type: "remaining_keys_update" });
              dispatch({ type: "filter_start" });
            }}
          >
            Search
          </HollowButton>
        </div>
      </div>
    </div>
  );
}

export function SearchParameterPill({ name, label, value, onDelete, onClick }) {
  const [isHovering, setIsHovering] = useState(false);

  const labelHoverStyle = isHovering ? "bg-[#189FB8]" : "bg-[#189FB8]";
  const valueHoverStyle = isHovering ? "bg-gray-300" : "bg-gray-200";

  return (
    <div
      className="text-sm text-gray-800 flex rounded ml-2 mb-2 cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => onClick({ name, value })}
    >
      <span
        className={`px-1 py-1 self-baseline rounded-l ${
          isHovering ? "visible" : "invisible"
        }`}
      >
        <IconButton
          icon={() => <DeleteIcon h="h-4" />}
          padding="p-0"
          round
          bg="bg-none"
          font="text-red-500 text-sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(name);
          }}
        />
      </span>
      <span
        className={`px-2 py-1 inline-block rounded-l text-gray-50 ${labelHoverStyle}`}
      >
        {label}
      </span>
      <span className={`px-2 py-1 inline-block rounded-r ${valueHoverStyle}`}>
        {value}
      </span>
    </div>
  );
}

export function filterReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case "date_range_update":
      return {
        ...state,
        date: payload.date,
        // startDate: payload.startDate,
        // endDate: payload.endDate,
      };
    case "ward_update":
      return {
        ...state,
        wardId: payload.wardId,
      };
    case "active_param_update":
      let key = state.searchKeys.find((sk) => sk.name === payload);
      return {
        ...state,
        activeParameter: {
          key,
          value: state.activeParameter.value || "",
        },
      };
    case "remaining_keys_update":
      return {
        ...state,
        remainingKeys: state.searchKeys.filter(
          ({ name }) =>
            !state.parameters[name] && name !== state.activeParameter.key.name
        ),
      };
    case "active_param_value_update":
      return {
        ...state,
        activeParameter: { ...state.activeParameter, value: payload },
      };
    case "parameters_add":
      let { key: keyName, value } = state.activeParameter;
      return state.activeParameter.value?.trim()
        ? {
            ...state,
            parameters: {
              ...state.parameters,
              [keyName.name]: { ...keyName, value },
            },
          }
        : state;
    case "parameters_remove":
      let updatedParameters = {};
      for (const name in state.parameters) {
        if (name !== payload) {
          updatedParameters[name] = state.parameters[name];
        }
      }
      return {
        ...state,
        parameters: updatedParameters,
      };
    case "filter_start":
      return { ...state, canFilter: true };
    case "filter_end":
      return { ...state, canFilter: false };
    default:
      return state;
  }
}
