import "./globals.css";

import SessionProviderWrapper from "@/components/Sessionproviderwrapper";
import { Toaster } from "react-hot-toast";
import { LazyMotion, domAnimation } from "framer-motion";

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