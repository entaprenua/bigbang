import type { APIEvent } from "@solidjs/start/server"
import { Resvg } from "@resvg/resvg-js"

const WIDTH = 1200
const HEIGHT = 630

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
}

function buildSvg(title: string, description: string): string {
  const escapedTitle = escapeXml(title)
  const escapedDesc = escapeXml(description)

  const titleLines: string[] = []
  if (escapedTitle.length <= 30) {
    titleLines.push(escapedTitle)
  } else {
    const words = escapedTitle.split(" ")
    let line = ""
    for (const word of words) {
      if ((line + word).length > 30) {
        if (line) titleLines.push(line)
        line = word
      } else {
        line = line ? `${line} ${word}` : word
      }
    }
    if (line) titleLines.push(line)
  }

  const titleY = titleLines.length > 1 ? 260 : 310
  const lineHeight = 72

  return `\
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${WIDTH}" y2="${HEIGHT}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect x="0" y="0" width="12" height="${HEIGHT}" fill="url(#accent)"/>
  <rect x="12" y="0" width="4" height="${HEIGHT}" fill="#6366f1" opacity="0.3"/>
  <text x="100" y="${titleY}" font-family="sans-serif" font-size="64" font-weight="700" fill="#ffffff">
    ${titleLines.map((l, i) => `<tspan x="100" dy="${i === 0 ? 0 : lineHeight}">${l}</tspan>`).join("")}
  </text>
  ${escapedDesc
    ? `<text x="100" y="${titleY + (titleLines.length > 1 ? titleLines.length * lineHeight : 90)}" font-family="sans-serif" font-size="28" font-weight="400" fill="#94a3b8">${escapedDesc.length > 80 ? escapedDesc.slice(0, 77) + "..." : escapedDesc}</text>`
    : ""}
  <text x="${WIDTH - 100}" y="${HEIGHT - 40}" font-family="sans-serif" font-size="14" font-weight="500" fill="#475569" text-anchor="end">entaprenua</text>
</svg>`
}

export async function GET(event: APIEvent) {
  const url = new URL(event.request.url)
  const title = url.searchParams.get("title")?.trim() || "Store"
  const description = url.searchParams.get("description")?.trim() || ""

  const svg = buildSvg(title, description)

  if (url.searchParams.get("format") === "svg") {
    return new Response(svg, {
      headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" },
    })
  }

  try {
    const resvg = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } })
    const png = resvg.render().asPng()

    return new Response(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    })
  } catch {
    return new Response(svg, {
      headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" },
    })
  }
}
