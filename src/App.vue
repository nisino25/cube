<template>
  <div class="app">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css">

    <!-- Solving: tap anywhere to stop -->
    <main v-if="menu === 'timer' && running" class="solving-screen" @pointerdown.prevent="csTimer()">
      <div class="solving-label">Solving</div>
    </main>

    <template v-else>
      <header class="topbar">
        <div class="brand"><span class="brand-mark"></span>Cube<span v-if="userName" class="brand-user">· {{ userName }}</span></div>
        <div class="views"><i class="far fa-eye"></i> {{ userNum }}</div>
      </header>

      <!-- Timer -->
      <main v-if="menu === 'timer'" class="screen timer-screen">
        <section class="card scramble-card" v-if="display.scramble">
          <div class="card-head">
            <span class="label">Scramble</span>
            <button class="ghost small-btn" @click="algShuffle()"><i class="fas fa-sync-alt"></i> New</button>
          </div>
          <div class="scramble">
            <div v-for="(row, r) in scrambleRows" :key="r" class="scramble-row">
              <span v-for="(m, j) in row" :key="j" class="move">{{ m }}</span>
            </div>
          </div>
        </section>

        <section
          class="timer-pad"
          :class="{ ready: isTimerRunning }"
          @pointerdown="startTimer()"
          @pointerup="stopTimer()"
          @pointercancel="stopTimer()"
          @pointerleave="stopTimer()"
        >
          <span class="actual-timer">
            <template v-if="time == '0.00'">{{ time }}</template>
            <template v-else-if="time - time.toFixed(2) == time">{{ time }}.0</template>
            <template v-else>{{ time }}</template>
          </span>
          <span class="clock-hint">
            {{ isTimerRunning ? 'Release to start' : pressing ? 'Keep holding…' : 'Hold to get ready' }}
          </span>
        </section>

        <section class="strip" v-if="results.length > 0 && (display.recent || display.aoLine)">
          <div class="chips" v-if="display.recent">
            <div v-for="k in recentIdx" :key="k" class="chip" :class="{ latest: k === results.length - 1 }">
              <span class="chip-no">{{ k + 1 }}</span>{{ outcomes[k] }}
            </div>
          </div>
          <div class="stats-line" v-if="display.aoLine">
            <span>AO5 <b>{{ AO5Data[results.length - 1] ?? '—' }}</b></span>
            <span>AO12 <b>{{ AO12Data[results.length - 1] ?? '—' }}</b></span>
            <span>Best <b>{{ bestTime }}</b></span>
            <button class="icon-btn" title="Delete last solve" @click="deleteData(results.length - 1)"><i class="fas fa-undo"></i></button>
          </div>
        </section>

        <section class="rings" v-if="display.rings">
          <div v-for="ring in rings" :key="ring.label" class="ring" :class="{ done: ring.done }">
            <div class="ring-dial">
              <svg viewBox="0 0 80 80">
                <circle class="ring-track" cx="40" cy="40" r="34" />
                <circle class="ring-value" cx="40" cy="40" r="34" :stroke-dasharray="ring.dash" :stroke-dashoffset="ring.offset" />
              </svg>
              <div class="ring-num">{{ ring.count }}</div>
            </div>
            <div class="ring-label">{{ ring.label }}<small> / {{ ring.goal }}</small></div>
          </div>
        </section>
      </main>

      <!-- Stats -->
      <main v-else-if="menu === 'stats'" class="screen">
        <section class="summary">
          <div class="stat"><span>Solves</span><b>{{ results.length }}</b></div>
          <div class="stat"><span>Best</span><b>{{ results.length ? bestTime : '—' }}</b></div>
          <div class="stat"><span>Mean</span><b>{{ overallMean }}</b></div>
          <div class="stat"><span>Best AO5</span><b>{{ bestAO5 ?? '—' }}</b></div>
          <div class="stat"><span>Best AO12</span><b>{{ bestAO12 ?? '—' }}</b></div>
          <div class="stat"><span>Best AO25</span><b>{{ bestAO25 ?? '—' }}</b></div>
          <div class="stat"><span>Best AO100</span><b>{{ bestAO100 ?? '—' }}</b></div>
        </section>

        <section class="card">
          <div class="card-head">
            <div class="seg">
              <button :class="{ active: whichStats === 'chart' }" @click="whichStats = 'chart'">Chart</button>
              <button :class="{ active: whichStats === 'table' }" @click="whichStats = 'table'">Table</button>
            </div>
          </div>

          <div v-if="whichStats === 'chart' && results.length >= 2">
            <div class="chart-controls">
              <div class="seg">
                <button v-for="r in chartRanges" :key="r.label" :class="{ active: chartRange === r.value }" @click="chartRange = r.value">{{ r.label }}</button>
              </div>
              <div class="toggles">
                <button
                  v-for="s in chartToggles"
                  :key="s.key"
                  class="toggle"
                  :class="{ active: chartShow[s.key] }"
                  :style="{ '--tone': s.color }"
                  @click="chartShow[s.key] = !chartShow[s.key]"
                >{{ s.label }}</button>
              </div>
            </div>
            <solve-chart :solves="chartSolves" :series="chartSeries" :first-no="chartStart + 1" />
          </div>

          <div v-else-if="whichStats === 'table'" class="table-wrap">
            <table class="solve-table">
              <thead>
                <tr><th>No.</th><th>Time</th><th>AO5</th><th>AO12</th><th>AO100</th><th></th></tr>
              </thead>
              <tbody>
                <tr v-for="k in tableIdx" :key="k">
                  <td class="muted">{{ k + 1 }}</td>
                  <td class="strong">{{ outcomes[k] }}</td>
                  <td>{{ AO5Data[k] ?? '—' }}</td>
                  <td>{{ AO12Data[k] ?? '—' }}</td>
                  <td>{{ AO100Data[k] ?? '—' }}</td>
                  <td><button class="icon-btn" title="Delete" @click="deleteData(k)"><i class="fas fa-times"></i></button></td>
                </tr>
              </tbody>
            </table>
            <p class="muted small" v-if="results.length > 100">Showing the latest 100 solves.</p>
          </div>
          <p v-else class="muted empty">Solve at least two times to see the chart.</p>
        </section>
      </main>

      <!-- Lab -->
      <main v-else-if="menu === 'lab'" class="screen lab">
        <header class="lab-hero">
          <div class="lab-kicker">Lab</div>
          <div class="lab-title">{{ labTabTitle }}</div>
          <nav class="subtabs">
            <button :class="{ active: labTab === 'insights' }" @click="labTab = 'insights'">Insights</button>
            <button :class="{ active: labTab === 'display' }" @click="labTab = 'display'">Display</button>
          </nav>
        </header>

        <!-- Insights -->
        <template v-if="labTab === 'insights'">
          <section class="metrics">
            <div class="metric big"><span>Median</span><b>{{ labMedian ?? '—' }}</b></div>
            <div class="metric"><span>Std dev</span><b>{{ labStdDev ?? '—' }}</b></div>
            <div class="metric"><span>Today</span><b>{{ labToday }}</b></div>
            <div class="metric"><span>Per day</span><b>{{ labPerDay }}</b></div>
          </section>

          <section class="card">
            <div class="card-head">
              <span class="label">Heatmap</span>
            </div>
            <div class="seg heat-range">
              <button v-for="o in heatOptions" :key="o.key" :class="{ active: heatRange === o.key }" @click="setHeatRange(o.key)">{{ o.label }}</button>
            </div>
            <div class="heat-scroll">
              <div class="heat-months" :class="heatOption.days && heatOption.days <= 182 ? 'fit' : 'scroll'">
                <span v-for="(m, c) in heatMonthLabels" :key="c">{{ m }}</span>
              </div>
              <div class="heat" :class="heatOption.days && heatOption.days <= 182 ? 'fit' : 'scroll'">
                <template v-for="(d, i) in labHeat.cells" :key="i">
                  <button
                    v-if="d"
                    class="heat-cell"
                    :class="['lv' + d.level, { sel: heatSelected === d.date.toDateString() }]"
                    :aria-label="`${d.date.toDateString()}: ${d.count} solves`"
                    @click="heatSelected = d.date.toDateString()"
                  ></button>
                  <div v-else class="heat-cell pad"></div>
                </template>
              </div>
            </div>
            <div class="heat-picked">
              <b>{{ heatPicked ? heatPicked.label : '' }}</b>
              <span class="muted">{{ heatPicked ? heatPicked.count + (heatPicked.count === 1 ? ' solve' : ' solves') : 'Tap a day' }}</span>
            </div>
            <div class="heat-legend muted small">
              <span>{{ labHeat.total }} solves · {{ labHeat.activeDays }} active days</span>
              <span class="legend-scale">
                Less
                <span class="heat-cell lv0"></span><span class="heat-cell lv1"></span><span class="heat-cell lv2"></span><span class="heat-cell lv3"></span><span class="heat-cell lv4"></span>
                More
              </span>
            </div>
          </section>

          <section class="card">
            <div class="card-head">
              <span class="label">Distribution</span>
              <div class="seg">
                <button v-for="r in chartRanges" :key="r.label" :class="{ active: labRange === r.value }" @click="labRange = r.value">{{ r.label }}</button>
              </div>
            </div>
            <div v-if="labHist.bars.length" class="hist">
              <div v-for="(b, i) in labHist.bars" :key="i" class="hist-col" :title="`${b.start}s: ${b.count}`">
                <div class="hist-bar" :style="{ height: b.pct + '%' }"></div>
              </div>
            </div>
            <div v-if="labHist.bars.length" class="hist-axis">
              <span>{{ labHist.lo }}s</span>
              <span>{{ labHist.lo + labHist.bars.length * labHist.width }}s</span>
            </div>
            <p v-else class="muted empty">No solves yet.</p>
          </section>

          <section class="card">
            <div class="card-head"><span class="label">Lists</span></div>
            <div class="actions">
              <button @click="showList('fast')"><i class="fas fa-bolt"></i> Fastest 50</button>
              <button @click="showList('algs')"><i class="fas fa-random"></i> Frequent scrambles</button>
            </div>
            <div v-if="showAnalysis" class="analysis">
              <ul v-if="showingList == 'algs'" class="list"><li v-for="(i, algs) in pastAlgs" :key="algs">{{ i }}</li></ul>
              <ul v-else class="grid-list"><li v-for="(i, fast) in currentList" :key="fast">{{ i.outcome }}</li></ul>
            </div>
          </section>
        </template>

        <!-- Display: timer preview and simple options -->
        <template v-else>
          <section class="card">
            <div class="card-head">
              <span class="label">Timer page</span>
              <span class="muted small">{{ currentStyle.label }} · {{ activeColor.label }}</span>
            </div>
            <div class="mock">
              <section v-if="display.scramble" class="card mock-card">
                <div class="scramble">
                  <div class="scramble-row">
                    <span v-for="(m, i) in sampleMoves[0]" :key="i" class="move">{{ m }}</span>
                  </div>
                  <div class="scramble-row">
                    <span v-for="(m, i) in sampleMoves[1]" :key="i" class="move">{{ m }}</span>
                  </div>
                </div>
              </section>

              <div class="timer-pad mock-pad">
                <span class="actual-timer">12.34</span>
                <span class="clock-hint">Hold to get ready</span>
              </div>

              <section v-if="display.rings" class="rings">
                <div v-for="ring in sampleRings" :key="ring.label" class="ring">
                  <div class="ring-dial">
                    <svg viewBox="0 0 80 80">
                      <circle class="ring-track" cx="40" cy="40" r="34" />
                      <circle class="ring-value" cx="40" cy="40" r="34" :stroke-dasharray="ring.dash" :stroke-dashoffset="ring.offset" />
                    </svg>
                    <div class="ring-num">{{ ring.count }}</div>
                  </div>
                  <div class="ring-label">{{ ring.label }}</div>
                </div>
              </section>

              <div v-if="display.recent" class="chips">
                <div v-for="(t, i) in sampleChips" :key="i" class="chip" :class="{ latest: i === 0 }">
                  <span class="chip-no">{{ 300 - i }}</span>{{ t }}
                </div>
              </div>
              <div v-if="display.aoLine" class="stats-line">
                <span>AO5 <b>10.64</b></span>
                <span>AO12 <b>10.70</b></span>
                <span>Best <b>8.09</b></span>
              </div>
            </div>
          </section>

          <section class="card">
            <div class="card-head"><span class="label">Style</span></div>
            <div class="seg wrap">
              <button v-for="st in uiStyles" :key="st.key" :class="{ active: uiStyle === st.key }" @click="uiStyle = st.key">{{ st.label }}</button>
            </div>
            <div class="card-head colour-head"><span class="label">Colour</span></div>
            <div class="swatches">
              <button
                v-for="c in uiColors"
                :key="c.key"
                class="swatch"
                :class="{ on: uiColor === c.key }"
                :style="{ background: c.swatch }"
                :title="c.label"
                :aria-label="c.label"
                @click="uiColor = c.key"
              ></button>
            </div>
          </section>

          <details class="card parts">
            <summary>Show on timer page</summary>
            <div class="toggle-list">
              <label v-for="o in displayOptions" :key="o.key" class="switch-row">
                <span>{{ o.label }}</span>
                <input type="checkbox" v-model="display[o.key]" />
              </label>
            </div>
          </details>
        </template>
      </main>

      <!-- Study -->
      <main v-else-if="menu === 'study'" class="screen lab">
        <header class="lab-hero">
          <div class="lab-kicker">Study</div>
          <div class="lab-title">Flashcards</div>
        </header>

          <section class="study-head">
            <div class="ring-mini">
              <svg viewBox="0 0 80 80">
                <circle class="ring-track" cx="40" cy="40" r="34" />
                <circle class="ring-value" cx="40" cy="40" r="34" :stroke-dasharray="studyRing.dash" :stroke-dashoffset="studyRing.offset" />
              </svg>
              <span>{{ studyLearnedCount }}</span>
            </div>
            <div class="study-meta">
              <div class="seg wide">
                <button :class="{ active: studyFamily === 'oll' }" @click="setFamily('oll')">OLL</button>
                <button :class="{ active: studyFamily === 'pll' }" @click="setFamily('pll')">PLL</button>
              </div>
              <div class="muted small">{{ studyLearnedCount }} of {{ studyCases.length }} learned</div>
            </div>
          </section>

          <button v-if="studyCurrent" class="flashcard" :class="{ flipped: studyRevealed }" @click="studyRevealed = !studyRevealed">
            <template v-if="!studyRevealed">
              <span class="fc-kicker">{{ studyCurrent.subset }}</span>
              <span class="fc-name">{{ studyCurrent.name }}</span>
              <span class="fc-hint">Tap to reveal</span>
            </template>
            <template v-else>
              <span class="fc-kicker">Algorithm</span>
              <span class="fc-alg">{{ studyCurrent.algs[0] }}</span>
              <span class="fc-hint">Tap to hide</span>
            </template>
          </button>
          <div v-else class="flashcard empty-card">Pick a case below, or shuffle one.</div>

          <div class="fc-actions" v-if="studyCurrent">
            <button class="again" @click="nextStudyCase()"><i class="fas fa-redo"></i> Again</button>
            <button class="got" :class="{ on: isLearned(studyCurrent.id) }" @click="toggleLearned(studyCurrent.id)">
              <i :class="isLearned(studyCurrent.id) ? 'fas fa-check' : 'far fa-circle'"></i>
              {{ isLearned(studyCurrent.id) ? 'Learned' : 'Got it' }}
            </button>
            <button class="shuffle" @click="pickRandomCase()"><i class="fas fa-random"></i></button>
          </div>

          <div v-if="studyCurrent && studyCurrent.algs.length > 1" class="alts">
            <div class="alts-label">Other algorithms</div>
            <p v-for="(a, i) in studyCurrent.algs.slice(1)" :key="i" class="alt-alg">{{ a }}</p>
          </div>

          <section class="board">
            <button
              v-for="c in studyCases"
              :key="c.id"
              class="cell"
              :class="{ learned: isLearned(c.id), current: studyCase === c.id }"
              @click="selectCase(c.id)"
            >{{ shortName(c) }}</button>
          </section>

          <section class="card blind">
            <div class="card-head">
              <span class="label">Blind mode</span>
              <span class="badge">Coming soon</span>
            </div>
            <p class="muted small">Solve from a memorised scramble with the timer hidden. Not built yet.</p>
          </section>
      </main>

      <!-- Settings -->
      <main v-else class="screen">
        <section class="card">
          <div class="card-head"><span class="label">Profile</span></div>
          <label class="name-field">
            <span>Name</span>
            <input type="text" class="input-field" v-model="userName" placeholder="Your name" maxlength="30" />
          </label>
          <div class="actions cloud-actions">
            <button @click="saveCloud()"><i class="fas fa-cloud-upload-alt"></i> Save to cloud</button>
            <button @click="loadCloud()"><i class="fas fa-cloud-download-alt"></i> Load from cloud</button>
          </div>
          <p class="muted small" v-if="cloudStatus">{{ cloudStatus }}</p>
        </section>

        <section class="card">
          <div class="card-head"><span class="label">Goals</span></div>
          <div class="form">
            <label><span>Session</span><input type="number" class="input-field" v-model="sessionGoal" /></label>
            <label><span>Daily</span><input type="number" class="input-field" v-model="dailyGoal" /></label>
            <label><span>Weekly</span><input type="number" class="input-field" v-model="weeklyGoal" /></label>
            <label><span>Total</span><input type="number" class="input-field" v-model="totalGoal" /></label>
          </div>
        </section>

        <section class="card">
          <div class="card-head"><span class="label">Data</span></div>
          <div class="action-rows">
            <button class="row-btn" @click="downloadResults()"><i class="fas fa-file-export"></i> Export JSON</button>
            <button class="row-btn" @click="deleteFastest()"><i class="fas fa-trash-alt"></i> Delete fastest solve</button>
            <button class="row-btn danger" @click="clearTheLocal()"><i class="fas fa-exclamation-triangle"></i> Clear all solves</button>
          </div>
        </section>
      </main>

      <nav class="tabbar">
        <button :class="{ active: menu === 'timer' }" @click="menu = 'timer'"><i class="fas fa-stopwatch"></i><span>Timer</span></button>
        <button :class="{ active: menu === 'stats' }" @click="menu = 'stats'"><i class="fas fa-chart-line"></i><span>Stats</span></button>
        <button :class="{ active: menu === 'study' }" @click="menu = 'study'"><i class="fas fa-graduation-cap"></i><span>Study</span></button>
        <button :class="{ active: menu === 'lab' }" @click="menu = 'lab'"><i class="fas fa-flask"></i><span>Lab</span></button>
        <button :class="{ active: menu === 'settings' }" @click="menu = 'settings'"><i class="fas fa-cog"></i><span>Settings</span></button>
      </nav>
    </template>
  </div>
