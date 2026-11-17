---
'@layerstack/utils': patch
---

feat(date): Add UTC time intervals (`'utcDay'`, `'utcMonth'`, ...) to `TimeIntervalType`, usable anywhere an interval name is accepted (`startOfInterval('utcDay', date)`, `intervalOffset('utcMonth', date, -1)`, ...), along with a `utcQuarter` interval
