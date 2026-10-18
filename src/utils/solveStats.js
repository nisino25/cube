// Average-of-N helpers. An "AO-N" is the trimmed mean of the last N solves
// (best and worst are dropped), the usual speedcubing average.

// Returns an array aligned with `outcomes`: entry i is the AO-N ending at solve i,
// or null while there are fewer than N solves.
export function rollingAverage(outcomes, n) {
  const series = new Array(outcomes.length).fill(null)
  for (let i = n - 1; i < outcomes.length; i++) {
    const window = outcomes.slice(i - n + 1, i + 1)
    const total = window.reduce((sum, v) => sum + v, 0)
    const trimmed = total - Math.min(...window) - Math.max(...window)
    series[i] = Number((trimmed / (n - 2)).toFixed(2))
  }
  return series
}

// Smallest non-null value, or null when there is none.
export function bestOf(values) {
  let best = null
  for (const v of values) {
    if (v !== null && (best === null || v < best)) best = v
  }
  return best
}

export function mean(values) {
  if (values.length === 0) return 0
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

export function stdDev(values) {
  if (values.length === 0) return null
  const m = mean(values)
  return Math.sqrt(mean(values.map((v) => (v - m) ** 2)))
}

export function median(values) {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

// Buckets solve times into up to `maxBars` bars with a round bucket width.
export function histogram(values, maxBars = 30) {
  if (values.length === 0) return { bars: [], lo: 0, width: 1 }
  const lo = Math.floor(Math.min(...values))
  const hi = Math.ceil(Math.max(...values))
  const width = [0.5, 1, 2, 5, 10].find((w) => (hi - lo) / w <= maxBars) ?? 10
  const n = Math.max(1, Math.ceil((hi - lo) / width))
  const counts = new Array(n).fill(0)
  for (const v of values) {
    counts[Math.min(n - 1, Math.floor((v - lo) / width))]++
  }
  const peak = Math.max(...counts)
  const bars = counts.map((count, i) => ({
    start: lo + i * width,
    count,
    pct: (count / peak) * 100,
  }))
  return { bars, lo, width }
}

// Solve counts for the last `days` local days, oldest first. `results` need a `time` in ms.
export function dailyCounts(results, days = 14) {
  const counts = new Map()
  for (const r of results) {
    const key = new Date(r.time).toDateString()
    counts.set(key, (counts.get(key) || 0) + 1)
  }
  const out = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let d = days - 1; d >= 0; d--) {
    const day = new Date(today)
    day.setDate(today.getDate() - d)
    out.push({
      label: `${day.getDate()}`,
      count: counts.get(day.toDateString()) || 0,
    })
  }
  return out
}

// Day cells for the heatmap, from `start` to `end` inclusive, padded at the front so the
// first column starts on a Sunday. Each real day has a `level` 0-4 relative to the busiest day.
export function heatmapDays(results, start, end) {
  const counts = new Map()
  for (const r of results) {
    const key = new Date(r.time).toDateString()
    counts.set(key, (counts.get(key) || 0) + 1)
  }
  const days = []
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push({ date: new Date(d), count: counts.get(d.toDateString()) || 0 })
  }
  const max = Math.max(1, ...days.map((d) => d.count))
  const cells = days.map((d) => ({
    ...d,
    level: d.count === 0 ? 0 : Math.min(4, Math.ceil((d.count / max) * 4)),
  }))
  const lead = new Array(new Date(start).getDay()).fill(null)
  return {
    cells: [...lead, ...cells],
    total: days.reduce((sum, d) => sum + d.count, 0),
    activeDays: days.filter((d) => d.count > 0).length,
  }
}