</template>

<script>

var moment = require('moment'); // require
moment().format(); 
var soundStart = new Audio(`/audio/263133__pan14__tone-beep.m4a`);
import SolveChart from './components/SolveChart.vue'
import { OLL_CASES, PLL_CASES } from './data/study.js'
import { loadJSON, saveJSON } from './utils/storage.js'
import { UI_STYLES, COLOR_THEMES } from './data/styles.js'
import { playReady, playFinish } from './utils/sounds.js'
import { rollingAverage, bestOf, mean, stdDev, median, histogram, dailyCounts, heatmapDays } from './utils/solveStats.js'

// import Vue3autocounter from 'vue3-autocounter';
import db from "./firebase.js"

export default {
  components: {
    SolveChart,
  },
  

  data(){
    return{
      fireData:[],
      userNum: 0,


      labRange: 100,
      displayOptions: [
        { key: 'scramble', label: 'Scramble' },
        { key: 'rings', label: 'Goal rings' },
        { key: 'recent', label: 'Recent solves' },
        { key: 'aoLine', label: 'AO5 / AO12 / best' },
      ],
      display: loadJSON('cube-display', { scramble: true, rings: true, recent: true, aoLine: true }),
      studyFamily: 'oll',
      studyCase: null,
      studyRevealed: false,
      heatRange: 'm3',
      heatSelected: new Date().toDateString(),
      heatOptions: [
        { key: 'm3', label: '3M', days: 91 },
        { key: 'm6', label: '6M', days: 182 },
        { key: 'm12', label: '12M', days: 365 },
        { key: 'all', label: 'All', days: null },
      ],
      userName: loadJSON('cube-user', ''),
      cloudStatus: '',
      uiStyle: loadJSON('cube-style-v2', 'zen'),
      uiStyles: UI_STYLES,
      uiColor: loadJSON('cube-color', 'sky'),
      uiColors: COLOR_THEMES,
      timerFont: loadJSON('cube-font', 'sans'),
      timerSize: loadJSON('cube-size', 'm'),
      holdDelay: loadJSON('cube-hold', 750),
      soundOn: loadJSON('cube-sound', true),
      timerFonts: [
        { key: 'sans', label: 'Sans' },
        { key: 'serif', label: 'Serif' },
        { key: 'mono', label: 'Mono' },
      ],
      timerSizes: [
        { key: 's', label: 'S' },
        { key: 'm', label: 'M' },
        { key: 'l', label: 'L' },
      ],
      holdOptions: [
        { ms: 500, label: '0.5 s' },
        { ms: 750, label: '0.75 s' },
        { ms: 1000, label: '1 s' },
      ],
      labTab: 'insights',
      studyLearned: loadJSON('cube-study-learned', {}),

      settingUptimer: undefined,
      pressing :false,
      isTimerRunning: false,
      Crimson: 'Crimson',
      
      TimerReady: false,
      pastAlgs: [],
      showAnalysis: false,
      showingList: '',


      results: [],
      reverseResults: [],
      message:"Hello",
      imadesho: false,

      showingLast2k: false,


      AOSum: null, 
      AOMax: null,
      AOMin: null,
      AOAve: null,
      AOData: null,

      currentTime: null,
      callCount: 0,
      AOLoopCount: null,



      sessionGoal: 25,
      sessionCount: 0,
      totalGoal: 1000,
      totalCount: 0,
      dailyGoal: 150,
      dailyCount: 0,
      weeklyGoal: 500,
      weeklyCount: 0,
      startOfTheDay: new Date().setHours(0,0,0,0),
      timeStampsList: [],
      prevMonday: 0,


      whichInput: 'default',
      menu: 'timer',
      whichStats: 'chart',
      goalData: {
        session: null,
        daily: null,
        weekly: null,
        total: null,
      },
      

      time: '0.00',
      timeBegan: null,
      timeStopped: null,
      stoppedDuration: 0,
      started: null,
      running: false,



      randomAlg: null,
      randomNum: null,
      lastLetter: '',
      currentLetter: null,
      additionalletter: null,
      ShuffleCount: 0,
      flag: false,


      bestTime: null,
      WholeDataOfOutcome: [],
      WholeDataOfFive: [],
      WholeDataOfTwelve: [],

      showingIndex: null,

      chartRange: 1000,
      chartRanges: [
        { label: '100', value: 100 },
        { label: '1k', value: 1000 },
        { label: 'All', value: 0 },
      ],
      chartToggles: [
        { key: 'single', label: 'Single', color: '#8b93a7' },
        { key: 'ao5', label: 'AO5', color: '#4fd1c5' },
        { key: 'ao12', label: 'AO12', color: '#f6ad55' },
        { key: 'ao25', label: 'AO25', color: '#b794f4' },
        { key: 'ao100', label: 'AO100', color: '#fc8181' },
      ],
      chartShow: { single: true, ao5: true, ao12: false, ao25: true, ao100: false },

      countingUpSeconds: 0,
      countingUpMinutes: 0,
      countingUpHours: 0,
      // moreThanSeconds: false,
      moreThanMinutes: false,
      countingUpTimer: 0,
      showingTimer: '00:00',
      second: 0,
      minute: 0,
      hours: 0,
      
      currentList: [],


      
      

      form: {
        email: "",
        password: ""
      },


    }
  },

  methods:{
    startCounting(){
      
      // let theMaxSeconds = 60 * 60 * 2
      

      if(this.hours < 2) {
        setTimeout(() => {
          this.second++

          if(this.second == 60){
            this.second = 0
            this.minute++
          }


          if(this.minute == 60){
            this.minute =0
            this.hours++ 
          }

          if(this.minute < 10){
            this.showingTimer = `${this.hours}:0${this.minute}`
          }else{
            this.showingTimer = `${this.hours}:${this.minute}`
          }


          if(this.second < 10){
            this.showingTimer = `${this.showingTimer}:0${this.second}`
          }else{
            this.showingTimer = `${this.showingTimer}:${this.second}`
          }

          // this.showingTimer = `${this.hours}:${this.minute}:${this.second}`
          this.startCounting()
        }, 1000)
      }
      // 
      // for (let i = 1; i < theMaxSeconds; i++) {
      //   setTimeout(function timer() {
      //     console.log(i);
      //     this.countingUpTimer = i
      //   }, i * 1000);
      //   // this.countingUpTimer = i
      // }
      // var i = 1;                  //  set your counter to 1

      // function myLoop() {         //  create a loop function
      //   setTimeout(function() {   //  call a 3s setTimeout when the loop is called
      //     console.log('hello');   //  your code here
      //     i++;                    //  increment the counter
      //     if (i < 10) {           //  if the counter < 10, call the loop function
      //       myLoop();             //  ..  again which will trigger another 
      //     }                       //  ..  setTimeout()
      //   }, 3000)
      // }

      // myLoop();   

      
    },



    // ---------------------------------------
    applyTheme(){
      const root = document.documentElement.style
      root.cssText = ''
      const fonts = {
        sans: this.currentStyle.vars['--timer-font'],
        serif: '"Hiragino Mincho ProN", "Noto Serif JP", Georgia, serif',
        mono: this.currentStyle.vars['--mono'],
      }
      const sizes = {
        s: 'clamp(48px, 18vw, 96px)',
        m: 'clamp(64px, 24vw, 128px)',
        l: 'clamp(80px, 30vw, 168px)',
      }
      const vars = {
        ...this.currentStyle.vars,
        ...this.activeColor.vars,
        '--timer-font': fonts[this.timerFont] || fonts.sans,
        '--timer-size': sizes[this.timerSize] || sizes.m,
      }
      Object.entries(vars).forEach(([name, value]) => root.setProperty(name, value))
    },
    saveCloud(silent = false){
      const name = (this.userName || '').trim()
      if (!name) {
        if (!silent) this.cloudStatus = 'Enter a name first.'
        return
      }
      this.cloudStatus = 'Saving…'
      db.collection('cube-solves').doc(name).set({ name, results: this.results, updatedAt: Date.now() })
        .then(() => { this.cloudStatus = `Saved ${this.results.length} solves for ${name}.` })
        .catch(e => { this.cloudStatus = `Save failed: ${e.message}` })
    },
    loadCloud(){
      const name = (this.userName || '').trim()
      if (!name) {
        this.cloudStatus = 'Enter a name first.'
        return
      }
      if (!confirm(`Replace the solves on this device with the cloud copy for "${name}"?`)) return
      this.cloudStatus = 'Loading…'
      db.collection('cube-solves').doc(name).get()
        .then(doc => {
          if (!doc.exists) {
            this.cloudStatus = `No cloud save for ${name} yet.`
            return
          }
          this.results = doc.data().results || []
          localStorage.results = JSON.stringify(this.results)
          this.totalCount = this.results.length
          this.getTheBest()
          this.cloudStatus = `Loaded ${this.results.length} solves for ${name}.`
        })
        .catch(e => { this.cloudStatus = `Load failed: ${e.message}` })
    },
    setFamily(family){
      this.studyFamily = family
      this.studyCase = null
      this.studyRevealed = false
    },
    shortName(c){
      return c.name.replace(/ Permutation$/, '').replace(/^OLL /, '')
    },
    isLearned(id){
      return !!this.studyLearned[`${this.studyFamily}:${id}`]
    },
    toggleLearned(id){
      const key = `${this.studyFamily}:${id}`
      if (this.studyLearned[key]) {
        delete this.studyLearned[key]
      } else {
        this.studyLearned[key] = true
      }
    },
    setHeatRange(key){
      this.heatRange = key
      this.$nextTick(() => {
        const el = document.querySelector('.heat-scroll')
        if (el) el.scrollLeft = el.scrollWidth
      })
    },
    selectCase(id){
      this.studyCase = id
      this.studyRevealed = false
    },
    nextStudyCase(){
      const list = this.studyCases
      const i = list.findIndex(c => c.id === this.studyCase)
      this.selectCase(list[(i + 1) % list.length].id)
    },
    pickRandomCase(){
      const pool = this.studyCases.filter(c => !this.isLearned(c.id))
      const source = pool.length ? pool : this.studyCases
      this.selectCase(source[Math.floor(Math.random() * source.length)].id)
    },

    startTimer() {
      this.pressing = true
      // this.isTimerRunning = true

      setTimeout(() =>{
        if(this.pressing){
        console.log('ready to start timer')
        this.isTimerRunning = true
        if(this.soundOn) playReady()
      }else{
        console.log('not longe nough')
        this.isTimerRunning = false
      } 
      },this.holdDelay)
    },

    // toggleSwitch(){
      
    // },

    stopTimer(){
      this.pressing = false

      // this.isTimerRunning = false
      if(this.isTimerRunning){
        this.csTimer()
      }else{
        //
      }

      this.isTimerRunning = false
    },


    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    },

    checkCounts(){
      let i = 0;
      this.timeStampsList = []
      while(i < this.results.length){
        this.timeStampsList.push(this.results[i].time)
        if(this.results[i].time > this.startOfTheDay){
          this.dailyCount++;
        }
        if(this.results[i].time > this.prevMonday){
          this.weeklyCount++;
        }
        i++;
      }
      // console.log(this.timeStampsList);
    },
    getThePreviousMonday(){
      var date = new Date();
      var day = date.getDay();
      this.prevMonday = new Date();
      if(date.getDay() == 0){
        this.prevMonday.setDate(date.getDate() - 7);
      }
      else{
        this.prevMonday.setDate(date.getDate() - (day-1));
      }
      this.prevMonday.setHours(0,0,0,0),
      this.prevMonday = new Date(this.prevMonday).setHours(0,0,0,0)
    },
    clearTheLocal(){
      // sound10Seconds.play()
      let r= confirm('Are you sure you want to do clear the data?');
      if(!r){
        return;
      }
      this.results = [];
      this.sessionCount++
      this.sessionCount= 0
      localStorage.results = JSON.stringify(this.results);
      // localStorage.wholeAOData = JSON.stringify(this.wholeAOData);
      this.totalCount = 0;

    },


    algShuffle(){
      // console.log('shuffling')
      
      this.randomNum = Math.random(this.randomNum);
      this.ShuffleCount = 0;
      this.randomAlg = ''


      while(this.ShuffleCount < 22){

        this.randomNum = Math.random(this.randomNum);

        if(this.randomNum < 0.166){
          this.currentLetter = 'R'
        }else if(this.randomNum < 0.333){
          this.currentLetter = 'L'
        }else if(this.randomNum < 0.464){
          this.currentLetter = 'U'
        }else if(this.randomNum < 0.664){
          this.currentLetter = 'D'
        }else if(this.randomNum < 0.83){
          this.currentLetter = 'F'
        }else if(this.randomNum <= 1 ){
          this.currentLetter = 'B'
        }

        if(this.currentLetter !== this.lastLetter){
          // console.log(this.currentLetter)

          this.lastLetter = this.currentLetter;
          this.randomNum = Math.random(this.randomNum);

          if(this.randomNum < 0.5){ 
            this.additionalletter = '2 '
          }else if(this.randomNum < 0.75){
            this.additionalletter = `' `
          }else if(this.randomNum <= 1){
            this.additionalletter = ' '
          }
          // console.log(this.additionalletter)
          
          this.randomAlg = this.randomAlg+ this.currentLetter + this.additionalletter

          this.ShuffleCount++;
        }
        
      }

      switch(this.randomNum){
        case (this.randomNum < 0.166):
          this.currentLetter = 'R'
          break;

        case (this.randomNum < 0.333):
          this.currentLetter = 'L'
          break;

        case (this.randomNum < 0.464):
          this.currentLetter = 'U'
          break;
         
        case (this.randomNum < 0.664):
          this.currentLetter = 'D'
          break;
         
        case (this.randomNum < 0.83):
          this.currentLetter = 'F'
          break;
         
        case (this.randomNum < 1):
          this.currentLetter = 'B'
          break;
      }

      this.pastAlgs.unshift(this.randomAlg);
      if(this.pastAlgs.length> 4){
        this.pastAlgs.pop()
      }
      
      
      
    },
    inputTime(){
      
      if(this.currentTime >= 100 && this.currentTime <= 1000 ){
        this.currentTime = this.currentTime/10
      }else if(this.currentTime >= 100 && this.currentTime <= 10000 ){
        this.currentTime = this.currentTime/100
      }

      this.results.push({time: Date.now(),outcome: Number(this.currentTime) });
      this.currentTime = null

      this.sessionCount++;
      this.totalCount = this.results.length;
      console.log(this.results.length)
      
      // console.log(this.results)
    },
    practice(){
      // array.splice(index, 1);
      console.log(this.results)
      this.results.splice(13,1);
      console.log(this.results)
    },
    getTheBest(){
      let countBest = 0
      this.WholeDataOfOutcome = [];
      this.WholeDataOfFive = [];
      this.WholeDataOfTwelve = [];

      while( countBest < this.results.length ){
        this.WholeDataOfOutcome.push(this.results[countBest].outcome)
        // this.AOData.push(this.results[index - this.AOLoopCount].outcome)
        countBest++
      }

      this.bestTime = Math.min( ...this.WholeDataOfOutcome)
      // console.log(this.WholeDataOfOutcome)
    },

    csTimer(){
      if(this.running){
        this.running = false;
        this.timeStopped = new Date();
        clearInterval(this.started);
        
        this.results.push({time: Date.now(),outcome: Number(this.time) });
        if(this.soundOn) playFinish(Number(this.time))
        if(this.userName && this.results.length % 10 === 0) this.saveCloud(true)
        // this.currentTime = null

        this.sessionCount++;
        this.dailyCount++;
        this.weeklyCount++
        // this.updateAO(); 
                this.totalCount = this.results.length;
        this.getTheBest();
        this.algShuffle();
        // localStorage.results = this.results;
        console.log('updating')

        return;
      }else{
        if(this.soundOn) soundStart.play();
        clearInterval(this.started);
        this.stoppedDuration = 0;
        this.timeBegan = null;
        this.timeStopped = null;
        this.time = "0.000";


        if(this.running) return;
        if (this.timeBegan === null) {
          this.reset();
          this.timeBegan = new Date();
        }

        if (this.timeStopped !== null) {
          this.stoppedDuration += (new Date() - this.timeStopped);
        }

        this.started = setInterval(this.clockRunning, 10);	
        this.running = true;
        return;
      }

    },
    incrementCount(){
      this.totalCount = this.results.length;
      this.sessionCount++;

    },  



    start() {
      if(this.running) return;
      
      if (this.timeBegan === null) {
        this.reset();
        this.timeBegan = new Date();
      }

      if (this.timeStopped !== null) {
        this.stoppedDuration += (new Date() - this.timeStopped);
      }

      this.started = setInterval(this.clockRunning, 10);	
      this.running = true;
    },
    stop() {
      this.running = false;
      this.timeStopped = new Date();
      clearInterval(this.started);
    },
    reset() {
      this.running = false;
      clearInterval(this.started);
      this.stoppedDuration = 0;
      this.timeBegan = null;
      this.timeStopped = null;
      this.time = "00:00:00.000";
    },
    clockRunning(){
      let currentTime = new Date(),
      timeElapsed = new Date(currentTime - this.timeBegan - this.stoppedDuration),
      // hour = timeElapsed.getUTCHours(),
      // min = timeElapsed.getUTCMinutes(),
      sec = timeElapsed.getUTCSeconds(),
      ms = timeElapsed.getUTCMilliseconds();

      this.time = 
        // this.zeroPrefix(hour, 2) + ":" + 
        // this.zeroPrefix(min, 2) + ":" + 
        this.zeroPrefix(sec, 2) + "." + 
        this.zeroPrefix(ms, 2);
      this.time = Number(this.time)
    },
    zeroPrefix(num, digit) {
      var zero = '';
      for(var i = 0; i < digit; i++) {
        zero += '0';
      }
      return (zero + num).slice(-digit);
    },


    addRandomData(num){
      console.log('getting random data')
      let randomNum = Math.random();
      let i =0
      randomNum = randomNum * 30;
      while(i<num){
        randomNum = Math.random();
        randomNum = randomNum * 20;
        randomNum = parseFloat(randomNum.toFixed(2))
        this.results.push({time: Date.now(),outcome: randomNum });
                i++

      }
      console.log(this.results)



    },
    showSomeData(){
      console.log(this.AO5Data)
    },
    showList(name){
      if(this.showAnalysis && this.showingList === name) return this.showAnalysis = false;
      this.currentList = []
      
      if(name === "fast") {
          // sort all results by outcome (fastest first)
          const sorted = [...this.results].sort((a, b) => a.outcome - b.outcome);

          
          // take the top 50
          const top50 = sorted.slice(0, 50);

          // push into currentList with index
          top50.forEach((item, idx) => {
              this.currentList.push({ index: idx + 1, outcome: item.outcome });
          });
      }

      if(name == "last"){
        let i = 0;
        let iii = this.results.length -1;
        while(i < 50 && iii >=0){
          this.currentList.push({index: iii +1, outcome: this.results[iii].outcome})
          i++;
          iii--;
        }
      }



      
      this.showingList = name
      this.showAnalysis = true;

    },

    deleteFastest(){
      // find fastest index
      let fastestIndex = this.results
            .map((r, i) => ({ time: r.outcome, index: i }))
            .sort((a, b) => a.time - b.time)[0].index;

      // confirm
      let ok = confirm(
            `Delete fastest record?\n` +
            `Index: ${fastestIndex + 1}\n` +
            `Time: ${this.results[fastestIndex].outcome}`
      );
      if(!ok) return;

      // use your existing delete logic
      this.deleteData(fastestIndex);
    },

    downloadResults() {
        // convert to JSON string
        const jsonStr = JSON.stringify(this.results, null, 4); // pretty print
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // create temporary link to trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'results.json';
        link.click();

        // cleanup
        URL.revokeObjectURL(url);
    }

    

  },

  created() {
    this.startCounting()

    this.algShuffle();

    db.collection("nisino25-cube")
     .get()
     .then((querySnapshot) => {
       querySnapshot.forEach((doc) => {
        //  console.log(`${doc.id} => ${doc.data().TotalNum}`)
         this.fireData.push(doc.data().TotalNum)
         this.userNum = doc.data().TotalNum + 1
       })
     })



    //  this.addRandomData(100)

    
    
  },
  mounted() {
    if (localStorage.results) {
      this.results = JSON.parse(localStorage.results);  
      console.log('getting data')
      this.totalCount = this.results.length
      // this.updateAO();
      this.getTheBest();
      this.getThePreviousMonday();
      this.checkCounts();
      this.showingIndex = this.results.length

    }
    if(localStorage.goalData){
      this.goalData = JSON.parse(localStorage.goalData);
      if(this.goalData.session > 0){
        this.sessionGoal = this.goalData.session
      }
      if(this.goalData.daily > 0){
        this.dailyGoal = this.goalData.daily
      }
      if(this.goalData.weekly > 0){
        this.weeklyGoal = this.goalData.weekly
      }
      if(this.goalData.total > 0){
        this.totalGoal = this.goalData.total
      }
    }
    // console.log(this.results.length) 

    // this.addRandomData(1000)
    console.log(this.results.length)


    
  },
  watch: {
    uiStyle: {
      immediate: true,
      handler(key){
        saveJSON('cube-style-v2', key)
        this.applyTheme()
      },
    },
    uiColor: {
      handler(key){
        saveJSON('cube-color', key)
        this.applyTheme()
      },
    },
    timerFont: {
      handler(key){
        saveJSON('cube-font', key)
        this.applyTheme()
      },
    },
    timerSize: {
      handler(key){
        saveJSON('cube-size', key)
        this.applyTheme()
      },
    },
    holdDelay(v){ saveJSON('cube-hold', v) },
    userName(v){ saveJSON('cube-user', v) },
    soundOn(v){ saveJSON('cube-sound', v) },
    menu: {
      immediate: true,
      handler(v){
        document.documentElement.classList.toggle('timer-locked', v === 'timer')
      },
    },
    display: {
      handler(v){ saveJSON('cube-display', v) },
      deep: true,
    },
    studyLearned: {
      handler(v){ saveJSON('cube-study-learned', v) },
      deep: true,
    },
    sessionCount: function() {
      localStorage.results = JSON.stringify(this.results);
      this.showingIndex = this.results.length
    },
    sessionGoal: function(){
      this.sessionGoal = parseInt(this.sessionGoal)
      this.goalData.session = this.sessionGoal
      localStorage.goalData = JSON.stringify(this.goalData);
    },
    dailyGoal: function(){
      this.dailyGoal = parseInt(this.dailyGoal)
      this.goalData.daily = this.dailyGoal
      localStorage.goalData = JSON.stringify(this.goalData);
    },
    weeklyGoal: function(){
      this.weeklyGoal = parseInt(this.weeklyGoal)
      this.goalData.weekly = this.weeklyGoal
      localStorage.goalData = JSON.stringify(this.goalData);
    },
    totalGoal: function(){
      this.totalGoal = parseInt(this.totalGoal)
      this.goalData.total = this.totalGoal
      localStorage.goalData = JSON.stringify(this.goalData);
    },
    settingUptimer: function(){
      console.log(this.settingUptimer)
    },
    userNum(){
      // console.log('just ogt data')
        const ref = db.collection('nisino25-cube')
        ref.doc('8CKObNnyitQVBrRvt342').update({
          TotalNum: this.userNum
          // TotalNum: 200 
        })
      // console.log('Sent data now')
    },
    

  
  },
  computed:{
    sampleMoves(){
      return [
        ["R", "U'", "R2", "F", "D'", "B2", "L", "U2", "R'", "D", "F2"],
        ["B'", "L2", "D", "R'", "U", "F'", "B", "L'", "D2", "R", "U2"],
      ]
    },
    sampleChips(){
      return ['10.92', '9.58', '10.30', '10.82']
    },
    sampleRings(){
      const circ = 2 * Math.PI * 34
      return [
        { label: 'Session', count: 9, goal: 25, pct: 0.36 },
        { label: 'Daily', count: 17, goal: 150, pct: 0.11 },
        { label: 'Weekly', count: 96, goal: 500, pct: 0.19 },
        { label: 'Total', count: 301, goal: 1000, pct: 0.3 },
      ].map(r => ({ ...r, dash: circ, offset: circ * (1 - r.pct) }))
    },
    currentStyle(){
      return UI_STYLES.find(st => st.key === this.uiStyle) || UI_STYLES[0]
    },
    activeColor(){
      return COLOR_THEMES.find(c => c.key === this.uiColor) || COLOR_THEMES[0]
    },
    styleCards(){
      return UI_STYLES.map(st => ({ ...st, merged: { ...st.vars, ...this.activeColor.vars } }))
    },
    labTabTitle(){
      return { insights: 'Your numbers', display: 'Timer page' }[this.labTab]
    },
    studyRing(){
      const circ = 2 * Math.PI * 34
      const pct = this.studyCases.length ? this.studyLearnedCount / this.studyCases.length : 0
      return { dash: circ, offset: circ * (1 - pct) }
    },
    heatOption(){
      return this.heatOptions.find(o => o.key === this.heatRange) || this.heatOptions[0]
    },
    heatMonthLabels(){
      const cells = this.labHeat.cells
      const cols = Math.ceil(cells.length / 7)
      const labels = []
      let last = null
      for (let c = 0; c < cols; c++) {
        const first = cells.slice(c * 7, c * 7 + 7).find(d => d)
        if (!first) { labels.push(''); continue }
        const month = first.date.getMonth()
        labels.push(month !== last ? first.date.toLocaleString('en-US', { month: 'short' }) : '')
        last = month
      }
      return labels
    },
    heatPicked(){
      const key = this.heatSelected
      const day = this.labHeat.cells.find(d => d && d.date.toDateString() === key)
      if (!day) return null
      return { ...day, label: day.date.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) }
    },
    labHeat(){
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      let start
      if (this.heatOption.days) {
        start = new Date(today)
        start.setDate(today.getDate() - (this.heatOption.days - 1))
      } else {
        const first = this.results.length ? Math.min(...this.results.map(r => r.time)) : Date.now()
        start = new Date(first)
        start.setHours(0, 0, 0, 0)
      }
      return heatmapDays(this.results, start, today)
    },
    studyCases(){
      return this.studyFamily === 'oll' ? OLL_CASES : PLL_CASES
    },
    studyCurrent(){
      return this.studyCases.find(c => c.id === this.studyCase) || null
    },
    studyLearnedCount(){
      return this.studyCases.filter(c => this.isLearned(c.id)).length
    },
    scrambleRows(){
      const moves = this.randomAlg ? this.randomAlg.trim().split(/\s+/) : []
      const mid = Math.ceil(moves.length / 2)
      return [moves.slice(0, mid), moves.slice(mid)]
    },
    labStart(){
      return this.labRange ? Math.max(0, this.results.length - this.labRange) : 0
    },
    labOutcomes(){
      return this.outcomes.slice(this.labStart)
    },
    labStdDev(){
      const v = stdDev(this.labOutcomes)
      return v === null ? null : v.toFixed(2)
    },
    labMedian(){
      const v = median(this.labOutcomes)
      return v === null ? null : v.toFixed(2)
    },
    labHist(){
      return histogram(this.labOutcomes)
    },
    labDaily(){
      return dailyCounts(this.results, 14)
    },
    labDailyMax(){
      return Math.max(1, ...this.labDaily.map(d => d.count))
    },
    labToday(){
      return this.labDaily[this.labDaily.length - 1].count
    },
    labPerDay(){
      return Math.round(this.labDaily.reduce((sum, d) => sum + d.count, 0) / 14)
    },
    rings(){
      const circ = 2 * Math.PI * 34
      return [
        { label: 'Session', count: this.sessionCount, goal: this.sessionGoal },
        { label: 'Daily', count: this.dailyCount, goal: this.dailyGoal },
        { label: 'Weekly', count: this.weeklyCount, goal: this.weeklyGoal },
        { label: 'Total', count: this.results.length, goal: this.totalGoal },
      ].map(r => {
        const pct = r.goal > 0 ? Math.min(1, r.count / r.goal) : 0
        return { ...r, dash: circ, offset: circ * (1 - pct), done: r.goal > 0 && r.count >= r.goal }
      })
    },
    recentIdx(){
      const last = this.results.length - 1
      const idx = []
      for (let k = last; k >= Math.max(0, last - 4); k--) idx.push(k)
      return idx
    },
    tableIdx(){
      const last = this.results.length - 1
      const idx = []
      for (let k = last; k >= Math.max(0, last - 99); k--) idx.push(k)
      return idx
    },
    overallMean(){
      if (this.results.length === 0) return '—'
      return mean(this.outcomes).toFixed(2)
    },
    outcomes(){
      return this.results.map(r => r.outcome)
    },
    AO5Data(){
      return rollingAverage(this.outcomes, 5)
    },
    AO12Data(){
      return rollingAverage(this.outcomes, 12)
    },
    AO25Data(){
      return rollingAverage(this.outcomes, 25)
    },
    AO100Data(){
      return rollingAverage(this.outcomes, 100)
    },
    bestAO5(){
      return bestOf(this.AO5Data)
    },
    bestAO12(){
      return bestOf(this.AO12Data)
    },
    bestAO25(){
      return bestOf(this.AO25Data)
    },
    bestAO100(){
      return bestOf(this.AO100Data)
    },
    miniStart(){
      return Math.max(0, this.results.length - 100)
    },
    miniSolves(){
      return this.outcomes.slice(this.miniStart)
    },
    miniSeries(){
      return [
        { label: 'Single', color: '#8b93a7', width: 1.5, values: this.miniSolves },
        { label: 'AO5', color: '#4fd1c5', values: this.AO5Data.slice(this.miniStart) },
      ]
    },
    chartStart(){
      return this.chartRange ? Math.max(0, this.results.length - this.chartRange) : 0
    },
    chartSolves(){
      return this.outcomes.slice(this.chartStart)
    },
    chartSeries(){
      const source = {
        single: this.outcomes,
        ao5: this.AO5Data,
        ao12: this.AO12Data,
        ao25: this.AO25Data,
        ao100: this.AO100Data,
      }
      return this.chartToggles
        .filter(t => this.chartShow[t.key])
        .map(t => ({
          label: t.label,
          color: t.color,
          width: t.key === 'single' ? 1.5 : 2,
          values: source[t.key].slice(this.chartStart),
        }))
    },
    currentColor: function (){
      if(this.TimerReady){
        return 'red'
      }else{
        return ''
      }
    },
    textLength(){
      return this.message.length;
    },
    currentAngle(){
      // console.log(Math.floor(360*this.textLength/144));
      return Math.floor(360*this.textLength/144);
    },  
    rightAngle(){
      let angle = Math.min(this.currentAngle, 180);
      return {
        "transform": "rotate(" + angle + "deg)",
      }
    },
    leftAngle(){
      let angle = Math.min(Math.max(this.currentAngle-180, 0),180);
      return {
        "transform": "rotate(" + angle + "deg)",
      }
    },
    styles(){
      let width = this.message.length/144*100
      return {
        "border": "5px solid red",
        "width": width + '%'
      }
    },
    


    angleSession(){
      return Math.floor(360*this.sessionCount/this.sessionGoal);
    },
    rightAngleSession(){
      let angle = Math.min(this.angleSession, 180);
      return {
        "transform": "rotate(" + angle + "deg)",
      }
    },
    leftAngleSession(){
      let angle = Math.min(Math.max(this.angleSession-180, 0),180);
      return {
        "transform": "rotate(" + angle + "deg)",
      }
    },
    stylesSession(){
      let width = this.sessionCount.length/this.sessionGoal*100
      return {
        "border": "5px solid red",
        "width": width + '%'
      }
    },



    angleTotal(){
      return Math.floor(360*this.results.length/this.totalGoal);
      // return 0;
    },
    rightAngleTotal(){
      let angle = Math.min(this.angleTotal, 180);
      return {
        "transform": "rotate(" + angle + "deg)",
      }
    },
    leftAngleTotal(){
      let angle = Math.min(Math.max(this.angleTotal-180, 0),180);
      return {
        "transform": "rotate(" + angle + "deg)",
      }
    },
    stylesTotal(){
      let width = this.results.length.length/this.totalGoal*100
      return {
        "border": "5px solid red",
        "width": width + '%'
      }
    },

    angleDaily(){
      return Math.floor(360*this.dailyCount/this.dailyGoal);
      // return 0;
    },
    rightAngleDaily(){
      let angle = Math.min(this.angleDaily, 180);
      return {
        "transform": "rotate(" + angle + "deg)",
      }
    },
    leftAngleDaily(){
      let angle = Math.min(Math.max(this.angleDaily-180, 0),180);
      return {
        "transform": "rotate(" + angle + "deg)",
      }
    },
    stylesDaily(){
      let width = this.dailyCount/this.dailyGoal*100
      return {
        "border": "5px solid red",
        "width": width + '%'
      }
    },




    angleWeekly(){
      return Math.floor(360*this.weeklyCount/this.weeklyGoal);
      // return 0;
    },
    rightAngleWeekly(){
      let angle = Math.min(this.angleWeekly, 180);
      return {
        "transform": "rotate(" + angle + "deg)",
      }
    },
    leftAngleWeekly(){
      let angle = Math.min(Math.max(this.angleWeekly-180, 0),180);
      return {
        "transform": "rotate(" + angle + "deg)",
      }
    },
    stylesWeekly(){
      let width = this.weeklyCount/this.weeklyGoal*100
      return {
        "border": "5px solid red",
        "width": width + '%'
      }
    },
    
    formattedElapsedTime() {
      const date = new Date(null);
      date.setSeconds(this.elapsedTime / 1000);
      const utc = date.toUTCString();
      return utc.substr(utc.indexOf(":") - 2, 8);
    }



  }, 
  
  name: 'App',
}

