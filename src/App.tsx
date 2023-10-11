import './setup'

import { useEffect, useRef, useState } from 'react'

import {
    attachPart,
    isPartVisibile,
    onPartVisibilityChange,
    Parts
} from '@codingame/monaco-vscode-views-service-override'

function App() {
    const editorRef = useRef<HTMLDivElement>(null)
    const explorerRef = useRef<HTMLDivElement>(null)
    const [ideReady, setIdeReady] = useState(false)
    const isInitialized = useRef(false)

    useEffect(() => {
        setIdeReady(true)
    }, [])
    useEffect(() => {
        if (isInitialized.current) return

        async function handle() {
            if (!editorRef.current || !explorerRef.current || !ideReady) return

            const part = Parts.EDITOR_PART
            attachPart(part, editorRef.current)

            if (!isPartVisibile(part)) {
                editorRef.current.style.display = 'none'
            }

            onPartVisibilityChange(part, (visible) => {
                if (!editorRef.current) return
                editorRef.current.style.display = visible ? 'block' : 'none'
            })

            const explorerPart = Parts.SIDEBAR_PART
            attachPart(explorerPart, explorerRef.current)

            if (!isPartVisibile(explorerPart)) {
                explorerRef.current.style.display = 'none'
            }

            onPartVisibilityChange(explorerPart, (visible) => {
                if (!explorerRef.current) return
                explorerRef.current.style.display = visible ? 'block' : 'none'
            })

            isInitialized.current = true
        }

        handle()
    }, [ideReady])
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row'
            }}
        >
            <div
                ref={editorRef}
                style={{
                    height: '90vh',
                    width: '50%'
                }}
            ></div>

            <div
                ref={explorerRef}
                style={{
                    height: '90vh',
                    width: '50%'
                }}
            ></div>
        </div>
    )
}

export default App
