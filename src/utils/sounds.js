// Synthesised cues (Web Audio), so no audio files are needed.
// The context is created on the first user gesture, which iOS requires.

let ctx = null

function audio() {
  try {
    if (!ctx) {
      const Ctor = window.AudioContext || window.webkitAudioContext
      if (!Ctor) return null
      ctx = new Ctor()
    }
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  } catch (e) {
    return null
  }
}

function tone(freq, { start = 0, dur = 0.25, type = 'sine', gain = 0.2 } = {}) {
  const c = audio()
  if (!c) return
  const t0 = c.currentTime + start
  const osc = c.createOscillator()
  const amp = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  amp.gain.setValueAtTime(0.0001, t0)
  amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.01)
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(amp)
  amp.connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

// Short rising chime when the timer is ready to release.
export function playReady() {
  tone(660, { dur: 0.12, gain: 0.15 })
  tone(990, { start: 0.08, dur: 0.18, gain: 0.12 })
}

// One note per whole second, C major from 1 s to 10 s, so each solve has its own sound.
// Anything past 10 s gets a low two-note cue.
const SECOND_NOTES = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5, 1174.66, 1318.51]

export function playFinish(seconds) {
  const sec = Math.floor(seconds)
  if (sec >= 1 && sec <= 10) {
    const note = SECOND_NOTES[sec - 1]
    tone(note, { dur: 0.4, type: 'triangle', gain: 0.25 })
    tone(note * 1.5, { start: 0.07, dur: 0.45, gain: 0.1 })
  } else {
    tone(196.0, { dur: 0.5, type: 'triangle', gain: 0.2 })
    tone(246.94, { start: 0.15, dur: 0.6, gain: 0.15 })
  }
}