</script>

<style>
:root {
  --bg: #0a0c10;
  --surface: #12161d;
  --surface-2: #1a2029;
  --border: #222a36;
  --text: #eef2f7;
  --text-muted: #7d8898;
  --grid: #1c2430;
  --accent: #7dd3fc;
  --accent-ink: #06202b;
  --warn: #fbbf24;
  --ok: #86efac;
  --danger: #f87171;
  --nav-h: 64px;
}

html,
body {
  touch-action: manipulation;
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--body-font);
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  overscroll-behavior-y: none;
}

.app {
  min-height: 100vh;
  min-height: 100dvh;
  padding-bottom: calc(var(--nav-h) + env(safe-area-inset-bottom) + 16px);
}

.muted { color: var(--text-muted); }
.strong { font-weight: 600; }
.small { font-size: 0.8rem; }
.empty { text-align: center; padding: 28px 0; }

/* Top bar */
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(env(safe-area-inset-top) + 12px) 20px 10px;
  background: rgba(10, 12, 16, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: 0.01em;
}
.brand-mark {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: var(--accent);
  transform: rotate(12deg);
}
.views {
  color: var(--text-muted);
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
}

/* Bottom tab bar */
.tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding: 6px 8px calc(env(safe-area-inset-bottom) + 6px);
  background: rgba(14, 17, 23, 0.92);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-top: 1px solid var(--border);
}
.tabbar button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 6px 0;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font: inherit;
  font-size: 0.68rem;
  cursor: pointer;
}
.tabbar i { font-size: 1.1rem; }
.tabbar button.active { color: var(--accent); }

