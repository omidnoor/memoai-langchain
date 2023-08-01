import Head from "next/head";
import "../styles/globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Outfit } from "next/font/google";
import { Provider } from "react-redux";
import store from "store/store";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <UserProvider>
        <Head>
          <link rel="icon" href="/favicon.png" />
        </Head>
        <main className={`${outfit.variable} font-body`}>
          <Component {...pageProps} />
        </main>
      </UserProvider>
    </Provider>
  );
}

export default App;
