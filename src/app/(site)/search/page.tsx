import { Suspense } from "react";
import SearchResults from "@/components/pages/search/SearchResults";

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
