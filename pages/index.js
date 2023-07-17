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

export default function Home() {

    const { mutateUser } = useUser({
      redirectTo: "/enumerationDashboard",
      redirectIfFound: true,
    });

    const router = useRouter();

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();

    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    async function handleLogin(loginData) {
      
      try {
        if (loginData) {
          setLoading(true);
          await mutateUser(doLoginSender(loginData));
          router.push("/enumerationDashboard");
        }
      } catch (error) {
        setError(error);
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
              <h1 className='text-2xl font-bold md:text-4xl'>Welcome back!</h1>
              <h2 className='text-xs text-gray-500/80 md:text-sm'>Enter your credentials to access your account</h2>
            </div>

            <form className='space-y-5' onSubmit={handleSubmit(handleLogin)}>
                {error?.fromLogin && (
                    <div className="opacity-75 text-orange-600 pb-4 font-semibold text-sm rounded-sm flex justify-start">
                      <p className="flex">
                        <Exclamation h={"w-6"} />
                      </p>
                      <span className="ml-2 flex-grow">{error.message}</span>
                    </div>
                )}
              <div>
                <Label htmlFor="email">Username</Label>
                <TextInput
                  // autoComplete="autocomplete"
                  name="username"
                  padding="px-2 py-3"
                  bg="bg-none"
                  width="w-full md:w-[25rem]"
                  type="text"
                  {...register('email', { required: true })}
                />
                {errors.username && (
                  <p className="p-1 text-[13px] font-light  text-orange-500">
                    Please enter a valid username.
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

              <div className='flex justify-between'>
                <Link className='text-xs text-[#189FB8]' href="/register">Register?</Link>
                <Link className='text-xs text-[#189FB8]' href="">Forgot Password?</Link>
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
                  Login
                </Button>
              </div>  
            </form>
          </div>
        </div>
        <p className='text-center text-xs font-bold py-2'>© 2023 WeTech Space</p>
      </div>
    )
}