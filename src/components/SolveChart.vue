<template>
  <div class="solve-chart" :class="{ compact }">
    <div class="legend">
      <span v-for="s in series" :key="s.label" class="legend-item">
        <i :style="{ background: s.color }"></i>{{ s.label }}
      </span>
      <span class="legend-item">
        <i class="legend-mean"></i>Mean {{ average.toFixed(2) }}
      </span>
    </div>

    <svg
      v-if="solves.length > 1"
      :viewBox="`0 0 ${W} ${H}`"
      class="plot"
      @pointermove="onPointer"
      @pointerdown="onPointer"
      @pointerleave="hoverIndex = null"
    >
      <g class="grid">
        <g v-for="t in ticks" :key="t">
          <line :x1="PAD.l" :x2="W - PAD.r" :y1="y(t)" :y2="y(t)" />
          <text :x="PAD.l - 6" :y="y(t) + 4" text-anchor="end">{{ fmt(t) }}</text>
        </g>
      </g>

      <text class="axis-label" :x="PAD.l" :y="H - 6">{{ firstNo }}</text>
      <text class="axis-label" :x="W - PAD.r" :y="H - 6" text-anchor="end">{{ firstNo + solves.length - 1 }}</text>

      <line class="mean-line" :x1="PAD.l" :x2="W - PAD.r" :y1="y(average)" :y2="y(average)" />

      <path
        v-for="s in paths"
        :key="s.label"
        :d="s.d"
        :stroke="s.color"
        :stroke-width="s.width || 2"
        fill="none"
        stroke-linejoin="round"
        stroke-linecap="round"
      />

      <g v-if="hoverIndex !== null">
        <line class="cursor" :x1="x(hoverIndex)" :x2="x(hoverIndex)" :y1="PAD.t" :y2="H - PAD.b" />
        <circle
          v-for="s in paths"
          :key="s.label + 'dot'"
          :cx="x(hoverIndex)"
          :cy="y(s.values[hoverIndex])"
          r="3.5"
          :fill="s.color"
          v-show="s.values[hoverIndex] !== null"
        />
      </g>
    </svg>

    <div v-else class="empty">Not enough solves yet</div>

    <div v-if="hoverIndex !== null" class="tooltip">
      <strong>No. {{ firstNo + hoverIndex }}</strong>
      <span v-for="s in series" :key="s.label" v-show="s.values[hoverIndex] !== null">
        <i :style="{ background: s.color }"></i>{{ s.label }} {{ fmt(s.values[hoverIndex], 2) }}
      </span>
    </div>
  </div>
</template>

<script>
import { mean } from '../utils/solveStats.js'

const W = 600
const H = 300
const PAD = { l: 46, r: 14, t: 16, b: 26 }

export default {
  name: 'SolveChart',
  props: {
    // Solve times (seconds) in the visible window, oldest first.
    solves: { type: Array, required: true },
    // [{ label, color, values, width? }] where values lines up with `solves`; null means no point.
    series: { type: Array, default: () => [] },
    // Solve number of solves[0], used for the x-axis labels.
    firstNo: { type: Number, default: 1 },
    compact: { type: Boolean, default: false },
  },
  data() {
    return { hoverIndex: null, W, H, PAD }
  },
  computed: {
    n() {
      return this.solves.length
    },
    plotW() {
      return W - PAD.l - PAD.r
    },
    plotH() {
      return H - PAD.t - PAD.b
    },
    average() {
      return mean(this.solves)
    },
    domain() {
      const values = [...this.solves]
      this.series.forEach((s) => values.push(...s.values.filter((v) => v !== null)))
      if (values.length === 0) return { lo: 0, hi: 1 }
      const min = Math.min(...values)
      const max = Math.max(...values)
      const pad = (max - min || 1) * 0.08
      return { lo: Math.max(0, min - pad), hi: max + pad }
    },
    // Round-number y-axis ticks (1, 2, 2.5 or 5 × 10^k) so labels read cleanly.
    scale() {
      const { lo, hi } = this.domain
      const raw = (hi - lo) / 4
      const mag = Math.pow(10, Math.floor(Math.log10(raw)))
      const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((st) => st >= raw)
      const ticks = []
      for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) {
        ticks.push(Number(v.toFixed(6)))
      }
      return { ticks, digits: Math.max(0, -Math.floor(Math.log10(step))) }
    },
    ticks() {
      return this.scale.ticks
    },
    paths() {
      return this.series.map((s) => ({ ...s, d: this.buildPath(s.values) }))
    },
  },
  methods: {
    x(i) {
      if (this.n <= 1) return PAD.l + this.plotW / 2
      return PAD.l + (i / (this.n - 1)) * this.plotW
    },
    y(v) {
      const { lo, hi } = this.domain
      return PAD.t + (1 - (v - lo) / (hi - lo)) * this.plotH
    },
    buildPath(values) {
      // A null breaks the line (e.g. AO5 before the fifth solve).
      let d = ''
      let pen = false
      values.forEach((v, i) => {
        if (v === null) {
          pen = false
          return
        }
        d += `${pen ? 'L' : 'M'}${this.x(i).toFixed(1)},${this.y(v).toFixed(1)} `
        pen = true
      })
      return d.trim()
    },
    fmt(v, digits) {
      return Number(v).toFixed(digits ?? this.scale.digits)
    },
    onPointer(e) {
      if (this.n <= 1) return
      const rect = e.currentTarget.getBoundingClientRect()
      const px = ((e.clientX - rect.left) / rect.width) * W
      const i = Math.round(((px - PAD.l) / this.plotW) * (this.n - 1))
      this.hoverIndex = Math.min(this.n - 1, Math.max(0, i))
    },
  },
}
</script>

<style scoped>
.solve-chart {
  position: relative;
  width: 100%;
  color: var(--text-muted);
  font-size: 12px;
}
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  padding: 0 4px 6px;
}
.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.legend-item i {
  display: inline-block;
  width: 12px;
  height: 3px;
  border-radius: 2px;
}
.legend-mean {
  background: repeating-linear-gradient(90deg, var(--accent-warn) 0 4px, transparent 4px 7px);
}
.plot {
  display: block;
  width: 100%;
  height: auto;
  touch-action: pan-y;
  user-select: none;
}
.grid line {
  stroke: var(--grid);
  stroke-width: 1;
}
.grid text,
.axis-label {
  fill: var(--text-muted);
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
.mean-line {
  stroke: var(--accent-warn);
  stroke-width: 1.5;
  stroke-dasharray: 6 5;
}
.cursor {
  stroke: var(--text-muted);
  stroke-width: 1;
}
.tooltip {
  position: absolute;
  top: 0;
  right: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  padding: 6px 10px;
  border-radius: 8px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text);
  pointer-events: none;
  font-variant-numeric: tabular-nums;
}
.tooltip i {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
}
.empty {
  padding: 40px 0;
  text-align: center;
}
.compact .plot {
  height: auto;
}
</style>
