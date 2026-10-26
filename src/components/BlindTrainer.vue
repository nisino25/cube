<template>
  <div class="bt">
    <div class="bt-modes">
      <button v-for="m in modes" :key="m" :class="{ active: activeMode === m }" @click="setMode(m)">{{ labelOf(m) }}</button>
    </div>

    <p v-if="loading" class="muted small">Loading keywords…</p>
    <p v-else-if="loadError" class="muted small">{{ loadError }}</p>

    <!-- Study: flip cards for a set of pairs -->
    <div v-if="mode === 'study'">
      <div class="pair-grid">
        <button v-for="(item, i) in currentSet" :key="i" class="pair-card" @click="reveal(i)">
          <span class="pair-key">{{ item.key }}</span>
          <span v-if="revealed[i]" class="pair-word">{{ item.value }}</span>
          <span v-else class="pair-hint">tap</span>
        </button>
      </div>
      <div class="bt-actions">
        <button class="primary" @click="startRecall">Ready (hide and input)</button>
        <button @click="hideAll">Hide all</button>
        <button @click="pickRandomSet('study')">New random 9</button>
      </div>
    </div>

    <!-- Self: look up pairs you type -->
    <div v-else-if="mode === 'self'" class="bt-center">
      <input v-model="selfInput" class="bt-input big" placeholder="Type letter pairs, e.g. abcrgx" @keyup.enter="registerInput" />
      <button class="primary" @click="registerInput">Enter</button>
    </div>

    <!-- Memory: pick a category or 24 random pairs -->
    <div v-else-if="mode === 'memory'">
      <p class="muted small">Pick a category</p>
      <div class="bt-actions wrap">
        <button v-for="key in Object.keys(keywordMap)" :key="key" @click="selectCategory(key)">{{ key }}</button>
        <button @click="pickRandom24">Random 24</button>
      </div>
    </div>

    <!-- Recall: type the combined key -->
    <div v-else-if="mode === 'recall'" class="bt-center">
      <textarea v-model="userInput" class="bt-input big" rows="3" :placeholder="`Type the ${correctKeys.join('').length}-letter key, e.g. abcrgx…`"></textarea>
      <div class="bt-actions wrap">
        <button v-if="result.length === 0" class="primary" @click="check">Check</button>
        <template v-if="memoSession && result.length > 0">
          <button class="primary" @click="retryPhase">Retry {{ memoSession.phases[memoSession.index].name }}</button>
          <button v-if="memoSession.index < memoSession.phases.length - 1" class="primary" @click="nextPhase">
            Next: {{ memoSession.phases[memoSession.index + 1].name }} →
          </button>
          <button v-else class="primary" @click="restartSession">Start over (Edges)</button>
          <button @click="setMode('scramble')">Back to scramble</button>
        </template>
        <button v-if="result.length > 0 && !memoSession" @click="reset('study')">New random</button>
        <button v-if="result.length > 0 && !memoSession" @click="reset('self')">New input</button>
      </div>
      <div v-if="result.length > 0" class="result-grid">
        <div v-for="(pair, i) in result" :key="i" class="result-card" :class="pair.correct ? 'ok' : 'bad'">
          <div class="rc-label">Your</div>
          <div class="rc-key">{{ pair.user }}</div>
          <div class="rc-label">Answer</div>
          <div class="rc-key">{{ pair.actual }}</div>
          <div class="rc-word">{{ pair.value }}</div>
        </div>
      </div>
    </div>

    <!-- Scramble: cube net, memo, memorise -->
    <div v-else-if="mode === 'scramble'" class="bt-center">
      <div class="scramble-box">{{ scramble }}</div>
      <div class="bt-actions wrap">
        <button class="primary" @click="newScramble">New scramble</button>
        <button :class="{ active: showLetters }" @click="showLetters = !showLetters">Letters</button>
        <button @click="showCube = !showCube">{{ showCube ? 'Hide cube' : 'Show cube' }}</button>
        <button v-if="showCube" @click="view3d = !view3d">{{ view3d ? 'Net view' : '3D view' }}</button>
        <button v-if="showCube && view3d" @click="resetView">Reset angle</button>
      </div>

      <div
        v-if="showCube && view3d"
        class="cube-scene"
        @pointerdown="dragStart"
        @pointermove="dragMove"
        @pointerup="dragEnd"
        @pointercancel="dragEnd"
      >
        <div class="cube-3d" :style="{ transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)` }">
          <div v-for="f in faceOrder" :key="f" class="cube-3d-face" :style="{ transform: face3d[f] }">
            <div v-for="(c, i) in cubeFaces[f]" :key="i" class="sticker-label" :style="{ background: c }">
              {{ showLetters ? (slotLetter[f + i] || '') : '' }}
            </div>
          </div>
        </div>
      </div>
      <p v-if="showCube && view3d" class="muted small">Drag to rotate</p>

      <div v-if="showCube && !view3d" class="cube-net">
        <div v-for="f in faceOrder" :key="f" class="cube-face" :style="netPos[f]">
          <div v-for="(c, i) in cubeFaces[f]" :key="i" class="sticker" :style="{ background: c }">
            {{ showLetters ? (slotLetter[f + i] || '') : '' }}
          </div>
        </div>
      </div>

      <div class="bt-input-row">
        <input v-model="customScramble" class="bt-input" placeholder="Or paste a scramble: R U R' U'" @keyup.enter="applyCustomScramble" />
        <button @click="applyCustomScramble">Apply</button>
      </div>
      <p v-if="scrambleError" class="bt-error">{{ scrambleError }}</p>

      <div class="memo-card">
        <div class="card-title">Your memo</div>
        <p class="muted small">Speffz · Old Pochmann (edge buffer B = UR, corner buffer A = ULB)</p>
        <label class="bt-label">Edges</label>
        <input v-model="memoInput.edges" class="bt-input mono" placeholder="e.g. KQ DM EX" @keyup.enter="checkMemo" />
        <label class="bt-label">Corners</label>
        <input v-model="memoInput.corners" class="bt-input mono" placeholder="e.g. CJ WN" @keyup.enter="checkMemo" />
        <div class="bt-actions wrap">
          <button class="primary" @click="checkMemo">Check</button>
          <button @click="memoRevealed = !memoRevealed">{{ memoRevealed ? 'Hide answer' : 'Show answer' }}</button>
          <button @click="autoFillMemo">Auto-fill</button>
        </div>
        <button class="memorize" @click="memorizeMemo"><i class="fas fa-brain"></i> Memorize these pairs</button>
        <p class="muted small">Uses what you typed (or the correct memo if empty), then Study → Ready → Recall.</p>

        <div v-if="memoRevealed" class="answer">
          <div v-for="part in ['edges', 'corners']" :key="part" class="answer-part">
            <div class="answer-head">
              <span class="cap">{{ part }}</span>
              <span v-if="memoResult" :class="memoResult[part].ok ? 'ok-text' : 'bad-text'">{{ memoResult[part].ok ? '✓ correct' : '✗ wrong' }}</span>
              <span class="muted small">({{ memo[part].length }} letters)</span>
            </div>
            <div v-if="memo[part].length === 0" class="muted small">Already solved</div>
            <div class="pair-row">
              <div
                v-for="(pair, i) in memoPairs(memo[part])"
                :key="i"
                class="pair-chip"
                :class="!memoResult ? '' : memoResult[part].typed[i] === pair ? 'ok' : 'bad'"
              >
                <div class="mono bold">{{ pair }}</div>
                <div class="muted small">{{ pairWord(pair) }}</div>
                <div v-if="memoResult && memoResult[part].typed[i] !== pair" class="mono small">you: {{ memoResult[part].typed[i] || '--' }}</div>
              </div>
            </div>
          </div>
          <p v-if="memo.edges.length % 2 === 1" class="bt-error">Parity: odd number of edge targets. Do the parity algorithm before corners.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { loadJSON, saveJSON } from '../utils/storage.js'