/* Buttons */
button {
  font: inherit;
  color: var(--text);
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 9px 14px;
  min-height: 36px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
button.ghost { background: transparent; border-color: transparent; color: var(--text-muted); }
button.danger { color: var(--danger); }
.small-btn { padding: 4px 10px; min-height: 0; font-size: 0.8rem; }
.seg {
  display: inline-flex;
  gap: 2px;
  background: var(--surface-2);
  border-radius: 10px;
  padding: 2px;
}
.seg button {
  border: none;
  background: transparent;
  padding: 5px 12px;
  min-height: 0;
  color: var(--text-muted);
  border-radius: 8px;
}
.seg button.active {
  background: var(--accent);
  color: var(--accent-ink);
  font-weight: 600;
}
.icon-btn {
  border: none;
  background: transparent;
  padding: 4px 8px;
  min-height: 0;
  color: var(--text-muted);
}
.icon-btn:hover { color: var(--danger); }

/* Layout */
.screen {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 4px 16px 16px;
  max-width: 640px;
  margin: 0 auto;
}
.card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
  padding: 14px 16px;
  min-width: 0;
}
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}
.label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: var(--label-transform);
  color: var(--text-muted);
}

/* Solving screen: only the word, no clock */
.solving-screen {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  touch-action: none;
  user-select: none;
  cursor: pointer;
}
.solving-label {
  font-size: 1.6rem;
  font-weight: 300;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--accent);
}

