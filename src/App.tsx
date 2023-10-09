import './setup'
import './features/intellisense'
import '@codingame/monaco-vscode-clojure-default-extension'
import '@codingame/monaco-vscode-coffeescript-default-extension'
import '@codingame/monaco-vscode-cpp-default-extension'
import '@codingame/monaco-vscode-csharp-default-extension'
import '@codingame/monaco-vscode-css-default-extension'
import '@codingame/monaco-vscode-diff-default-extension'
import '@codingame/monaco-vscode-fsharp-default-extension'
import '@codingame/monaco-vscode-go-default-extension'
import '@codingame/monaco-vscode-groovy-default-extension'
import '@codingame/monaco-vscode-html-default-extension'
import '@codingame/monaco-vscode-java-default-extension'
import '@codingame/monaco-vscode-javascript-default-extension'
import '@codingame/monaco-vscode-json-default-extension'
import '@codingame/monaco-vscode-julia-default-extension'
import '@codingame/monaco-vscode-lua-default-extension'
import '@codingame/monaco-vscode-markdown-basics-default-extension'
import '@codingame/monaco-vscode-objective-c-default-extension'
import '@codingame/monaco-vscode-perl-default-extension'
import '@codingame/monaco-vscode-php-default-extension'
import '@codingame/monaco-vscode-powershell-default-extension'
import '@codingame/monaco-vscode-python-default-extension'
import '@codingame/monaco-vscode-r-default-extension'
import '@codingame/monaco-vscode-ruby-default-extension'
import '@codingame/monaco-vscode-rust-default-extension'
import '@codingame/monaco-vscode-scss-default-extension'
import '@codingame/monaco-vscode-shellscript-default-extension'
import '@codingame/monaco-vscode-sql-default-extension'
import '@codingame/monaco-vscode-swift-default-extension'
import '@codingame/monaco-vscode-typescript-basics-default-extension'
import '@codingame/monaco-vscode-vb-default-extension'
import '@codingame/monaco-vscode-xml-default-extension'
import '@codingame/monaco-vscode-yaml-default-extension'
import '@codingame/monaco-vscode-theme-defaults-default-extension'
import '@codingame/monaco-vscode-theme-seti-default-extension'
import '@codingame/monaco-vscode-references-view-default-extension'
import '@codingame/monaco-vscode-search-result-default-extension'
import '@codingame/monaco-vscode-configuration-editing-default-extension'
import '@codingame/monaco-vscode-markdown-math-default-extension'
import '@codingame/monaco-vscode-npm-default-extension'
import '@codingame/monaco-vscode-media-preview-default-extension'

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
