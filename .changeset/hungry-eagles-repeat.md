---
'@layerstack/utils': patch
---

fix(date): Correct `utcToLocalDate()` shifting the year by ±1 near a year boundary, and preserve milliseconds in both `utcToLocalDate()` and `localToUtcDate()`
