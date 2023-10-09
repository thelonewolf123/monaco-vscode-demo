import './setup'

import { useEffect, useRef } from 'react'

import {
    attachPart,
    isPartVisibile,
    onPartVisibilityChange,
    Parts
} from '@codingame/monaco-vscode-views-service-override'

function App() {
    const editorRef = useRef<HTMLDivElement>(null)
    // const editorInstance = useRef<editor.IStandaloneCodeEditor>()
    useEffect(() => {
        async function handle() {
            // const modelRef = await createModelReference(
            //     Uri.file('src/App.tsx'),
            //     'const a = 1'
            // )
            // modelRef.object.setLanguageId('typescript')
            // if (!editorRef.current) return
            // editorInstance.current = createConfiguredEditor(editorRef.current, {
            //     language: 'typescript'
            // })
            // editorInstance.current.setModel(modelRef.object.textEditorModel)

            await new Promise((resolve) => setTimeout(resolve, 10000))

            if (!editorRef.current) return

            const part = Parts.EDITOR_PART
            attachPart(part, editorRef.current)

            if (!isPartVisibile(part)) {
                editorRef.current.style.display = 'none'
            }

            onPartVisibilityChange(part, (visible) => {
                if (!editorRef.current) return
                editorRef.current.style.display = visible ? 'block' : 'none'
            })
        }

        handle()
    }, [])
    return (
        <div
            ref={editorRef}
            style={{
                height: '100vh'
            }}
        ></div>
    )
}

export default App
