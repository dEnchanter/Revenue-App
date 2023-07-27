import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className='overflow-y-auto scrollbar-thin scrollbar-thumb-[#095D52]/10'>
        <Main />
        <NextScript />
        <div id="modal-root"></div>
        <div id="snackbar-root"></div>
      </body>
    </Html>
  )
}
