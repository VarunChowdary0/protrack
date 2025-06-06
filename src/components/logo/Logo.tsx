import Image from 'next/image'
import React from 'react'

interface LogoProps {
    height?: number
    width?: number
    className?: string
}
const Logo:React.FC<LogoProps> = (props) => {
  return (
    <div>
        <Image
            src="/logo.png"
            alt="Protrack Logo"
            width={props.width || 50}
            height={props.height || 50}
            className={`rounded-full ${props.className || ''}`}
        />
    </div>
  )
}

export default Logo