/* Scramble: two rows, never wraps */
.scramble-card { padding: 12px 14px; }
.scramble {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: var(--mono);
  font-size: min(4.1vw, 19px);
}
.scramble-row {
  display: flex;
  justify-content: space-between;
  white-space: nowrap;
}
.move { font-weight: 500; }

/* Timer pad fills the rest of the screen */
.timer-screen {
  height: calc(100dvh - 56px - var(--nav-h) - env(safe-area-inset-bottom) - 16px);
  min-height: 520px;
}
.timer-pad {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: var(--radius);
  background: var(--pad-bg);
  border: 1px solid var(--card-border);
  user-select: none;
  touch-action: none;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.timer-pad.ready {
  background: rgba(134, 239, 172, 0.1);
  border-color: var(--ok);
}
.actual-timer {
  font-family: var(--timer-font);
  font-size: var(--timer-size, clamp(64px, 24vw, 128px));
  font-weight: var(--timer-weight);
  font-variant-numeric: tabular-nums;
  line-height: 1;
  letter-spacing: -0.02em;
}
.clock-hint {
  color: var(--text-muted);
  font-size: 0.85rem;
}

/* Recent solves */
.strip { display: flex; flex-direction: column; gap: 8px; }
.chips {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
}
.chips::-webkit-scrollbar { display: none; }
.chip {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 999px;
  font-variant-numeric: tabular-nums;
  font-size: 0.92rem;
}
.chip.latest { border-color: var(--accent); color: var(--accent); }
.chip-no { color: var(--text-muted); font-size: 0.72rem; }
.stats-line {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 4px;
  color: var(--text-muted);
  font-size: 0.82rem;
  font-variant-numeric: tabular-nums;
}
.stats-line b { color: var(--text); font-weight: 600; }
.stats-line .icon-btn { margin-left: auto; }

/* Goal rings */
.rings {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}
.ring { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.ring-dial { position: relative; width: 60px; height: 60px; }
.ring-dial svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.ring-track { fill: none; stroke: var(--border); stroke-width: 6; }
.ring-value {
  fill: none;
  stroke: var(--accent);
  stroke-width: 6;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.4s ease;
}
.ring.done .ring-value { stroke: var(--ok); }
.ring-num {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.95rem;
  font-variant-numeric: tabular-nums;
}
.ring-label { font-size: 0.7rem; color: var(--text-muted); }
.ring-label small { opacity: 0.7; }

/* Tables */
.table-wrap { overflow-x: auto; }
.solve-table {
  width: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
  font-size: 0.9rem;
  text-align: center;
}
.solve-table th {
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 6px 4px;
  border-bottom: 1px solid var(--border);
}
.solve-table td { padding: 9px 4px; border-bottom: 1px solid var(--grid); }
.solve-table tr:last-child td { border-bottom: none; }

/* Stats summary tiles */
.summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.stat {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.stat span {
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.stat b {
  font-size: 1.3rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.chart-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}
.toggles { display: flex; flex-wrap: wrap; gap: 6px; }
.toggle {
  padding: 4px 10px;
  min-height: 0;
  font-size: 0.8rem;
  color: var(--text-muted);
  border-radius: 999px;
}
.toggle.active {
  color: var(--tone);
  border-color: var(--tone);
  background: transparent;
}

/* Lab */
.hist {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 150px;
}
.hist-col {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: flex-end;
}
.hist-bar {
  width: 100%;
  min-height: 2px;
  border-radius: 4px 4px 0 0;
  background: var(--accent);
  opacity: 0.85;
}
.hist-axis {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 0.72rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}
.days {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 130px;
}
.day-col {
  flex: 1 1 0;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
}
.day-bar {
  width: 100%;
  min-height: 2px;
  border-radius: 4px 4px 0 0;
  background: var(--ok);
  opacity: 0.8;
}
.day-count { font-size: 0.66rem; color: var(--text-muted); }
.day-label { font-size: 0.7rem; color: var(--text-muted); }
.actions { display: flex; flex-wrap: wrap; gap: 8px; }
.analysis { margin-top: 12px; }
.list, .grid-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.list li {
  padding: 8px 10px;
  border-bottom: 1px solid var(--grid);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.85rem;
}
.grid-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
  gap: 6px;
  font-variant-numeric: tabular-nums;
}
.grid-list li {
  padding: 7px 8px;
  background: var(--surface-2);
  border-radius: 10px;
  font-size: 0.85rem;
  text-align: center;
}

/* Settings */
.form label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--grid);
}
.form label:last-child { border-bottom: none; }
.form label span { color: var(--text-muted); }
.input-field {
  width: 140px;
  padding: 9px 10px;
  background: var(--surface-2);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 10px;
  font: inherit;
  font-variant-numeric: tabular-nums;
}
.action-rows { display: flex; flex-direction: column; }
.row-btn {
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--grid);
  border-radius: 0;
  padding: 13px 2px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.row-btn:last-child { border-bottom: none; }
.row-btn i { width: 18px; color: var(--text-muted); text-align: center; }

@media (min-width: 720px) {
  .summary { grid-template-columns: repeat(4, 1fr); }
}

/* Lab: options, study, blind */
.toggle-list { display: flex; flex-direction: column; }
.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 2px;
  border-bottom: 1px solid var(--grid);
  font-size: 0.95rem;
}
.switch-row:last-child { border-bottom: none; }
.switch-row input {
  width: 44px;
  height: 26px;
  appearance: none;
  -webkit-appearance: none;
  border-radius: 999px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
  flex: 0 0 auto;
}
.switch-row input::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--text-muted);
  transition: transform 0.2s, background 0.2s;
}
.switch-row input:checked { background: var(--accent); border-color: var(--accent); }
.switch-row input:checked::after { transform: translateX(18px); background: var(--accent-ink); }

