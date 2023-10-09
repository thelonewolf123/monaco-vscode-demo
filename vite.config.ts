import * as fs from 'fs'
import path from 'path'
import url from 'url'
import { defineConfig } from 'vite'

const cdnDomain = 'http://127.0.0.2:5173'

export default defineConfig({
    build: {
        target: 'esnext'
    },
    plugins: [
        {
            // For the *-language-features extensions which use SharedArrayBuffer
            name: 'configure-response-headers',
            apply: 'serve',
            configureServer: (server) => {
                server.middlewares.use((_req, res, next) => {
                    res.setHeader(
                        'Cross-Origin-Embedder-Policy',
                        'require-corp'
                    )
                    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
                    res.setHeader(
                        'Cross-Origin-Resource-Policy',
                        'cross-origin'
                    )
                    next()
                })
            }
        },
        {
            name: 'force-prevent-transform-assets',
            apply: 'serve',
            configureServer(server) {
                return () => {
                    server.middlewares.use(async (req, res, next) => {
                        if (req.originalUrl != null) {
                            const pathname = new URL(
                                req.originalUrl,
                                import.meta.url
                            ).pathname
                            if (pathname.endsWith('.html')) {
                                res.setHeader('Content-Type', 'text/html')
                                res.writeHead(200)
                                res.write(
                                    fs.readFileSync(
                                        path.join(__dirname, pathname)
                                    )
                                )
                                res.end()
                            }
                        }

                        next()
                    })
                }
            }
        }
    ],
    optimizeDeps: {
        // This is require because vscode is a local dependency
        // and vite doesn't want to optimize it and the number of modules makes chrome hang
        include: [
            'vscode',
            'vscode/extensions',
            'vscode/services',
            'vscode/monaco',
            '@codingame/monaco-vscode-model-service-override',
            '@codingame/monaco-vscode-editor-service-override',
            '@codingame/monaco-vscode-extensions-service-override',
            '@codingame/monaco-vscode-notifications-service-override',
            '@codingame/monaco-vscode-bulk-edit-service-override',
            '@codingame/monaco-vscode-dialogs-service-override',
            '@codingame/monaco-vscode-configuration-service-override',
            '@codingame/monaco-vscode-keybindings-service-override',
            '@codingame/monaco-vscode-textmate-service-override',
            '@codingame/monaco-vscode-theme-service-override',
            '@codingame/monaco-vscode-languages-service-override',
            '@codingame/monaco-vscode-audio-cue-service-override',
            '@codingame/monaco-vscode-views-service-override',
            '@codingame/monaco-vscode-view-banner-service-override',
            '@codingame/monaco-vscode-view-status-bar-service-override',
            '@codingame/monaco-vscode-view-title-bar-service-override',
            '@codingame/monaco-vscode-quickaccess-service-override',
            '@codingame/monaco-vscode-debug-service-override',
            '@codingame/monaco-vscode-preferences-service-override',
            '@codingame/monaco-vscode-snippets-service-override',
            '@codingame/monaco-vscode-files-service-override',
            '@codingame/monaco-vscode-output-service-override',
            '@codingame/monaco-vscode-terminal-service-override',
            '@codingame/monaco-vscode-search-service-override',
            '@codingame/monaco-vscode-markers-service-override',
            '@codingame/monaco-vscode-accessibility-service-override',
            '@codingame/monaco-vscode-storage-service-override',
            '@codingame/monaco-vscode-language-detection-worker-service-override',
            '@codingame/monaco-vscode-remote-agent-service-override',
            '@codingame/monaco-vscode-environment-service-override',
            '@codingame/monaco-vscode-lifecycle-service-override',
            '@codingame/monaco-vscode-workspace-trust-service-override',
            'vscode/workers/textmate.worker'
        ],
        esbuildOptions: {
            plugins: [
                {
                    name: 'import.meta.url',
                    setup({ onLoad }) {
                        // Help vite that bundles/move files in dev mode without touching `import.meta.url` which breaks asset urls
                        onLoad(
                            { filter: /.*\.js/, namespace: 'file' },
                            async (args) => {
                                const code = fs.readFileSync(args.path, 'utf8')

                                const assetImportMetaUrlRE =
                                    /\bnew\s+URL\s*\(\s*('[^']+'|"[^"]+"|`[^`]+`)\s*,\s*import\.meta\.url\s*(?:,\s*)?\)/g
                                let i = 0
                                let newCode = ''
                                for (
                                    let match = assetImportMetaUrlRE.exec(code);
                                    match != null;
                                    match = assetImportMetaUrlRE.exec(code)
                                ) {
                                    newCode += code.slice(i, match.index)

                                    const path = match[1].slice(1, -1)
                                    if (!import.meta.resolve) return
                                    const resolved = await import.meta.resolve!(
                                        path,
                                        url.pathToFileURL(args.path)
                                    )

                                    newCode += `new URL(${JSON.stringify(
                                        url.fileURLToPath(resolved)
                                    )}, import.meta.url)`

                                    i = assetImportMetaUrlRE.lastIndex
                                }
                                newCode += code.slice(i)

                                return { contents: newCode }
                            }
                        )
                    }
                }
            ]
        }
    },
    server: {
        port: 5173,
        origin: cdnDomain,
        host: '0.0.0.0',
        fs: {
            allow: ['../'] // allow to load codicon.ttf from monaco-editor in the parent folder
        }
    },
    define: {
        rootDirectory: JSON.stringify(__dirname)
    },
    resolve: {
        dedupe: ['monaco-editor', 'vscode']
    }
})
