import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
      serverUrl="https://xdcuqwogn1hj.usemoralis.com:2053/server"
      appId="zBxmxU32mZXBku23hdyhkA7pzuAMBWwVb20CqBbR"
    >
      <Component {...pageProps} />
    </MoralisProvider>
  );
}

export default MyApp;
