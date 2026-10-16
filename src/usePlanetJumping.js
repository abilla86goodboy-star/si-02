import { useEffect } from 'react'
import { states } from './data'

/* ---------- helpers ---------- */
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const raf = () => new Promise((r) => requestAnimationFrame(() => r()))
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

function animateValue(setter, duration) {
  return new Promise((resolve) => {
    const start = performance.now()
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration)
      setter(ease(t))
      if (t < 1) requestAnimationFrame(step)
      else resolve()
    }
    requestAnimationFrame(step)
  })
}

function waitEvent(el, names, timeout) {
  return new Promise((resolve) => {
    let done = false
    let timer
    const fin = () => {
      if (done) return
      done = true
      names.forEach((n) => el.removeEventListener(n, fin))
      clearTimeout(timer)
      resolve()
    }
    names.forEach((n) => el.addEventListener(n, fin))
    timer = setTimeout(fin, timeout)
  })
}

function mediaReady(media, timeout = 5000) {
  if (media.tagName === 'IMG') {
    return media.complete ? Promise.resolve() : waitEvent(media, ['load', 'error'], timeout)
  }
  return media.readyState >= 2 ? Promise.resolve() : waitEvent(media, ['loadeddata', 'canplay', 'error'], timeout)
}

function retrigger(el, cls) {
  el.classList.remove(cls)
  void el.offsetWidth
  el.classList.add(cls)
}

function roundedRectPoints(w, h, r) {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2))
  const corners = [
    [w / 2 - rr, -h / 2 + rr, -Math.PI / 2, 0],
    [w / 2 - rr, h / 2 - rr, 0, Math.PI / 2],
    [-w / 2 + rr, h / 2 - rr, Math.PI / 2, Math.PI],
    [-w / 2 + rr, -h / 2 + rr, Math.PI, Math.PI * 1.5],
  ]
  const pts = []
  for (const [cx, cy, a0, a1] of corners) {
    for (let i = 0; i <= 10; i++) {
      const a = a0 + ((a1 - a0) * i) / 10
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr])
    }
  }
  return pts
}

function project(x, y, rx, ry, cx, cy) {
  const ax = (rx * Math.PI) / 180
  const ay = (ry * Math.PI) / 180
  const xx = x * Math.cos(ay)
  const yy = y * Math.cos(ax)
  const z = x * Math.sin(ay) - y * Math.sin(ax)
  const p = 850 / (850 + z)
  return [cx + xx * p, cy + yy * p]
}

/**
 * Engine "Planet Jumping".
 * refs   : objek ref DOM dari komponen Home
 * getCurrent : () => key planet saat ini
 * commit : (key) => void  — mengubah state React secara sinkron (flushSync)
 */
