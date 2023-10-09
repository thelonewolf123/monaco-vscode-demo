import './setup'
import '@codingame/monaco-vscode-css-default-extension'
import '@codingame/monaco-vscode-diff-default-extension'
import '@codingame/monaco-vscode-html-default-extension'
import '@codingame/monaco-vscode-javascript-default-extension'
import '@codingame/monaco-vscode-json-default-extension'
import '@codingame/monaco-vscode-markdown-basics-default-extension'
import '@codingame/monaco-vscode-scss-default-extension'
import '@codingame/monaco-vscode-typescript-basics-default-extension'
import '@codingame/monaco-vscode-yaml-default-extension'
import '@codingame/monaco-vscode-theme-defaults-default-extension'
import '@codingame/monaco-vscode-theme-seti-default-extension'
import '@codingame/monaco-vscode-references-view-default-extension'
import '@codingame/monaco-vscode-media-preview-default-extension'
import '@codingame/monaco-vscode-json-language-features-default-extension'
import '@codingame/monaco-vscode-typescript-language-features-default-extension'
import '@codingame/monaco-vscode-html-language-features-default-extension'
import '@codingame/monaco-vscode-css-language-features-default-extension'
import '@codingame/monaco-vscode-markdown-language-features-default-extension'

import { useEffect, useRef } from 'react'

import {
    attachPart,
    isPartVisibile,
    onPartVisibilityChange,
    Parts
} from '@codingame/monaco-vscode-views-service-override'

function App() {
    const editorRef = useRef<HTMLDivElement>(null)
    const explorerRef = useRef<HTMLDivElement>(null)
    const auxRef = useRef<HTMLDivElement>(null)
    // const editorInstance = useRef<editor.IStandaloneCodeEditor>()
    useEffect(() => {
        async function handle() {
            if (!editorRef.current || !explorerRef.current || !auxRef.current)
                return

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

            const auxPart = Parts.STATUSBAR_PART
            attachPart(auxPart, auxRef.current)

            if (!isPartVisibile(explorerPart)) {
                auxRef.current.style.display = 'none'
            }

            onPartVisibilityChange(explorerPart, (visible) => {
                if (!auxRef.current) return
                auxRef.current.style.display = visible ? 'block' : 'none'
            })
        }

        handle()
    }, [])
    return (
        <>
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
            <div
                ref={auxRef}
                style={{
                    height: '20vh'
                }}
            ></div>
        </>
    )
}

export default App