.case-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: 6px;
}
.case-tile {
  min-height: 44px;
  padding: 6px 2px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
}
.case-tile.learned { color: var(--ok); border-color: rgba(134, 239, 172, 0.35); }
.case-tile.current { border-color: var(--accent); color: var(--text); background: rgba(125, 211, 252, 0.12); }
.case-detail {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--grid);
}
.case-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}
.alg {
  margin: 0 0 8px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.95rem;
  line-height: 1.6;
  word-spacing: 2px;
}
.alts summary { color: var(--text-muted); font-size: 0.85rem; cursor: pointer; margin-bottom: 6px; }
.alts .alg { color: var(--text-muted); }
button.success { color: var(--ok); border-color: rgba(134, 239, 172, 0.4); }
.coming-soon { opacity: 0.85; }
.badge {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--warn);
  border: 1px solid rgba(251, 191, 36, 0.4);
  border-radius: 999px;
  padding: 3px 9px;
}

/* Lab redesign */
.lab { gap: 14px; }
.lab-hero { padding: 6px 2px 0; }
.lab-kicker {
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
}
.lab-title {
  font-size: 1.7rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 2px 0 12px;
}
.subtabs {
  display: flex;
  gap: 18px;
  border-bottom: 1px solid var(--border);
}
.subtabs button {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 8px 0 10px;
  min-height: 0;
  color: var(--text-muted);
  font-weight: 500;
  position: relative;
}
.subtabs button.active { color: var(--text); }
.subtabs button.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: var(--accent);
  border-radius: 2px;
}
.seg.wide { display: flex; }
.seg.wide button { flex: 1; }

