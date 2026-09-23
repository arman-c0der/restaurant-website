import "./globals.css";

import SessionProviderWrapper from "@/components/Sessionproviderwrapper";
import { Toaster } from "react-hot-toast";
import { LazyMotion, domAnimation } from "framer-motion";

// SEO Metadata Addition
export const metadata = {
  title: {
    default: "Best Restaurant in City | Delicious Food & Fast Delivery",
    template: "%s | Restaurant Name",
  },
  description:
    "Order fresh burgers, pizza, pasta, and traditional local cuisine online with fast home delivery and exclusive discounts.",
  keywords: ["restaurant", "food delivery", "online food order", "pizza", "burger"],
};

// Mobile Responsive Viewport Addition
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          <LazyMotion features={domAnimation}>
            {children}
          </LazyMotion>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
            }}
          />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}