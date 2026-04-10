"use client";

import dynamic from "next/dynamic";

const BotWidget = dynamic(() => import("./BotWidget").then(m => m.BotWidget), {
  ssr: false,
});

export function BotWidgetLazy() {
  return <BotWidget />;
}
