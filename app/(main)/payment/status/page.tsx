import { Suspense } from "react";
import PaymentStatus from "../../../../components/pages/PaymentStatus";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PaymentStatus />
    </Suspense>
  );
}
