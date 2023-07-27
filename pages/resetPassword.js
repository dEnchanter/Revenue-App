import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import { TextInput } from '@/components/TextInput';
import { useForm } from "react-hook-form";
import Image from 'next/image'
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { doLoginSender, useUser } from '@/hooks/auth';
import { Exclamation } from '@/components/Icons';
import { Baseurl, Endpoint } from '@/util/constants';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function ResetForgotPassword() {

    // const { mutateUser } = useUser({
    //   redirectTo: "/",
    //   redirectIfFound: true,
    // });

    const router = useRouter();

    const {
      register,
      handleSubmit,
      formState: { errors },
      getValues,
    } = useForm();

    const [serverError, setServerError] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    async function handleResetPassword(data) {
      
      try {
        if (data) {
          setLoading(true);

          const token = router.query.token;

          const { password } = data;
          const newPassword = password;

          let response = await axios.post(`${Baseurl + "/" + Endpoint.RESET_PASSWORD + "/" + token}`, {
            newPassword
          })

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
              <h1 className='text-2xl font-bold md:text-4xl'>Reset Password!</h1>
              {/* <h2 className='text-xs text-gray-500/80 md:text-sm'>Enter your email to recover password</h2> */}
            </div>

            <form className='space-y-5' onSubmit={handleSubmit(handleResetPassword)}>
              {serverError && (
                <div className="opacity-75 text-yellow-600 font-semibold text-sm rounded-sm mb-5 flex justify-start">
                  <span className="ml-2 flex-grow">{serverError}</span>
                </div>
              )}

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
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <TextInput
                  // autoComplete="autocomplete"
                  name="confirmPassword"
                  padding="px-2 py-3"
                  bg="bg-none"
                  type="password"
                  width="w-full md:w-[25rem]"
                  {...register('confirmPassword', {
                    required: "Confirm your new password",
                      validate: {
                        matchesPreviousPassword: (value) => {
                          const { password } = getValues();
                          return (
                            password === value || "Must match your new password"
                          );
                        },
                      },
                  })}
                />
                {errors.password && (
                  <p className="p-1 text-[13px] font-light  text-orange-500">
                    Your password must contain between 4 and 60 characters.
                  </p>
                )}
              </div>

              <div>
                <Button
                  type="submit"
                  width="w-full"
                  padding="py-3"
                  bg="bg-[#189FB8]"
                  font="font-semibold text-gray-50"
                  loading={loading}
                >
                  Reset Password
                </Button>
              </div>  
            </form>
          </div>
        </div>
        <p className='text-center text-xs font-bold py-2'>© 2023 WeTech Space</p>
      </div>
    )
}