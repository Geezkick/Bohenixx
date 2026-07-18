"use client";

import dynamic from "next/dynamic";

const AnalyticsClient = dynamic(() => import("./AnalyticsClient"), { 
  ssr: false,
  loading: () => (
    <div className="flex h-[80vh] items-center justify-center text-white/50 bg-[#05030A]">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[#7B2DFF] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-light tracking-widest uppercase">Initializing Telemetry...</p>
      </div>
    </div>
  )
});

export default function AnalyticsClientWrapper(props: any) {
  return <AnalyticsClient {...props} />;
}
