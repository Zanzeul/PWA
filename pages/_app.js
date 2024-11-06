// pages/_app.tsx
import './globals.css'; // Import global CSS here

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;