import { useEffect, useRef, useState } from 'react'

import {
    attachPart,
    isPartVisibile,
    onPartVisibilityChange,
    Parts
} from '@codingame/monaco-vscode-views-service-override'

import { initMonacoServiceOverride } from './setup'

export function WebIdeVscode() {
    const editorRef = useRef<HTMLDivElement>(null)
    const explorerRef = useRef<HTMLDivElement>(null)
    const [ideReady, setIdeReady] = useState(false)
    const isInitialized = useRef(false)

    useEffect(() => {
        if (isInitialized.current) return
        isInitialized.current = true

        initMonacoServiceOverride().then(() => {
            setIdeReady(true)
        })
    }, [])

    useEffect(() => {
        if (!editorRef.current || !explorerRef.current || !ideReady) return

        const views = [
            {
                part: Parts.EDITOR_PART,
                view: editorRef.current
            },
            {
                part: Parts.SIDEBAR_PART,
                view: explorerRef.current
            }
        ]

        views.map(({ part, view }) => {
            attachPart(part, view)

            if (!isPartVisibile(part)) {
                view.style.display = 'none'
            }

            onPartVisibilityChange(part, (visible) => {
                if (!view) return
                view.style.display = visible ? 'block' : 'none'
            })
        })
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
