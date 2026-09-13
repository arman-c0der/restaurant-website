import "./globals.css";

import SessionProviderWrapper from "@/components/Sessionproviderwrapper";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          {children}
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