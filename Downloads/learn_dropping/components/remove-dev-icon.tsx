"use client"

import { useEffect } from "react"

// This small component aggressively removes the dev overlay SVG icon that Next/Turbopack
// sometimes injects during development. It looks for the exact SVG signature provided
// by the user and removes it, and installs a MutationObserver to remove it if re-inserted.
export default function RemoveDevIcon() {
  useEffect(() => {
    if (typeof document === "undefined") return

    const matchesDevSvg = (el: SVGElement) => {
      try {
        // Check width/height and presence of the known gradient/id or paused paths
        if (el.getAttribute("width") === "40" && el.getAttribute("height") === "40") {
          const inner = el.innerHTML || ""
          if (inner.includes("next_logo_paint0") || inner.includes("next_logo_paint1") || inner.includes("class=\"paused\"")) {
            return true
          }
        }
        // also match svg elements containing a path with class paused
        const paused = el.querySelector('path.paused')
        if (paused) return true
      } catch (e) {
        // ignore
      }
      return false
    }

    const removeMatches = (root: ParentNode | null) => {
      if (!root) return
      const svgs = Array.from(root.querySelectorAll ? root.querySelectorAll('svg') : []) as SVGElement[]
      svgs.forEach((svg) => {
        if (matchesDevSvg(svg)) {
          // If the svg is nested in a fixed-position wrapper, remove the wrapper instead
          const wrapper = svg.closest('div[style*="position:fixed"], div[style*="position: fixed"]') as HTMLElement | null
          try {
            if (wrapper && wrapper.parentElement) wrapper.parentElement.removeChild(wrapper)
            else if (svg.parentElement) svg.parentElement.removeChild(svg)
          } catch (e) {
            // ignore removal errors
          }
        }
      })
    }

    // Initial pass
    removeMatches(document)

    // Watch for future insertions
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length) {
          m.addedNodes.forEach((node) => {
            if ((node as Element).nodeType === 1) {
              removeMatches(node as Element)
            }
          })
        }
      }
    })

    mo.observe(document.documentElement || document.body, { childList: true, subtree: true })

    // Stop observing after 30s to avoid long-running observers in production
    const timeout = setTimeout(() => mo.disconnect(), 30000)

    return () => {
      mo.disconnect()
      clearTimeout(timeout)
    }
  }, [])

  return null
}