import { solvedStickers, turn, parseMoves, stickersToFaces, traceMemo, randomScramble, EDGE_IDX, CORNER_IDX, slotLetter } from '../utils/blind.js'

const BASE_URL = 'https://script.google.com/macros/s/AKfycbyq0D55cLlQCobLkg6Ma6y7dbCtiGloTz7twl2cxuTxF6s3JCMnsE9qrsXOT2kul0wr5Q/exec'
const CACHE_KEY = 'cube-keywordCache'
const CACHE_EXPIRY = 50 * 60 * 60 * 1000
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
const LABELS = { study: 'Study', self: 'Self', memory: 'Memory', scramble: 'Scramble' }

// Each category letter gives 26 pairs: letter + second letter a-z, each with a word.
const getPairs = (map) => {
  const pairs = []
  for (const rowKey in map) {
    map[rowKey].forEach((value, col) => {
      if (col < 26) pairs.push({ key: rowKey.toLowerCase() + ALPHABET[col], value })
    })
  }
  return pairs
}

export default {
  name: 'BlindTrainer',
  setup() {
    const modes = ['study', 'self', 'memory', 'scramble']
    const mode = ref('study')
    const keywordMap = ref({})
    const loading = ref(true)
    const loadError = ref('')
    const currentSeletedKey = ref(null)
    const currentSet = ref([])
    const correctKeys = ref([])
    const revealed = ref([])
    const userInput = ref('')
    const result = ref([])
    const selfInput = ref('')
    const memoSession = ref(null)

    const quizPairs = computed(() => getPairs(keywordMap.value))
    const activeMode = computed(() => (mode.value === 'recall' ? 'study' : mode.value))

    const labelOf = (m) => LABELS[m]
    const setMode = (m) => {
      memoSession.value = null
      if (m === 'scramble') mode.value = 'scramble'
      else if (m === 'memory') { currentSeletedKey.value = null; mode.value = 'memory' }
      else mode.value = m
    }

    // ---- keyword data (JSONP, like the original page) ----
    const setData = (data) => {
      keywordMap.value = data
      pickRandomSet('study')
    }
    const fetchKeywordMap = (force = false) => {
      if (!force) {
        const cached = loadJSON(CACHE_KEY, null)
        if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
          setData(cached.data)
          loading.value = false
          return
        }
      }
      const cb = `blindKeywords${Date.now()}`
      window[cb] = (data) => {
        delete window[cb]
        if (data && data.success) {
          saveJSON(CACHE_KEY, { data: data.data, timestamp: Date.now() })
          setData(data.data)
        } else {
          loadError.value = 'Could not load keywords.'
        }
        loading.value = false
      }
      const script = document.createElement('script')
      script.src = `${BASE_URL}?action=getKeywordMap&callback=${cb}`
      script.async = true
      script.onerror = () => {
        delete window[cb]
        loadError.value = 'Could not load keywords.'
        loading.value = false
        script.remove()
      }
      script.onload = () => script.remove()
      document.body.appendChild(script)
    }

    // ---- study / recall helpers ----
    const pickRandomSet = (newMode, count = 9) => {
      memoSession.value = null
      const pool = quizPairs.value
      const selected = []
      const used = new Set()
      while (selected.length < count && used.size < pool.length) {
        const r = Math.floor(Math.random() * pool.length)
        if (!used.has(r)) { selected.push(pool[r]); used.add(r) }
      }
      currentSet.value = selected
      correctKeys.value = selected.map(i => i.key)
      revealed.value = Array(selected.length).fill(false)
      userInput.value = ''
      result.value = []
      mode.value = newMode
    }
    const pickRandom24 = () => pickRandomSet('study', 24)
    const reset = (newMode) => pickRandomSet(newMode)
    const reveal = (i) => { revealed.value[i] = !revealed.value[i] }
    const hideAll = () => { revealed.value = revealed.value.map(() => false) }
    const startRecall = () => { mode.value = 'recall' }

    const selectCategory = (key) => {
      memoSession.value = null
      currentSeletedKey.value = key
      const category = keywordMap.value[key]
      if (!category) return
      const pairs = category.slice(0, 26).map((value, col) => ({ key: key.toLowerCase() + ALPHABET[col], value }))
      currentSet.value = pairs
      correctKeys.value = pairs.map(i => i.key)
      revealed.value = Array(pairs.length).fill(false)
      userInput.value = ''
      result.value = []
      mode.value = 'study'
    }

    const studyPairs = (pairs) => {
      const pairMap = {}
      quizPairs.value.forEach(item => { pairMap[item.key] = item })
      currentSet.value = pairs.map(key => pairMap[key] || { key, value: key })
      correctKeys.value = currentSet.value.map(i => i.key)
      revealed.value = Array(currentSet.value.length).fill(false)
      userInput.value = ''
      result.value = []
      mode.value = 'study'
    }
    const registerInput = () => {
      memoSession.value = null
      const input = selfInput.value.trim().toLowerCase()
      if (!input) return
      const pairs = []
      for (let i = 0; i < input.length; i += 2) pairs.push(input.slice(i, i + 2))
      studyPairs(pairs)
      selfInput.value = ''
    }

    const check = () => {
      const input = userInput.value.toLowerCase().replace(/\s+/g, '')
      const userKeys = []
      let pos = 0
      correctKeys.value.forEach(k => {
        userKeys.push(input.slice(pos, pos + k.length))
        pos += k.length
      })
      result.value = correctKeys.value.map((correct, i) => ({
        actual: correct,
        user: userKeys[i] || '--',
        correct: userKeys[i] === correct,
        value: currentSet.value[i]?.value || '',
      }))
    }

    // ---- scramble and memo ----
    const scramble = ref('')
    const cubeFaces = ref(stickersToFaces(solvedStickers()))
    const showCube = ref(true)
    const showLetters = ref(false)
    const customScramble = ref('')
    const scrambleError = ref('')
    const faceOrder = ['U', 'L', 'F', 'R', 'B', 'D']
    const view3d = ref(true)
    const DEFAULT_ROT = { x: -28, y: -38 }
    const rotX = ref(DEFAULT_ROT.x)
    const rotY = ref(DEFAULT_ROT.y)
    const half = 'calc(var(--c) / 2)'
    const face3d = {
      F: `translateZ(${half})`,
      R: `rotateY(90deg) translateZ(${half})`,
      B: `rotateY(180deg) translateZ(${half})`,
      L: `rotateY(-90deg) translateZ(${half})`,
      U: `rotateX(90deg) translateZ(${half})`,
      D: `rotateX(-90deg) translateZ(${half})`,
    }
    let drag = null
    const dragStart = (e) => {
      drag = { x: e.clientX, y: e.clientY }
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    const dragMove = (e) => {
      if (!drag) return
      rotY.value += (e.clientX - drag.x) * 0.5
      rotX.value = Math.max(-90, Math.min(90, rotX.value - (e.clientY - drag.y) * 0.5))
      drag = { x: e.clientX, y: e.clientY }
    }
    const dragEnd = () => { drag = null }
    const resetView = () => { rotX.value = DEFAULT_ROT.x; rotY.value = DEFAULT_ROT.y }
    const netPos = {
      U: { gridColumn: 2, gridRow: 1 },
      L: { gridColumn: 1, gridRow: 2 },
      F: { gridColumn: 2, gridRow: 2 },
      R: { gridColumn: 3, gridRow: 2 },
      B: { gridColumn: 4, gridRow: 2 },
      D: { gridColumn: 2, gridRow: 3 },
    }
    const memo = ref({ edges: [], corners: [] })
    const memoInput = ref({ edges: '', corners: '' })
    const memoRevealed = ref(false)
    const memoResult = ref(null)

    const memoPairs = (letters) => {
      const out = []
      for (let i = 0; i < letters.length; i += 2) out.push(letters.slice(i, i + 2).join(''))
      return out
    }
    const pairWord = (pair) => {
      if (pair.length < 2) return ''
      const hit = quizPairs.value.find(p => p.key === pair.toLowerCase())
      return hit ? hit.value : ''
    }

    const applyScramble = (text) => {
      const stickers = solvedStickers()
      parseMoves(text).forEach(m => turn(stickers, m.face, m.times))
      cubeFaces.value = stickersToFaces(stickers)
      memo.value = {
        edges: traceMemo(stickers, EDGE_IDX, 'B'),
        corners: traceMemo(stickers, CORNER_IDX, 'A'),
      }
      memoInput.value = { edges: '', corners: '' }
      memoRevealed.value = false
      memoResult.value = null
      scramble.value = text.trim().replace(/’/g, "'")
      scrambleError.value = ''
    }
    const newScramble = () => applyScramble(randomScramble())
    const applyCustomScramble = () => {
      try {
        applyScramble(customScramble.value)
        customScramble.value = ''
      } catch (e) {
        scrambleError.value = e.message
      }
    }

    const checkMemo = () => {
      const norm = v => v.toUpperCase().replace(/[^A-X]/g, '')
      const grade = (typed, answer) => ({ ok: norm(typed) === answer.join(''), typed: memoPairs(norm(typed).split('')) })
      memoResult.value = {
        edges: grade(memoInput.value.edges, memo.value.edges),
        corners: grade(memoInput.value.corners, memo.value.corners),
      }
      memoRevealed.value = true
    }
    const autoFillMemo = () => {
      memoInput.value = {
        edges: memoPairs(memo.value.edges).join(' '),
        corners: memoPairs(memo.value.corners).join(' '),
      }
    }
    const memorizeMemo = () => {
      const lettersOf = (typed, fallback) => {
        const clean = typed.toUpperCase().replace(/[^A-X]/g, '')
        return clean ? clean.split('') : fallback
      }
      const toPairs = letters => memoPairs(letters).map(p => p.toLowerCase())
      const phases = [
        { name: 'Edges', pairs: toPairs(lettersOf(memoInput.value.edges, memo.value.edges)) },
        { name: 'Corners', pairs: toPairs(lettersOf(memoInput.value.corners, memo.value.corners)) },
      ].filter(p => p.pairs.length > 0)
      if (phases.length === 0) return
      memoSession.value = { phases, index: 0 }
      studyPairs(phases[0].pairs)
    }
    const startPhase = (index) => {
      memoSession.value.index = index
      studyPairs(memoSession.value.phases[index].pairs)
    }
    const retryPhase = () => startPhase(memoSession.value.index)
    const nextPhase = () => startPhase(memoSession.value.index + 1)
    const restartSession = () => startPhase(0)

    onMounted(() => {
      fetchKeywordMap()
      newScramble()
    })

    return {
      modes, mode, activeMode, labelOf, setMode, loading, loadError, keywordMap,
      currentSet, correctKeys, revealed, userInput, result, selfInput, memoSession,
      currentSeletedKey, pickRandom24, pickRandomSet, reset, reveal, hideAll, startRecall,
      selectCategory, registerInput, check, retryPhase, nextPhase, restartSession,
      scramble, cubeFaces, showCube, showLetters, customScramble, scrambleError, faceOrder, netPos,
      view3d, rotX, rotY, face3d, dragStart, dragMove, dragEnd, resetView,
      slotLetter, newScramble, applyCustomScramble, memo, memoInput, memoRevealed, memoResult,
      memoPairs, pairWord, checkMemo, autoFillMemo, memorizeMemo,
    }
  },
}
</script>

