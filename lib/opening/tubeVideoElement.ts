import { BUBBLE_TUBE_VIDEO_URL } from './bubbleTube'

let sharedVideo: HTMLVideoElement | null = null
let listeners = 0

function applyVideoSource(video: HTMLVideoElement, src: string) {
  if (video.getAttribute('src') === src) return
  video.src = src
  video.load()
}

function createVideo(): HTMLVideoElement {
  const vid = document.createElement('video')
  vid.loop = true
  vid.muted = true
  vid.autoplay = true
  vid.playsInline = true
  vid.setAttribute('playsinline', '')
  vid.setAttribute('webkit-playsinline', '')
  vid.setAttribute('autoplay', '')
  vid.preload = 'auto'
  applyVideoSource(vid, BUBBLE_TUBE_VIDEO_URL)
  return vid
}

function ensureTubeVideo(): HTMLVideoElement {
  if (typeof document === 'undefined') {
    throw new Error('tube video must run in the browser')
  }
  if (!sharedVideo) sharedVideo = createVideo()
  return sharedVideo
}

/** Um único elemento de vídeo reutilizado entre visitas à /opening. */
export function acquireTubeVideo(): HTMLVideoElement {
  listeners += 1
  return ensureTubeVideo()
}

export function releaseTubeVideo() {
  listeners = Math.max(0, listeners - 1)
}

/** Pré-carrega / retoma o vídeo (ex.: ao entrar na rota /opening). */
export function playTubeVideo() {
  const video = ensureTubeVideo()
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
    void video.play().catch(() => {})
    return
  }
  const onReady = () => {
    void video.play().catch(() => {})
    video.removeEventListener('canplay', onReady)
  }
  video.addEventListener('canplay', onReady)
}

export function pauseTubeVideo() {
  sharedVideo?.pause()
}
