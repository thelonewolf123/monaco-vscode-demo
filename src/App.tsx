import { editor } from 'monaco-editor'
import { useEffect, useRef } from 'react'
import { Uri } from 'vscode'
import { createConfiguredEditor, createModelReference } from 'vscode/monaco'
import { initialize } from 'vscode/services'

import getModelOverride from '@codingame/monaco-vscode-model-service-override'
import getViewsOverride from '@codingame/monaco-vscode-views-service-override'

function App() {
    const editorRef = useRef<HTMLDivElement>(null)
    // const editorInstance = useRef<editor.IStandaloneCodeEditor>()
    useEffect(() => {
        initialize({
            ...getModelOverride(),
            ...getViewsOverride()
        })

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
