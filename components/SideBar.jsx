import axios from '@/util/axios';
import Image from "next/image";
import { NavigationItem } from "./NavigationItem";
import { Endpoint } from "@/util/constants";
import { useRouter } from "next/router";

const navigationItems = [
  { href: '/paymentDashboard', iconSrc: '/ps_dashboard.png', alt: 'logo', label: 'Payments Dashboard (soon)' },
  { href: '/enumerationDashboard', iconSrc: '/enum_dashboard.png', alt: 'logo', label: 'Enumeration Dashboard' },
  { href: '/incomeStream', iconSrc: '/income.png', alt: 'logo', label: 'Income Streams' },
  { href: '/incomeLocation', iconSrc: '/income_location.png', alt: 'logo', label: 'Income Location/Buildings' },
  { href: '/communities', iconSrc: '/location.png', alt: 'logo', label: 'Communities' },
  { href: '/wards', iconSrc: '/location.png', alt: 'logo', label: 'Wards' },
  { href: '/officers', iconSrc: '/officer.png', alt: 'logo', label: 'Officers' },
  { href: '/paymentDetails', iconSrc: '/ps_detail.png', alt: 'logo', label: 'Payment Details (soon)' },
  { href: '/enumerationDetails', iconSrc: '/enum_details.png', alt: 'logo', label: 'Enumeration Details (soon)' },
];

function SideBar() {

  const router = useRouter();

  const handleLogout = async () => {
    try {
      const resp = await axios.post(Endpoint.LOGOUT);
  
      if (resp.code === "00") {
        localStorage.removeItem('token');
        router.push('/')
      } else {
        localStorage.removeItem('token');
        router.push('/')
      }
    } catch (error) {
      console.error(error);
    }  
  }

  return (
    <div className="p-2 flex flex-col h-screen">
      <div className="flex-1">
        <div className=''>
          <div className="flex flex-col space-y-2 my-2">

            <div className="flex justify-between mb-10">
              <div>
                <Image src="/logo.png" alt="logo" width="30" height="30" className="object-contain" />
              </div>
              <div>
                <Image src="/back_icon.png" alt="back_button" width="25" height="25" className="object-contain" />
              </div>
            </div>

            {navigationItems.map((item) => (
              (item.href === '/paymentDashboard' || item.href === '/paymentDetails' || item.href === '/enumerationDetails') ?
                <NavigationItem
                  key={item.href}
                  href={item.href}
                  iconSrc={item.iconSrc}
                  alt={item.alt}
                  label={item.label}
                  disabled
                /> :
                <NavigationItem
                  key={item.href}
                  href={item.href}
                  iconSrc={item.iconSrc}
                  alt={item.alt}
                  label={item.label}
                /> 
            ))}

          </div>

            <div className="flex justify-between items-center mt-[3rem] mb-[4rem] space-x-5 px-2 cursor-pointer">
              <div>
                <Image src="/logout.png" alt="logo" width="15" height="15" className="object-contain" />
              </div>
              <div className="flex-1" onClick={handleLogout}>
                <p className="text-red-600 text-sm font-bold">Logout</p>
              </div>
            </div>

        </div>
      </div>
    </div>
  )
}

export default SideBar