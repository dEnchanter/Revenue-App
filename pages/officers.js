import { Card } from "@/components/Card";
import { useUser } from "@/hooks/auth";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useReducer, useState } from "react";
import { useTable, useFilters, usePagination, useRowSelect } from "react-table";
import useSWR from "swr";
import { format, parseISO } from "date-fns";
import axios from '@/util/axios';
import { Baseurl, Endpoint } from "@/util/constants";
import { UserIcon } from "lucide-react";
import Footer from "@/components/Footer";
import { NewThemePaginator } from "@/components/Containers";
import { TableWrapper } from "@/components/TableWrapper";
import { DeleteIcon, Exclamation, Loading, PencilIcon } from "@/components/Icons";
import { tableReducer } from "@/util/table";
import { ConfirmModal, Modal, useConfirmModal } from "@/components/Modal";
import { Button, IconButton } from "@/components/Button";
import { TableFilter2 } from "@/components/TableFilter";
import { Controller, useForm } from "react-hook-form";
import { FormInput } from "@/components/FormInput";
import { Label, Select } from "@/components/Forms";
import { toast } from "react-hot-toast";
import { SmartSelect } from "@/components/SmartSelect";
import SideBar from "@/components/SideBar";

let beforeState = "";

export default function Page() {

  const { user } = useUser({ redirectTo: "/login" });


  const [tableState, tableDispatch] = useReducer(tableReducer, { filters: [] });
  
  const {
    data: officerTableData,
    isValidating: tableDataIsValidating,
    mutate,
  } = useSWR(
    user?.code == "00" 
    ? [Endpoint.FETCH_OFFICERS, tableState]
    : null,
    officerTableFetcher
  );

  const {
    data: wardData,
  } = useSWR(
    user?.code == "00" 
    ? [Endpoint.FETCH_WARDS]
    : null,
    wardFetcher
  );

  const [pageCount, setPageCount] = useState("--");
  const [filters, setFilters] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [incomeFormInitialValue, setIncomeFormInitialValue] = useState(
    null
  );

  async function officerTableFetcher(url, {
    pageIndex, pageSize, filters
  }) {

    let userFilters = await filters.reduce((acc, aFilter) => {
      if (aFilter.value) {
        acc[aFilter.id] = aFilter.value;
      }
      return acc;
    }, {});

    const { contact_id, business_name, manager_name, phone_number, ...remainingFilters } = userFilters;

    try {
      const response = await axios.get(url, {
        params: {
          // page: pageIndex,
          // size: pageSize,
          contact_id,
          business_name,
          manager_name,
          phone_number,
          ...remainingFilters
        }
      });
      const payload = await response.data

      if (payload.code == "00") {
        setPageCount(payload.data.total);
        return payload.data;
      }

      throw new Error(payload.message);
    } catch (error) {
      toast.error(error.message);
      // console.error(error, "error");
    }
  }

  async function wardFetcher(url) {

    try {
      const response = await axios.get(url);
      const payload = await response.data

      if (payload.code == "00") {
        return payload.data.content;
      }

      throw new Error(payload.message);
    } catch (error) {
      toast.error(error.message);
      // console.error(error, "error");
    }
  }

  function onClickEdit(row) {
    if(beforeState != "") {
      beforeState = ""
    }

    beforeState = JSON.stringify(row);

    setIncomeFormInitialValue(row);
    setShowForm(true);
  }

  function handleDeleteIncomeCategory(row) {
    if (row) {
      deleteIncomeCategory(row);
    }
  }

  function deleteIncomeCategory(row) {
    confirm({
      title: "Delete Community",
      message:
        "Are you sure you want to delete: " +
        row.first_name,
      rejectLabel: "No, Don't",
      acceptLabel: "Yes, Proceed",
      onAccept: async (done) => {
        try {
          let response = await axios.delete(`${Endpoint.DELETE_OFFICER}/${row.id}`);
          console.log("response", response)
          if (response.data.code == "00") {
            mutate();
            toast.success(response.data.message);
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error("failed to delete income category");
        } finally {
          done();
        }
      },
    });
  }

  function handleSetShowForm(open) {
    if (!open) {
      setIncomeFormInitialValue(null);
    }
    setShowForm(open);
  }

  const onRowSelect = (rows) => {
    if (selectedRows.length) {
      setSelectedRows(rows);
    } else if (!selectedRows.length && rows.length) {
      setSelectedRows(rows);
    }
  };

  // useEffect(() => console.log(selectedRows), [selectedRows]);
  const [confirmProps, confirm] = useConfirmModal();
  
  return (
    <div className="flex">
      <div className="bg-[#EBFBFE] max-w-[13rem] h-screen sticky top-0 overflow-y-auto">
        <SideBar />
      </div>

      <div className="min-h-screen flex-1 max-w-5xl mx-auto">
      <ConfirmModal {...confirmProps} />

      {/* User Holder */}
      <div className="flex items-center justify-end p-5">
        <UserCircleIcon className="w-10 h-10" />
        <p className="font-semibold">{`Hello ${user?.data?.first_name || 'user'}`}</p>
      </div>

      {/* Cards */}
      <div className="flex justify-between items-center space-x-2">
        <Card
          title="Officers"
          value={officerTableData?.total || 0}
          imageSrc="/card_icon3.png"
          imageAlt="card1"
        />
        <div>
          <button className="bg-[#189FB8] hover:bg-[#189FB8]/90 px-5 py-5 flex items-center space-x-3
            focus:outline-none active:bg-[#189FB8]"
            onClick={() => setShowForm(true)}
          >
            <span>
              <UserIcon className="w-5 h-5 text-white" />
            </span>
            <span className="text-white text-sm font-bold">Add Officer</span>
          </button>
        </div>

      </div>

      {/* Filters */}
      <div className="mt-[3.5rem]">
        <TableAction
          columns={getColumns()}
          onFilter={setFilters}
          loading={tableDataIsValidating}
        />
      </div>

      <div>
        <IncomeForm
          data={wardData || []}
          showForm={showForm}
          setShowForm={handleSetShowForm}
          refreshTable={mutate}
          initialValue={incomeFormInitialValue}
        />
      </div>

      {/* Table */}
      <div className="mt-[1.5rem] mb-[2rem]">
        <OfficerTable 
          data={officerTableData?.content || []}
          dispatch={tableDispatch}
          loading={tableDataIsValidating}
          pageCount={pageCount}
          filters={filters}
          onClickEdit={onClickEdit}
          onClickDelete={handleDeleteIncomeCategory}
          onRowSelectChange={onRowSelect}
        />
      </div>

      {/* Footer */}
      <Footer />
      </div>
    </div>
    
  )
}

function OfficerTable({
  data,
  dispatch,
  pageCount: configuredPageCount,
  filters: searchFilters,
  loading,
  onClickEdit,
  onClickDelete,
  onRowSelectChange,
}) {
  const columns = useMemo(
    () => [
      { Header: "S/N", id: "_serial" },
      { Header: "Name", accessor: "first_name" },
      { Header: "Amount", accessor: "gender" },
      { Header: "Description", accessor: "ward" },
      {
        Header: "Date Created",
        accessor: "created_at",
        Cell: ({ value }) => format(parseISO(value), "dd-MM-yyyy hh:mm a"),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    columns: { ..._cols },
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setFilter,
    setAllFilters,
    selectedFlatRows,
    state: { pageIndex, pageSize, filters, selectedRowIds },
    ...rest
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 50, // TODO Make page size configurable
        hiddenColumns: ["_id", "updatedAt", "_edit"],
      },
      manualPagination: true,
      manualFilters: true,
      pageCount: configuredPageCount,
    },
    useFilters,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "_action",
          Cell: ({ row }) => (
            
            <div className="flex items-center">
              <IconButton
                round
                onClick={() => onClickEdit(row.original)}
                icon={PencilIcon}
                padding="p-1"
                margin="ml-4"
                font="text-xs text-gray-400 hover:text-purple-600"
                bg="bg-none hover:bg-[#EBFBFE] bg-opacity-50"
              />
              <IconButton
                round
                onClick={(event) => {
                  event.stopPropagation();
                  onClickDelete(row.original);
                }}
                icon={DeleteIcon}
                padding="p-1"
                margin="ml-4"
                font="text-xs text-gray-500 hover:text-purple-600"
                bg="bg-none hover:bg-[#EBFBFE] bg-opacity-50"
              />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  useEffect(() => {
    dispatch({
      type: "updateTableState",
      payload: { pageIndex, pageSize, filters },
    });
  }, [pageIndex, pageSize, filters]);

  useEffect(() => {
    if (searchFilters.length) {
      setAllFilters(searchFilters);
    }
  }, [searchFilters]);

  useEffect(() => {
    onRowSelectChange(selectedFlatRows.map((row) => row.original));
  }, [selectedRowIds]);

  function extractCellValue(cell, index) {
    let row = cell.row.values;
    switch (cell.column.id) {
      case "_serial":
        return index + 1 + pageIndex * pageSize;
      default:
        return typeof cell.value === "boolean"
          ? cell.value.toString()
          : cell.render("Cell");
    }
  }

  function deriveHeaderClass(column, index, size) {
    let className = "p-2 text-gray-400 ";
    if (index !== size - 1) {
      className += "border-r-2 border-gray-100 ";
    }
    if (column.id === "_serial" || column.id === "_selecton") {
      className += "w-10  ";
    } else if (column.id === "_action") {
      className += "w-[4.5rem]";
    } else if (column.id == "email") {
      className += "w-56";
    } else {
      className += "w-32 ";
    }
    return { className };
  }

  return (
    <>
      <TableWrapper>
        <div className=" overflow-x-auto">
          {!data.length && loading && (
            <div className="text-center p-4 text-gray-700 text-sm h-14">
              <span>
                Loading page {pageIndex + 1}
                <span className="tracking-widest">...</span>
              </span>
              <div className="inline-block ml-2">
                <Loading h="w-4" />
              </div>
            </div>
          )}
          {!data.length && !loading && (
            <div className="text-center p-4 text-gray-700 text-sm h-14">
              {/* <span>No data found</span> */}
              <span><Loading h="w-4" /></span>
            </div>
          )}
          {!!data.length && (
            <table
              className="text-gray-700 w- opacity-85 bg-[#189FB8]/30 text-sm border-collapse table-fixed w-full"
              {...getTableProps()}
            >
              <thead className=" border-gray-200 border-separate text-left text-sm">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column, index, headers) => (
                      <th
                        className={`py-1 px-2 font-semibold`}
                        {...column?.getHeaderProps(
                          deriveHeaderClass(column, index, headers.length)
                        )}
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="text-left" {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps({
                        className: row.index % 2 ? "bg-[#EBFBFE]/50" : "bg-[#EBFBFE]",
                      })}
                    >
                      {row.cells.map((cell) => {
                        return (
                          <td
                            className="px-2 py-2"
                            {...cell.getCellProps()}
                          >
                            {extractCellValue(cell, row.index)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </TableWrapper>
      <NewThemePaginator
        // Show loading only when revalidating the data on the page
        loading={!!data.length && loading}
        canNextPage={canNextPage}
        canPreviousPage={canPreviousPage}
        gotoPage={gotoPage}
        nextPage={nextPage}
        previousPage={previousPage}
        pageCount={pageOptions.length}
        pageIndex={pageIndex}
        setPageSize={setPageSize}
      />
    </>
  );

}

function IncomeForm({
  data,
  setShowForm,
  showForm,
  refreshTable,
  initialValue,
}) {

  let ward = [];

  if (Array.isArray(data)) {
    ward = data?.map((item) => {
      return { value: item.id, label: item.name }
    });
  }

  const role = [
    { value: "Officer", label: "Officer" },
    { value: "Admin", label: "Admin" },
    { value: "Viewer", label: "Viewer" },
  ]

  const gender = [
    { value: "O", label: "O" },
    { value: "M", label: "M" },
    { value: "F", label: "F" },
  ]

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState();

  function onSubmit(data) {
    setIsSubmitting(true);
    data.beforeState = beforeState;
    data.ward_id = data.ward_id.value;
    data.role = data.role.value;
    data.gender = data.gender.value;

    // console.log("data", data)
    
    doSubmission(Endpoint.POST_OFFICER, data, {
      completed: () => setIsSubmitting(false),
      onError: (error) =>
        setServerError(typeof error === "string" ? error : error.message),
      onSuccess: (successMessage) => {
        setShowForm(false);
        setServerError(null);
        toast.success("Officer added", successMessage)
        reset();
        refreshTable();
      },
    });
  }

  async function doSubmission(
    endpoint,
    data,
    { completed, onError, onSuccess }
  ) {
    try {
      const response = await axios.post(endpoint, data);
      const payload = response.data;

      if (payload.code == "00") {
        onSuccess(payload.message);
      } else {
        onError(payload.message);
      }
    } catch (error) {
      console.log(error);
      onError(error);
    } finally {
      completed();
    }
  }

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset,
    control,
  } = useForm();

  return (
    <Modal
      onClose={() => setShowForm(false)}
      show={showForm}
      title="Register New Officer"
      top="top-6"
      width="lg"
      subTitle="Enter the details below to register a new officer to the system"
      >
      <div>
        {serverError && (
          <div className="opacity-75 text-yellow-600 font-semibold text-sm rounded-sm mb-5 flex justify-start">
            <p className="flex">
              <Exclamation h={"w-6"} />
            </p>
            <span className="ml-2 flex-grow">{serverError}</span>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="h-96 px-4 overflow-y-auto">
            <div className="flex justify-between mb-10">
              <div className="w-full mr-8">
                <FormInput
                  label="first name"
                  name="first_name"
                  defaultValue={initialValue?.first_name}
                  type="text"
                  {...register('first_name', { required: true })}
                />
                {errors.name && (
                  <FieldError>First name is required</FieldError>
                )}
              </div>
              <div className="w-full">
                <FormInput
                  label="last name"
                  name="last_name"
                  type="text"
                  defaultValue={initialValue?.last_name}
                  {...register('last_name', { required: true })}
                />
                {errors.last_name && (
                  <FieldError>Last name is required</FieldError>
                )}
              </div>
            </div>

            <div className="flex justify-between mb-10">
              <div className="w-full mr-8">
                <FormInput
                  label="email"
                  name="email"
                  defaultValue={initialValue?.email}
                  type="text"
                  {...register('email', { required: true })}
                />
                {errors.email && (
                  <FieldError>Email is required</FieldError>
                )}
              </div>
              <div className="w-full">
                <FormInput
                  label="password"
                  name="password"
                  type="password"
                  defaultValue={initialValue?.password}
                  {...register('password', { required: true })}
                />
                {errors.password && (
                  <FieldError>Password is required</FieldError>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mb-10">
              <div className="w-full mr-8">
                <FormInput
                  label="phone no"
                  name="phone_number"
                  defaultValue={initialValue?.phone_number}
                  type="text"
                  {...register('phone_number', { required: true })}
                />
                {errors.phone_number && (
                  <FieldError>Phone no is required</FieldError>
                )}
              </div>

              <div className="w-full">
                  <Label htmlFor="gender" required>
                    Select Gender
                  </Label>
                  <Controller
                    defaultValue={initialValue?.gender || ""}
                    name="gender"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                    <SmartSelect 
                      placeholder="Gender..."
                      options={gender || []}
                      loading={!gender}
                      {...field}
                    />
                  )}
                />
                {errors.gender && (
                  <FieldError>Gender is required</FieldError>
                )}
                </div>
            </div>
            
            <div className="flex justify-between items-center mb-10">
                <div className="w-full mr-8">
                  <Label htmlFor="role" required>
                    Select Role
                  </Label>
                  <Controller
                    defaultValue={initialValue?.role || ""}
                    name="role"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                    <SmartSelect 
                      placeholder="Role..."
                      options={role || []}
                      loading={!role}
                      {...field}
                    />
                  )}
                />
                {errors.role && (
                  <FieldError>Role is required</FieldError>
                )}
                </div>
              
                <div className="w-full">
                  <Label htmlFor="ward" required>
                    Select Ward
                  </Label>
                  <Controller
                    defaultValue={initialValue?.ward_id || ""}
                    name="ward_id"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                    <SmartSelect 
                      placeholder="Ward..."
                      options={ward || []}
                      loading={!ward}
                      {...field}
                    />
                    )}
                  />

                  {errors.ward && (
                    <FieldError>Ward is required</FieldError>
                  )}
                </div>
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <Button
              bg="bg-none"
              border="border border-gray-300 hover:border-gray-400 rounded"
              font="text-gray-400 hover:text-gray-500 text-sm"
              width="w-32"
              margin="mr-4"
              disabled={isSubmitting}
              onClick={() => {
                setShowForm(false);
                setServerError(null);
              }}
            >
              No, Cancel
            </Button>
            <Button
              bg="bg-[#189FB8]"
              border="border border-[#189FB8] hover:border-[#189FB8] rounded"
              font="text-[#189FB8] text-sm text-white"
              width="w-48"
              type="submit"
              margin="mr-4"
              loading={isSubmitting}
            >
              {initialValue ? "Edit Officer" : "Add Officer"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

function FieldError({ children }) {
  return (
    <small className="text-yellow-600 opacity-80 italic">{children}</small>
  );
}

function TableAction({
  columns,
  onFilter,
}) {

  const searchKeys = useMemo(
    () =>
      columns.reduce((acc, col) => {
        if (col.quickSearch) {
          acc.push({ name: col.accessor, label: col.Header });
        }
        return acc;
      }, []),
    []
  );

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="flex justify-between">
        <div className="flex justify-end">
          <TableFilter2
            searchKeys={searchKeys}
            onFilter={onFilter}
          />
        </div>
      </div>
    </form>
  );
}

function getColumns() {
  return [
      { Header: "S/N", id: "_serial" },
      { Header: "Name", accessor: "first_name", quickSearch: true },
      { Header: "Amount", accessor: "gender", quickSearch: true },
      { Header: "Description", accessor: "ward", quickSearch: true },
      {
        Header: "Date Created",
        accessor: "created_at",
        Cell: ({ value }) => format(parseISO(value), "dd-MM-yyyy hh:mm a"),
      },
  ];
}
