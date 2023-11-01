"use client"
import React from 'react'
import { Provider } from 'react-redux'
import { store } from './store'

export const AppProvider = ( {children}: { children: React.ReactNode}) => {
    return (
        <Provider store={store}>
            {/* Provider is on the way */}
                        {children}</Provider>
    )
}
