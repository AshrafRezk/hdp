import { useEffect, useState } from 'react'

const SPLASH_MS = 1100
const FADE_MS = 420
const SESSION_KEY = 'hdp_boot_done'

let bootStarted = false

function vibrateBrand() {
  try {
    navigator.vibrate?.([18, 40, 22, 50, 28])
  } catch {
    /* desktop / unsupported */
  }
}

function playBrandChime() {
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioCtx) return

  const start = (ctx: AudioContext) => {
    const now = ctx.currentTime
    const master = ctx.createGain()
    master.gain.setValueAtTime(0.0001, now)
    master.gain.exponentialRampToValueAtTime(0.16, now + 0.04)
    master.gain.exponentialRampToValueAtTime(0.0001, now + 1.05)
    master.connect(ctx.destination)

    const notes = [
      { freq: 392.0, at: 0, dur: 0.55 },
      { freq: 523.25, at: 0.12, dur: 0.55 },
      { freq: 659.25, at: 0.24, dur: 0.7 },
      { freq: 783.99, at: 0.38, dur: 0.75 },
    ]

    for (const note of notes) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(note.freq, now + note.at)
      gain.gain.setValueAtTime(0.0001, now + note.at)
      gain.gain.exponentialRampToValueAtTime(0.22, now + note.at + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + note.at + note.dur)
      osc.connect(gain).connect(master)
      osc.start(now + note.at)
      osc.stop(now + note.at + note.dur + 0.02)
    }
  }

  try {
    const ctx = new AudioCtx()
    const run = () => start(ctx)
    if (ctx.state === 'suspended') {
      const unlock = () => {
        ctx.resume().then(run).catch(() => undefined)
        window.removeEventListener('pointerdown', unlock)
        window.removeEventListener('keydown', unlock)
      }
      window.addEventListener('pointerdown', unlock, { once: true })
      window.addEventListener('keydown', unlock, { once: true })
      ctx.resume().then(run).catch(() => undefined)
    } else {
      run()
    }
  } catch {
    /* autoplay blocked */
  }
}

function fadeAndRemoveBootNode() {
  const el = document.getElementById('hdp-boot-splash')
  if (!el) return
  el.classList.add('is-done')
  window.setTimeout(() => el.remove(), FADE_MS)
}

export default function HdpBootSplash() {
  const [open, setOpen] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) !== '1'
    } catch {
      return true
    }
  })

  useEffect(() => {
    if (!open) {
      document.getElementById('hdp-boot-splash')?.remove()
      return
    }
    if (bootStarted) return
    bootStarted = true

    vibrateBrand()
    playBrandChime()

    const elapsed = typeof performance !== 'undefined' ? performance.now() : SPLASH_MS
    const wait = Math.max(420, SPLASH_MS - elapsed)

    window.setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch {
        /* private mode */
      }
      fadeAndRemoveBootNode()
      setOpen(false)
    }, wait)
  }, [open])

  return null
}
