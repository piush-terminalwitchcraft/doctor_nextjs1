import React, {ReactNode} from 'react'
import "./../../globals.css"

interface PopupProps{
    children: ReactNode;
}

export default function Popup({children}: PopupProps) {
  return (
    <main className='fixed inset-0 flex items-center justify-center z-50 '>
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 blur">
        {/* Background overlay */}
      </div>
      <div className="bg-red p-8 rounded-lg z-10">
        {/* Popup content */}
        <h2 className="text-xl font-bold mb-4">{children}</h2>
        </div>
    </main>
  )
}
