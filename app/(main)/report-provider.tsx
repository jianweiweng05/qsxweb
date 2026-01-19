"use client";

import { createContext, useContext, ReactNode } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

const ReportContext = createContext<any>(null);

export function ReportProvider({ children }: { children: ReactNode }) {
  const { data, error, isLoading } = useSWR(
    "/api/report",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000 // 1分钟内不重复请求
    }
  );

  return (
    <ReportContext.Provider value={{ data, error, isLoading }}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReport() {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error("useReport must be used within ReportProvider");
  return ctx;
}
