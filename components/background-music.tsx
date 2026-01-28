"use client"

import { useEffect, useRef, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Set random start position when loaded
    const handleLoadedMetadata = () => {
      const duration = audio.duration
      if (duration && duration > 0) {
        const randomStart = Math.random() * duration
        audio.currentTime = randomStart
      }
    }

    // Try to play when the page is fully loaded
    const playAudio = async () => {
      try {
        await audio.play()
        setIsPlaying(true)
      } catch {
        // Autoplay was prevented, wait for user interaction
        const handleInteraction = async () => {
          try {
            await audio.play()
            setIsPlaying(true)
            document.removeEventListener("click", handleInteraction)
            document.removeEventListener("touchstart", handleInteraction)
          } catch {
            // Still blocked
          }
        }
        document.addEventListener("click", handleInteraction)
        document.addEventListener("touchstart", handleInteraction)
      }
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    
    // Play when window is fully loaded
    if (document.readyState === "complete") {
      playAudio()
    } else {
      window.addEventListener("load", playAudio)
    }

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      window.removeEventListener("load", playAudio)
    }
  }, [])

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/Suomalainen-Kehtolaulu.ogg"
        loop
        preload="auto"
      />
      <button
        onClick={toggleMute}
        className="fixed bottom-4 right-4 p-3 rounded-full bg-card/80 backdrop-blur-sm border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200 z-50"
        aria-label={isMuted ? "Unmute music" : "Mute music"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>
    </>
  )
}
