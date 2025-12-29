"use client"

import { useEffect, useRef } from "react"

export function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    interface Line {
      x: number
      y: number
      length: number
      horizontal: boolean
      speed: number
      opacity: number
      glowIntensity: number
    }

    const lines: Line[] = []
    const lineCount = 40

    for (let i = 0; i < lineCount; i++) {
      lines.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 150 + 50,
        horizontal: Math.random() > 0.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.5 + 0.1,
        glowIntensity: Math.random() * 0.5 + 0.5,
      })
    }

    let animationId: number

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      lines.forEach((line) => {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(0, 180, 216, ${line.opacity})`
        ctx.lineWidth = 1
        ctx.shadowColor = `rgba(0, 180, 216, ${line.glowIntensity})`
        ctx.shadowBlur = 8

        if (line.horizontal) {
          ctx.moveTo(line.x, line.y)
          ctx.lineTo(line.x + line.length, line.y)
          line.x += line.speed
          if (line.x > canvas.width) {
            line.x = -line.length
            line.y = Math.random() * canvas.height
          }
        } else {
          ctx.moveTo(line.x, line.y)
          ctx.lineTo(line.x, line.y + line.length)
          line.y += line.speed
          if (line.y > canvas.height) {
            line.y = -line.length
            line.x = Math.random() * canvas.width
          }
        }

        ctx.stroke()
        ctx.shadowBlur = 0

        // Draw corner nodes
        if (Math.random() > 0.99) {
          ctx.fillStyle = `rgba(0, 180, 216, ${line.opacity * 2})`
          ctx.fillRect(line.x - 2, line.y - 2, 4, 4)
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-background"
      style={{ background: "linear-gradient(to bottom, #000000, #0a0a0a)" }}
    />
  )
}
