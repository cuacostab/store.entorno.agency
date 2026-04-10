---
name: pricing-margin-30
description: Store applies 30% margin over Syscom prices and shows the final price to end users
type: project
---

Prices are NOT hidden — they are shown to end users with a 30% margin applied over Syscom's best price (precio_especial > precio_descuento > precio_lista).

**Why:** User wants to sell at Syscom cost + 30%. Prices are displayed in MXN before IVA.
**How to apply:** The margin is set in lib/strip-prices.ts as `MARGIN = 0.30`. All price transformation happens server-side before reaching the frontend. The bot also receives and mentions prices.
