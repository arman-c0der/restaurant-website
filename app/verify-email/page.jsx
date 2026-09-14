"use client";

import { Suspense } from "react";
import VerifyEmailContent from "./components/verifyemailcontent";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}