.study-head {
  display: flex;
  align-items: center;
  gap: 14px;
}
.ring-mini {
  position: relative;
  width: 56px;
  height: 56px;
  flex: 0 0 auto;
}
.ring-mini svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.ring-mini span {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.study-meta { flex: 1; display: flex; flex-direction: column; gap: 8px; }

.flashcard {
  width: 100%;
  min-height: 210px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  text-align: center;
  border-radius: 28px;
  background: linear-gradient(160deg, #1b2736 0%, #121821 70%);
  border: 1px solid var(--border);
  color: var(--text);
}
.flashcard.flipped {
  background: linear-gradient(160deg, #0f2a33 0%, #101820 80%);
  border-color: rgba(125, 211, 252, 0.4);
}
.empty-card { color: var(--text-muted); min-height: 120px; font-size: 0.95rem; }
.fc-kicker {
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.fc-name { font-size: 2.1rem; font-weight: 700; letter-spacing: -0.02em; }
.fc-alg {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 1.15rem;
  line-height: 1.7;
  word-spacing: 3px;
}
.fc-hint { font-size: 0.75rem; color: var(--text-muted); }
.fc-actions {
  display: grid;
  grid-template-columns: 1fr 1.4fr auto;
  gap: 8px;
}
.fc-actions button {
  min-height: 48px;
  border-radius: 16px;
  font-weight: 600;
}
.fc-actions .shuffle { width: 56px; padding: 0; color: var(--text-muted); }
.fc-actions .got.on { background: var(--ok); color: #06210f; border-color: var(--ok); }

.alts { padding: 0 4px; }
.alts-label { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px; }
.alt-alg {
  margin: 0 0 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.board {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(44px, 1fr));
  gap: 6px;
}
.cell {
  aspect-ratio: 1;
  min-height: 0;
  padding: 0;
  border-radius: 12px;
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
  background: var(--surface);
}
.cell.learned { background: rgba(134, 239, 172, 0.14); color: var(--ok); border-color: rgba(134, 239, 172, 0.3); }
.cell.current { outline: 2px solid var(--accent); outline-offset: 1px; color: var(--text); }

.metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.metric {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.metric.big { grid-column: 1 / -1; }
.metric span { font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); }
.metric b { font-size: 1.8rem; font-weight: 700; font-variant-numeric: tabular-nums; }
.metric.big b { font-size: 2.6rem; }

.heat {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}
.heat-cell {
  aspect-ratio: 1;
  border-radius: 6px;
  background: var(--surface-2);
  display: inline-block;
}
.heat-cell.lv1 { background: rgba(125, 211, 252, 0.22); }
.heat-cell.lv2 { background: rgba(125, 211, 252, 0.42); }
.heat-cell.lv3 { background: rgba(125, 211, 252, 0.68); }
.heat-cell.lv4 { background: var(--accent); }
.heat-legend { display: flex; align-items: center; gap: 4px; margin-top: 10px; justify-content: flex-end; }
.heat-legend .heat-cell { width: 12px; height: 12px; aspect-ratio: auto; border-radius: 3px; }
.blind { opacity: 0.9; }

/* Style presets */
.style-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 10px;
}
.style-pick {
  min-width: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
  padding: 8px;
  text-align: left;
  background: transparent;
  border-radius: 18px;
}
.style-pick.on { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
.pick-name { font-weight: 600; font-size: 0.9rem; padding: 0 2px; }
.pick-desc { line-height: 1.35; padding: 0 2px; }
.preview {
  background: var(--bg);
  border: 1px solid var(--grid);
  border-radius: var(--radius);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--text);
  font-family: var(--body-font);
}
.pv-scramble {
  min-width: 0;
  font-family: var(--mono);
  font-size: 10px;
  line-height: 1.4;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pv-card { height: 22px; padding: 0; }
.pv-pad {
  flex: none;
  min-height: 0;
  height: 70px;
  gap: 0;
}
.pv-pad .actual-timer { font-size: 30px; }

/* Colour swatches and live transitions */
.swatch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--grid);
}
.swatches { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
.swatch {
  width: 32px;
  height: 32px;
  min-height: 0;
  padding: 0;
  border-radius: 50%;
  border: 2px solid transparent;
  box-shadow: 0 0 0 1px var(--border);
}
.swatch.on { border-color: var(--text); }
.see-timer {
  width: 100%;
  margin-top: 14px;
  min-height: 44px;
  background: var(--accent);
  color: var(--accent-ink);
  border-color: transparent;
  font-weight: 600;
}
body, .card, .timer-pad, .topbar, .tabbar, button, .preview, .stat, .metric, .flashcard {
  transition: background-color 0.4s ease, border-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease;
}

/* Options list */
.opt { display: flex; flex-direction: column; gap: 10px; padding: 12px 0; border-bottom: 1px solid var(--grid); }
.opt:last-child { border-bottom: none; }
.opt-row { flex-direction: row; align-items: center; justify-content: space-between; }
.opt-name { font-size: 0.95rem; }
.seg.wrap { display: flex; flex-wrap: wrap; }
.seg.wrap button { flex: 0 0 auto; }
.switch {
  width: 44px;
  height: 26px;
  appearance: none;
  -webkit-appearance: none;
  border-radius: 999px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  position: relative;
  cursor: pointer;
  flex: 0 0 auto;
  transition: background 0.2s;
}
.switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--text-muted);
  transition: transform 0.2s, background 0.2s;
}
.switch:checked { background: var(--accent); border-color: var(--accent); }
.switch:checked::after { transform: translateX(18px); background: var(--accent-ink); }

/* Lock the timer screen: no page scroll or drag */
html.timer-locked,
html.timer-locked body {
  height: 100%;
  overflow: hidden;
  overscroll-behavior: none;
}
html.timer-locked .app { height: 100%; min-height: 0; }
html.timer-locked .timer-screen { touch-action: none; }

/* Timer page preview in Lab */
.mock {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border-radius: var(--radius);
  background: var(--bg);
  border: 1px solid var(--grid);
}
.mock-card { padding: 10px 12px; }
.mock-card .scramble { font-size: 13px; }
.mock-pad { flex: none; min-height: 0; height: 190px; }
.mock .rings { margin-top: 0; }
.mock .ring-dial { width: 48px; height: 48px; }
.mock .ring-num { font-size: 0.8rem; }
.colour-head { margin-top: 16px; }
.parts summary { cursor: pointer; font-size: 0.85rem; color: var(--text-muted); list-style: none; }
.parts summary::-webkit-details-marker { display: none; }
.parts[open] summary { margin-bottom: 10px; }

/* Heatmap: 3M/6M fit the card, longer ranges scroll */
.heat-range { margin-bottom: 10px; }
.heat-scroll { overflow-x: auto; padding-bottom: 4px; }
.heat.fit {
  display: grid;
  grid-template-rows: repeat(7, auto);
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  grid-template-columns: none;
  gap: 3px;
}
.heat.scroll {
  display: grid;
  grid-template-rows: repeat(7, 12px);
  grid-auto-flow: column;
  grid-auto-columns: 12px;
  grid-template-columns: none;
  gap: 3px;
  width: max-content;
}
.heat.scroll .heat-cell { width: 12px; height: 12px; aspect-ratio: auto; border-radius: 3px; }
.heat-cell.pad { background: transparent; }
.heat-legend { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 6px; margin-top: 10px; }
.legend-scale { display: inline-flex; align-items: center; gap: 4px; }
.legend-scale .heat-cell { width: 12px; height: 12px; aspect-ratio: auto; border-radius: 3px; }
/* Profile */
.name-field { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 4px 0 12px; }
.name-field span { color: var(--text-muted); }
.name-field .input-field { width: 60%; text-align: right; }
.cloud-actions { margin-top: 4px; }
.cloud-actions button { flex: 1; justify-content: center; }
.brand-user { color: var(--text-muted); font-weight: 500; margin-left: 4px; font-size: 0.9rem; }

/* Heatmap labels and picked day */
.heat-months {
  display: grid;
  grid-auto-flow: column;
  height: 14px;
  margin-bottom: 4px;
  font-size: 0.66rem;
  color: var(--text-muted);
  white-space: nowrap;
}
.heat-months.fit { grid-auto-columns: minmax(0, 1fr); gap: 3px; }
.heat-months.scroll { grid-auto-columns: 12px; gap: 3px; width: max-content; }
.heat-months span { overflow: visible; }
.heat-cell {
  padding: 0;
  min-height: 0;
  border: none;
  border-radius: 3px;
}
.heat-cell.sel { outline: 2px solid var(--text); outline-offset: 1px; }
.heat-picked {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
}
.heat-picked b { font-weight: 600; }
</style>
