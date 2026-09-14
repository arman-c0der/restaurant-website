"use client";

import { Suspense } from "react";
import OrderSuccessContent from "./components/orderSuccessContent";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessContent />
    </Suspense>
  );
}