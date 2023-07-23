'use client'

import Footer from "@/components/Footer";
import { useUser } from "@/hooks/auth";
import { Baseurl, Endpoint } from "@/util/constants";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from '@/util/axios';
import { Card } from "@/components/Card";
import { CustomCard } from "@/components/CustomCard";
import { formatDate, formatTimestamp } from "@/util/common";
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart } from 'recharts';
import { TableFilter } from "@/components/TableFilter";
import SideBar from "@/components/SideBar";
import { DatePickerInput } from "@/components/Forms";
import { useForm } from "react-hook-form";
import { SmartSelect } from "@/components/SmartSelect";
import { HollowButton } from "@/components/Button";

export default function Page() {

  const { user } = useUser({ redirectTo: "/login" });

  const [filters, setFilters] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedWard, setSelectedWard] = useState(null);

  const {
    data: cardData,
  } = useSWR(
    user?.code == "00" 
    ? [Endpoint.ALL_TIME_COUNTS]
    : null,
    fetcher
  );

  const {
    data: wardData,
  } = useSWR(
    user?.code == "00" 
    ? [Endpoint.FETCH_WARDS]
    : null,
    wardFetcher
  );

  const {
    data: liveActivityData,
  } = useSWR(
    user?.code == "00"
    ? [Endpoint.LIVE_ACTIVITIES, filters]
    : null,
    liveActivityfetcher
  );

  const {
    data: incomeData,
  } = useSWR(
    user?.code == "00"
    ? [Endpoint.INCOME_CATEGORIES, filters]
    : null,
    incomeCategoryfetcher
  );

  async function fetcher(url) {

    try {
      const response = await axios.get(url);
      const payload = await response.data

      if (payload.code == "00") {
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

  async function liveActivityfetcher(url, filters) {

    let userFilters = await filters.reduce((acc, aFilter) => {
      if (aFilter.value) {
        acc[aFilter.id] = aFilter.value;
      }
      return acc;
    }, {});

    const { ...remainingFilters } = userFilters;

    try {
      const response = await axios.get(url, {
        params: {
          // ward_id: selectedWard?.value,
          // date: formatDate(selectedDate),
          ...remainingFilters
        }
      });
      const payload = await response.data;

      if (payload.code == "00") {
        return payload.data;
      }

      throw new Error(payload.message);
    } catch (error) {
      toast.error(error.message);
      console.error(error, "error");
    }
  }

  async function incomeCategoryfetcher(url, filters) {

    let userFilters = await filters.reduce((acc, aFilter) => {
      if (aFilter.value) {
        acc[aFilter.id] = aFilter.value;
      }
      return acc;
    }, {});

    const { ...remainingFilters } = userFilters;

    try {
      const response = await axios.get(url, {
        params: {
          // ward_id: selectedWard?.value,
          // date: formatDate(selectedDate),
          ...remainingFilters
        }
      });
      const payload = await response.data;

      if (payload.code == "00") {
        return payload.data;
      }

      throw new Error(payload.message);
    } catch (error) {
      toast.error(error.message);
      console.error(error, "error");
    }
  }

  return (
    <div className="flex">

      <div className='bg-[#EBFBFE] max-w-[10rem] sm:max-w-xs h-screen sticky top-0 overflow-y-auto md:min-w-[15rem]'>
        <SideBar />
      </div>

      <div className="min-h-screen flex-1 max-w-5xl lg:max-w-7xl mx-auto">
        {/* User Holder */}
        <div className="flex items-center justify-end p-5">
          <UserCircleIcon className="w-10 h-10" />
          <p className="font-semibold">{`Hello ${user?.data?.first_name || 'user'}`}</p>
        </div>

        {/* Filters */}
        <div>
          <DashboardAction
            onFilter={setFilters}
            wardData={wardData || []}
            selectedWard={selectedWard}
            selectedDate={selectedDate}
            setSelectedWard={setSelectedWard}
            setSelectedDate={setSelectedDate}
          />
        </div>

        {/* Cards */}
        <div className="flex justify-between min-h-min space-x-2">
          <Card
            title="Income Streams"
            value={cardData?.income_streams_count || 0}
            imageSrc="/card_icon1.png"
            imageAlt="card1"
          />
          <Card
            title="Community"
            value={cardData?.communities_count || 0}
            imageSrc="/card_icon2.png"
            imageAlt="card2"
          />
          <Card
            title="Officers"
            value={cardData?.officers_count || 0}
            imageSrc="/card_icon3.png"
            imageAlt="card3"
          />
        </div>

        {/* Other data */}
        <div className="flex justify-around">
          <LineActivity
            liveActivityData={liveActivityData}
          />
          <IncomeCategory
            incomeData={incomeData}
          />
        </div>

        {/* Footer */}
        <Footer />
      </div>

    </div>
  )
}

function LineActivity({ liveActivityData }) {

  return (
    <div className="py-10">
      <p className="text-xs text-[#666666]">Live Activities</p>
      <div className="border border-1 border-[#189FB8]/30 h-[30rem] overflow-y-auto overflow-hidden">
        {
          liveActivityData?.map((activity, index) => (
            <CustomCard 
              key={index}
              id={activity?.stream_id}
              date={formatTimestamp(activity?.created_at)}
              title={activity?.business_name}
              icon2Src="/card_icon2.png"
              icon3Src="/card_icon3.png"
              icon3Alt="card3"
              stream={activity?.income_category}
              icon3Color="bg-[#189FB8]"
              icon2Text={activity?.ward_name}
              icon3Text={activity?.manager_name}
            />
          ))
        }
      </div>
    </div>
  )
}

function IncomeCategory({ incomeData }) {

  return (
    <div className="flex flex-col justify-start items-start mt-[5rem]">
      <p className="text-xs text-[#666666]">Top Income Streams</p>
      <ComposedChart
        barSize={15}
        width={500}
        height={300}
        data={incomeData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
      <CartesianGrid stroke="#f5f5f5" />
        <XAxis
          dataKey="category"
          padding={{ left: 10, right: 10 }}
          // tick={<CustomXAxisTick />}
          interval={1}
        />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#189FB8" background={{ fill: '#fff' }} />
      </ComposedChart>

    </div>
  )
}

function DashboardAction({
  onFilter,
  wardData,
  selectedDate,
  selectedWard,
  setSelectedWard,
  setSelectedDate
}) {

  const ward = wardData?.map((item) => {
    return { value: item.id, label: item.name }
  });

  let today = new Date();

  // const onSubmit = (data) => {
  //   console.log(data, "data")
  //   let filter = [];
  //   if (data) {
  //     // filter.push({ id: data.column, value: data.search });
  //   }
  //   onFilter(filter);
  // };

  const handleSubmit = (event) => {
    event.preventDefault(); 

    if (selectedWard && selectedDate) {
      let filter = [];
      filter.push({ id: "ward_id", value: selectedWard?.value });
      filter.push({ id: "date", value: formatDate(selectedDate) });
      onFilter(filter);
    }

    console.log(formatDate(selectedDate), "selectedDate")
    console.log(selectedWard?.value, "selectedWard")

  };


  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center mb-10">
        <div className="flex items-center space-x-4">
          <div className="w-44 h-30">
            <SmartSelect
              placeholder="Wards..."
              options={ward}
              loading={!ward}
              onChange={(value) => {
                setSelectedWard(value);
              }}
            />
          </div>
          <div className="w-[9.5rem]">
            <DatePickerInput
              required
              initDate={today}
              onChange={(date) => {
                setSelectedDate(date);
              }}
            />
          </div>
          <div className="w-24">
            <HollowButton
              type="submit"
              padding="px-2 py-3"
              width="w-full"
              height="h-12"
            >
            Filter
          </HollowButton>
      </div>
    </div>
      </div>
    </form>
  )
}
