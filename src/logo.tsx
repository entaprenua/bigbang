import { Component } from "solid-js"

interface LogoProps {
  class?: string
}

const Logo: Component<LogoProps> = (props) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class={props.class}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6366f1" />
          <stop offset="100%" stop-color="#8b5cf6" />
        </linearGradient>
      </defs>
      
      {/* Shopping bag / Store icon */}
      <rect
        x="4"
        y="10"
        width="40"
        height="32"
        rx="4"
        fill="url(#logoGradient)"
      />
      
      {/* Store front / window */}
      <rect
        x="10"
        y="16"
        width="28"
        height="20"
        rx="2"
        fill="white"
        fill-opacity="0.95"
      />
      
      {/* E letter for Entaprenua */}
      <path
        d="M15 22h18v3H15zM15 28h16v3H15zM15 34h12v3H15z"
        fill="url(#logoGradient)"
      />
      
      {/* Store roof / awning detail */}
      <path
        d="M6 10L24 4L42 10"
        stroke="url(#logoGradient)"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </svg>
  )
}

export default Logo
