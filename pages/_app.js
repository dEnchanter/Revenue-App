import '@/styles/globals.css'
import "react-datepicker/dist/react-datepicker.css";
import { Toaster } from "react-hot-toast";
import ProgressBar from '@badrap/bar-of-progress';
import { Router } from 'next/router';

const progress = new ProgressBar({
  size: 2,
  color: '#189FB8',
  className: 'z-50',
  delay: 40,
});

Router.events.on('routeChangeStart', progress.start);
Router.events.on('routeChangeComplete', progress.finish);
Router.events.on('routeChangeError', progress.finish);

export default function App({ Component, pageProps }) {
  return (
    <div>
      <Toaster
        position='top-right'
      />  
      <Component {...pageProps} />
    </div>   
  )
}