export default function usePlanetJumping(refs, getCurrent, commit) {
  useEffect(() => {
    const R = Object.fromEntries(Object.entries(refs).map(([k, v]) => [k, v.current]))
    const {
      experience, preloader, preloaderVideo, preloaderValue, preloaderCount, logo,
      sceneCanvas, portalCanvas, portal, portalVideo, portalImage, transitionVideo,
      cursor, backgrounds,
    } = R

    const ctx = portalCanvas.getContext('2d')
    const sctx = sceneCanvas.getContext('2d')
    const body = document.body

    let disposed = false
    let busy = false
    let frozen = false
    let transitionActive = false
    let expansion = 0
    let maskScale = 0
    let canvasOpacity = 1
    let rotX = 0, rotY = 0, targetX = 0, targetY = 0
    let lastT = performance.now()
    let drawId, cursorId
    const cleanups = []
    const on = (target, ev, fn, opts) => {
      target.addEventListener(ev, fn, opts)
      cleanups.push(() => target.removeEventListener(ev, fn, opts))
    }

    /* ---------- canvas sizing ---------- */
    function sizeCanvas(canvas, c) {
      const d = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * d
      canvas.height = window.innerHeight * d
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      c.setTransform(d, 0, 0, d, 0, 0)
    }
    function resizeCanvas() {
      sizeCanvas(portalCanvas, ctx)
      if (!frozen) sizeCanvas(sceneCanvas, sctx)
    }

    function drawCover(c, media) {
      const mw = media.videoWidth || media.naturalWidth
      const mh = media.videoHeight || media.naturalHeight
      if (!mw || !mh) return
      const s = Math.max(window.innerWidth / mw, window.innerHeight / mh)
      const w = mw * s
      const h = mh * s
      c.drawImage(media, (window.innerWidth - w) / 2, (window.innerHeight - h) / 2, w, h)
    }

    function drawShade(c) {
      const y0 = window.innerHeight * 0.52
      const g = c.createLinearGradient(0, y0, 0, window.innerHeight)
      g.addColorStop(0, 'rgba(0,0,0,0)')
      g.addColorStop(1, 'rgba(0,0,0,.88)')
      c.fillStyle = g
      c.fillRect(0, y0, window.innerWidth, window.innerHeight - y0)
    }

    /* ---------- frame loop ---------- */
    function draw(now) {
      if (disposed) return
      const dt = Math.min(40, now - lastT)
      lastT = now
      const k = Math.min(1, dt * 0.009)
      rotX += (targetX - rotX) * k
      rotY += (targetY - rotY) * k

      const W = window.innerWidth
      const H = window.innerHeight
      ctx.clearRect(0, 0, W, H)
      if (frozen) {
        ctx.drawImage(sceneCanvas, 0, 0, W, H)
        drawShade(ctx)
      }

      const rect = portal.getBoundingClientRect()
      const e = expansion
      const rectCx = rect.left + rect.width / 2
      const rectCy = rect.top + rect.height / 2
      const cx = rectCx + (W / 2 - rectCx) * e
      const cy = rectCy + (H / 2 - rectCy) * e
      const baseW = rect.width + (W - rect.width) * e
      const baseH = rect.height + (H - rect.height) * e
      const scale = e ? 1 : maskScale
      const w = baseW * scale
      const h = baseH * scale
      const r = 90 * (1 - e) * scale
      const rx = rotX * (1 - e)
      const ry = rotY * (1 - e)

      if (w > 1 && h > 1) {
        const pts = roundedRectPoints(w, h, r).map(([x, y]) => project(x, y, rx, ry, cx, cy))
        ctx.save()
        ctx.globalAlpha = canvasOpacity
        ctx.beginPath()
        pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
        ctx.closePath()
        ctx.clip()
        ctx.fillStyle = '#030303'
        ctx.fillRect(0, 0, W, H)
        const st = states[getCurrent()]
        const media = transitionActive ? transitionVideo : st.image ? portalImage : portalVideo
        const ok = media.tagName === 'IMG' ? media.complete : media.readyState >= 2
        if (ok) drawCover(ctx, media)
        if (transitionActive) drawShade(ctx)
        ctx.restore()
      }
      drawId = requestAnimationFrame(draw)
    }

    /* ---------- reveals ---------- */
    async function revealMask() {
      retrigger(experience, 'mask-revealing')
      maskScale = 0
      await animateValue((v) => (maskScale = v), 1050)
    }
    function revealPlanetContent() {
      retrigger(experience, 'content-revealing')
    }

    async function startExperience() {
      const st = states[getCurrent()]
      await mediaReady(st.image ? portalImage : portalVideo)
      if (disposed) return
      await revealMask()
      if (disposed) return
      body.classList.add('intro-ready')
      await wait(850)
      if (!disposed) revealPlanetContent()
    }

    /* ---------- preloader ---------- */
    function runPreloader() {
      const v = preloaderVideo
      let finished = false
      let tickId

      const finish = () => {
        if (finished || disposed) return
        finished = true
        cancelAnimationFrame(tickId)
        preloaderValue.textContent = '100'
        preloaderCount.classList.add('is-leaving')
        logo.classList.add('is-docked')
        preloader.classList.add('is-background')
        body.classList.add('preload-complete')
        startExperience()
        setTimeout(() => { preloaderCount.style.display = 'none' }, 750)
        setTimeout(() => logo.classList.add('is-settled'), 2000)
      }
      const tick = () => {
        if (finished || disposed) return
        if (isFinite(v.duration) && v.duration > 0) {
          preloaderValue.textContent = String(Math.min(99, Math.round((v.currentTime / v.duration) * 100)))
        }
        tickId = requestAnimationFrame(tick)
      }
      const start = () => {
        if (isFinite(v.duration) && v.duration > 0) v.playbackRate = Math.max(0.25, v.duration / 3)
        v.play().then(tick).catch(finish)
      }

      on(v, 'ended', finish)
      on(v, 'error', finish)
      if (v.readyState >= 1) start()
      else on(v, 'loadedmetadata', start, { once: true })
      // jaring pengaman bila video gagal dimuat
      setTimeout(() => { if (!finished && (!v.duration || v.currentTime === 0)) finish() }, 15000)
    }

    /* ---------- travel ---------- */
    async function travel() {
      const cur = getCurrent()
      if (busy || cur === 'venus') return
      busy = true
      targetX = targetY = 0
      const tv = transitionVideo
      try {
        const next = cur === 'mars' ? 'earth' : 'venus'
        tv.src = states[cur].portal
        tv.load()
        experience.classList.add('is-loading')
        await waitEvent(tv, ['canplaythrough', 'error'], 1600)

        experience.classList.remove('is-loading', 'content-revealing', 'mask-revealing')
        experience.classList.add('is-transitioning')
        tv.currentTime = 0
        tv.playbackRate = 1.3
        canvasOpacity = 1
        transitionActive = true
        await tv.play()

        await animateValue((v) => (expansion = v), 1100)
        if (!tv.ended) {
          const limit = isFinite(tv.duration) ? (tv.duration / 1.3) * 1000 + 3000 : 8000
          await waitEvent(tv, ['ended', 'error'], limit)
        }

        // bekukan frame terakhir ke scene canvas
        sizeCanvas(sceneCanvas, sctx)
        sctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        drawCover(sctx, tv)
        frozen = true

        experience.classList.add('is-committing')
        commit(next)
        await raf()
        await raf()

        transitionActive = false
        expansion = 0
        maskScale = 0
        canvasOpacity = 1
        experience.classList.remove('is-transitioning', 'is-committing')

        const maskReveal = revealMask()
        setTimeout(revealPlanetContent, 100)
        await maskReveal

        await wait(450)
        tv.removeAttribute('src')
        tv.load()
        busy = false
      } catch (err) {
        transitionActive = false
        expansion = 0
        maskScale = 1
        canvasOpacity = 1
        experience.classList.remove('is-transitioning', 'is-committing', 'is-loading')
        busy = false
      }
    }

    /* ---------- pointer tilt ---------- */
    on(window, 'pointermove', (e) => {
      if (busy) return
      targetY = (e.clientX / window.innerWidth - 0.5) * 37.4
      targetX = (e.clientY / window.innerHeight - 0.5) * -33
    })
    on(document, 'mouseleave', () => { targetX = targetY = 0 })
    on(window, 'resize', resizeCanvas)
    on(portal, 'click', travel)

    /* ---------- custom cursor ---------- */
    let px = 0, py = 0, cxp = 0, cyp = 0, seen = false
    on(window, 'pointermove', (e) => {
      px = e.clientX
      py = e.clientY
      if (!seen) {
        seen = true
        cxp = px
        cyp = py
        cursor.classList.add('is-visible')
      }
    })
    on(document, 'mouseleave', () => cursor.classList.remove('is-visible'))
    on(document, 'mouseenter', () => { if (seen) cursor.classList.add('is-visible') })
    on(portal, 'pointerenter', () => cursor.classList.add('is-enter'))
    on(portal, 'pointerleave', () => cursor.classList.remove('is-enter'))
    function cursorLoop() {
      if (disposed) return
      cxp += (px - cxp) * 0.2
      cyp += (py - cyp) * 0.2
      cursor.style.transform = `translate3d(${cxp}px, ${cyp}px, 0)`
      cursorId = requestAnimationFrame(cursorLoop)
    }

    /* ---------- boot ---------- */
    backgrounds.querySelectorAll('video').forEach((v) => { v.pause(); v.currentTime = 0 })
    resizeCanvas()
    drawId = requestAnimationFrame(draw)
    cursorId = requestAnimationFrame(cursorLoop)
    runPreloader()

    return () => {
      disposed = true
      cancelAnimationFrame(drawId)
      cancelAnimationFrame(cursorId)
      cleanups.forEach((fn) => fn())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
