"use client";

import { useRef, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/redux/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure store is only initialized once
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  // Wait until after client-side hydration to display
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent SSR flash of inconsistent UI
  if (!isMounted) {
    return null;
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