<style scoped>
.bt { display: flex; flex-direction: column; gap: 12px; }
.bt-modes { display: flex; gap: 6px; flex-wrap: wrap; }
.bt-modes button, .bt-actions button, .bt button { min-height: 36px; }
.bt-modes button.active, .bt-actions button.active { background: var(--accent); color: var(--accent-ink); border-color: transparent; font-weight: 600; }
.primary { background: var(--accent); color: var(--accent-ink); border-color: transparent; font-weight: 600; }
.bt-center { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.bt-actions { display: flex; gap: 8px; justify-content: center; }
.bt-actions.wrap { flex-wrap: wrap; }
.bt-input { width: 100%; padding: 10px 12px; background: var(--surface-2); color: var(--text); border: 1px solid var(--border); border-radius: 12px; font: inherit; }
.bt-input.big { text-align: center; font-size: 1.1rem; letter-spacing: 0.08em; }
.bt-input.mono, .mono { font-family: var(--mono); }
.bt-input-row { display: flex; gap: 8px; width: 100%; }
.bt-input-row .bt-input { flex: 1; }
.bt-label { display: block; font-size: 0.8rem; color: var(--text-muted); margin: 8px 0 4px; }
.bt-error { color: var(--danger); font-size: 0.85rem; }
.scramble-box { width: 100%; padding: 12px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; font-family: var(--mono); text-align: center; word-spacing: 3px; line-height: 1.7; }

.pair-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.pair-card { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 12px 6px; min-height: 72px; background: var(--surface); border-radius: 14px; }
.pair-key { font-size: 1.2rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
.pair-word { font-size: 0.85rem; color: var(--text-muted); }
.pair-hint { font-size: 0.7rem; color: var(--text-muted); }
.result-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; width: 100%; }
.result-card { padding: 10px 6px; border-radius: 14px; text-align: center; color: #fff; }
.result-card.ok { background: #16a34a; }
.result-card.bad { background: #dc2626; }
.rc-label { font-size: 0.7rem; opacity: 0.85; }
.rc-key { font-family: var(--mono); font-size: 1.05rem; letter-spacing: 0.1em; font-weight: 700; }
.rc-word { font-size: 0.75rem; opacity: 0.85; margin-top: 4px; }

.cube-net { display: grid; grid-template-columns: repeat(4, auto); gap: 6px; justify-content: center; }
.cube-face { display: grid; grid-template-columns: repeat(3, 26px); gap: 2px; }
.sticker { width: 26px; height: 26px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; color: #111; }

.memo-card { width: 100%; padding: 14px; background: var(--surface); border: 1px solid var(--border); border-radius: 18px; text-align: left; }
.card-title { font-weight: 700; margin-bottom: 2px; }
.memorize { width: 100%; margin-top: 12px; min-height: 44px; background: var(--warn); color: var(--accent-ink); border: none; border-radius: 12px; font-weight: 600; }
.answer { margin-top: 14px; display: flex; flex-direction: column; gap: 12px; }
.answer-head { display: flex; align-items: center; gap: 8px; font-weight: 600; }
.cap { text-transform: capitalize; }
.ok-text { color: var(--ok); }
.bad-text { color: var(--danger); }
.pair-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
.pair-chip { padding: 6px 8px; border-radius: 10px; text-align: center; border: 1px solid var(--border); background: var(--surface-2); min-width: 60px; }
.pair-chip.ok { background: rgba(134, 239, 172, 0.15); border-color: var(--ok); }
.pair-chip.bad { background: rgba(248, 113, 113, 0.15); border-color: var(--danger); }
.bold { font-weight: 700; letter-spacing: 0.1em; }
.small { font-size: 0.8rem; }
.muted { color: var(--text-muted); }

.cube-scene {
  --c: clamp(150px, 45vw, 220px);
  width: calc(var(--c) * 1.9);
  height: calc(var(--c) * 1.9);
  perspective: 900px;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
  cursor: grab;
  user-select: none;
}
.cube-scene:active { cursor: grabbing; }
.cube-3d {
  position: relative;
  width: var(--c);
  height: var(--c);
  transform-style: preserve-3d;
}
.cube-3d-face {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4%;
  padding: 4%;
  background: #111;
  border-radius: 6%;
  backface-visibility: hidden;
}
.cube-3d-face > div { border-radius: 10%; font-size: calc(var(--c) / 9); }
.cube-3d-face .sticker-label { width: 100%; height: 100%; }
.sticker-label {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: calc(var(--c, 180px) / 11);
  color: #111;
  text-shadow: 0 0 3px #fff, 0 0 3px #fff;
}
</style>
