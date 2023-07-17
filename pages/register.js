import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import { TextInput } from '@/components/TextInput';
import { Controller, useForm } from "react-hook-form";
import Image from 'next/image'
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { doLoginSender } from '@/hooks/auth';
import { Exclamation } from '@/components/Icons';
import { SmartSelect } from '@/components/SmartSelect';
import { Baseurl, Endpoint } from '@/util/constants';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function Register() {

    const role = [
      // { value: "Officer", label: "Officer" },
      { value: "Admin", label: "Admin" },
      { value: "Viewer", label: "Viewer" },
    ]

    const gender = [
      { value: "O", label: "O" },
      { value: "M", label: "M" },
      { value: "F", label: "F" },
    ]

    const router = useRouter();

    const {
      register,
      control,
      handleSubmit,
      formState: { errors },
    } = useForm();

    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    async function handleLogin(data) {

      const newData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        phone_number: data.phone_number,
        role: data.role.value,
        gender: data.gender.value,
      }
      
      try {
        if (newData) {
          setLoading(true);

          let response = await axios.post(`${Baseurl + "/" + Endpoint.REGISTER}`, newData)
          let payload = response.data;
          toast.success(payload.message);
          router.push("/");

        }
      } catch (error) {
        setError(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    return (
      <div className="bg-[#EBFBFE] p-10">
        <div className="relative bg-white flex flex-col min-h-screen items-center py-5 px-3 max-w-6xl mx-auto md:flex-row-reverse md:justify-center md:gap-[10rem]">

          <div className=''>
            <Image 
              src="/logo.png"
              width="100"
              height="100"
              alt="logo"
              layout="responsive"
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
            />
          </div>

          <div className=''>
            <div className='text-center py-2 mb-8'>
              <h1 className='text-2xl font-bold md:text-4xl'>Welcome to Revenue App!</h1>
              <h2 className='text-xs text-gray-500/80 md:text-sm'>Enter your credentials to open an account</h2>
            </div>

            <form 
              className='space-y-2' 
              onSubmit={handleSubmit(handleLogin)}
            >
              {error?.fromLogin && (
                <div className="opacity-75 text-orange-600 pb-4 font-semibold text-sm rounded-sm flex justify-start">
                  <p className="flex">
                    <Exclamation h={"w-6"} />
                  </p>
                  <span className="ml-2 flex-grow">{error.message}</span>
                </div>
              )}

              <div>
                <Label htmlFor="first_name">First name</Label>
                <TextInput
                  // autoComplete="autocomplete"
                  name="first_name"
                  padding="px-2 py-3"
                  bg="bg-none"
                  width="w-full md:w-[25rem]"
                  type="text"
                  {...register('first_name', { required: true })}
                />
                {errors.first_name && (
                  <p className="p-1 text-[13px] font-light  text-orange-500">
                    Please enter a valid first name.
                  </p>
                )}  
              </div>

              <div>
                <Label htmlFor="last_name">Last name</Label>
                <TextInput
                  // autoComplete="autocomplete"
                  name="last_name"
                  padding="px-2 py-3"
                  bg="bg-none"
                  width="w-full md:w-[25rem]"
                  type="text"
                  {...register('last_name', { required: true })}
                />
                {errors.last_name && (
                  <p className="p-1 text-[13px] font-light  text-orange-500">
                    Please enter a valid last name.
                  </p>
                )}  
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <TextInput
                  // autoComplete="autocomplete"
                  name="email"
                  padding="px-2 py-3"
                  bg="bg-none"
                  width="w-full md:w-[25rem]"
                  type="text"
                  {...register('email', { required: true })}
                />
                {errors.email && (
                  <p className="p-1 text-[13px] font-light  text-orange-500">
                    Please enter a valid email.
                  </p>
                )}  
              </div>
          
              <div>
                <Label htmlFor="password">Password</Label>
                <TextInput
                  // autoComplete="autocomplete"
                  name="password"
                  padding="px-2 py-3"
                  bg="bg-none"
                  type="password"
                  width="w-full md:w-[25rem]"
                  {...register('password', { required: true })}
                />
                {errors.password && (
                  <p className="p-1 text-[13px] font-light  text-orange-500">
                    Your password must contain between 4 and 60 characters.
                  </p>
                )}
              </div> 

              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <TextInput
                  // autoComplete="autocomplete"
                  name="Phone number"
                  padding="px-2 py-3"
                  bg="bg-none"
                  type="text"
                  width="w-full md:w-[25rem]"
                  {...register('phone_number', { required: true })}
                />
                {errors.phone_number && (
                  <p className="p-1 text-[13px] font-light  text-orange-500">
                    provide a valid phone number.
                  </p>
                )}
              </div> 

              <div className="md:w-[25rem]">
                <Label htmlFor="role" required>
                  Select Role
                </Label>
                <Controller
                  name="role"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                  <SmartSelect 
                    placeholder="Role..."
                    options={role || []}
                    loading={!role}
                    // className="w-[2rem]"
                    {...field}
                  />
                )}
                />
                {errors.role && (
                  <FieldError>Role is required</FieldError>
                )}
              </div>

              <div className="md:w-[25rem]">
                <Label htmlFor="gender" required>
                  Select Gender
                </Label>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                  <SmartSelect 
                    placeholder="Gender..."
                    options={gender || []}
                    loading={!gender}
                    // className="w-[2rem]"
                    {...field}
                  />
                )}
                />
                {errors.role && (
                  <FieldError>Role is required</FieldError>
                )}
              </div>

              <div className='text-right md:mr-[3rem]'>
                <Link className='text-xs text-[#189FB8]' href="/">Back to login?</Link>
              </div>

              <div className='md:mr-10'>
                <Button
                  type="submit"
                  width="w-full"
                  padding="py-3"
                  bg="bg-[#189FB8]"
                  font="font-semibold text-gray-50"
                  loading={loading}
                >
                  Sign Up
                </Button>
              </div>  
            </form>
          </div>
        </div>
        <p className='text-center text-xs font-bold py-2'>© 2023 WeTech Space</p>
      </div>
    )
}