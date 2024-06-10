/*
NOTE: You need to add the shop param to all page redirects within this //.
Use window.shop to add the shop param whenever required.
This is set as required so that when you update the express app (whole next app reload after that), 
this app can load properly with the shop param at the url

You can make this optional by changin line 43 to :
if (typeof window === `undefined`)
*/

import Head from "next/head";
import { AppProvider } from "@shopify/polaris";
import { Provider } from "@shopify/app-bridge-react";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import axios from "axios";
import { getSessionToken } from "@shopify/app-bridge-utils";
import { useAppBridge } from "@shopify/app-bridge-react";
import AppWrapper from "../components/wrapper";
//import ClientRouter from "../components/ClientRouter";


const InitAuthSettings = () => {
  //For API Requests

  const appBridge = useAppBridge();
  //create an axios instance on the window object
  window.api = axios.create();

  // intercept all requests on this axios instance
  window.api.interceptors.request.use(function (config) {
    return getSessionToken(appBridge) // requires an App Bridge instance
      .then((token) => {
        // appending request headers with an authenticated token
        config.url = "/api" + config.url;
        config.headers["Authorization"] = token;
        return config;
      });
  });
  return null;
};
function MyApp({ Component, pageProps, router }) {
  const shopHost = router.query.shop + "/admin";
  //Don't render anything on server side
  //shop is undefined in the first render and so, we need to wait for that to be defined
  // shopify calls with shop param and so, we'll have that here as params
  if (typeof window === `undefined` || !router.query.shop) return null;

  //Shopify App bridge config
  const config = {
    apiKey: API_KEY,
    shopOrigin: router.query.shop,
    forceRedirect: false,
    host: Buffer.from(shopHost).toString("base64")

  };

  //Setting the shop param to window object, so that we can use this when we redirect to other pages of the app
  window.shop = router.query.shop;
  return (
    <>
      <Head>
        <title>Shopify App</title>
        <meta charSet="utf-8" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet" />

      </Head>
      <Provider config={config}>
        <AppProvider i18n={translations}>
          <InitAuthSettings></InitAuthSettings>
          <AppWrapper>
            <Component {...pageProps} />
          </AppWrapper>

        </AppProvider>
      </Provider>
    </>
  );
}
export default MyApp;
