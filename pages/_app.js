import { CartContextProvider } from "@/components/CartContext";
import "@/styles/globals.css";
import NavigationBar from "@/components/NavigationBar";

export default function App({ Component, pageProps }) {
  return (
    <CartContextProvider>
      <NavigationBar />
      <Component {...pageProps} />
    </CartContextProvider>
  );
}
