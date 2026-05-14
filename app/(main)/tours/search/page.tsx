import { Suspense } from "react";
import SearchResultList from "../../../../components/pages/SearchResultList";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SearchResultList />
    </Suspense>
  );
}
