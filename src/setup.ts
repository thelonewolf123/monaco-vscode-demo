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
import '@codingame/monaco-vscode-json-language-features-default-extension'
import '@codingame/monaco-vscode-typescript-language-features-default-extension'
import '@codingame/monaco-vscode-html-language-features-default-extension'
import '@codingame/monaco-vscode-css-language-features-default-extension'
import '@codingame/monaco-vscode-markdown-language-features-default-extension'

import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker'
import { initialize as initializeVscodeExtensions } from 'vscode/extensions'
import {
    getService,
    ILogService,
    initialize as initializeMonacoService,
    IStorageService,
    LogLevel,
    StandaloneServices
} from 'vscode/services'
import ExtensionHostWorker from 'vscode/workers/extensionHost.worker?worker'

import getAccessibilityServiceOverride from '@codingame/monaco-vscode-accessibility-service-override'
import getAudioCueServiceOverride from '@codingame/monaco-vscode-audio-cue-service-override'
import getConfigurationServiceOverride from '@codingame/monaco-vscode-configuration-service-override'
import getDebugServiceOverride from '@codingame/monaco-vscode-debug-service-override'
import getDialogsServiceOverride from '@codingame/monaco-vscode-dialogs-service-override'
import getEnvironmentServiceOverride from '@codingame/monaco-vscode-environment-service-override'
import getExtensionServiceOverride from '@codingame/monaco-vscode-extensions-service-override'
import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override'
import getLanguageDetectionWorkerServiceOverride from '@codingame/monaco-vscode-language-detection-worker-service-override'
import LanguageDetectionWorker from '@codingame/monaco-vscode-language-detection-worker-service-override/worker?worker'
import getLanguagesServiceOverride from '@codingame/monaco-vscode-languages-service-override'
import getLifecycleServiceOverride from '@codingame/monaco-vscode-lifecycle-service-override'
import getMarkersServiceOverride from '@codingame/monaco-vscode-markers-service-override'
import getModelServiceOverride from '@codingame/monaco-vscode-model-service-override'
import getNotificationServiceOverride from '@codingame/monaco-vscode-notifications-service-override'
import getOutputServiceOverride from '@codingame/monaco-vscode-output-service-override'
import OutputLinkComputerWorker from '@codingame/monaco-vscode-output-service-override/worker?worker'
import getPreferencesServiceOverride from '@codingame/monaco-vscode-preferences-service-override'
import getQuickAccessServiceOverride from '@codingame/monaco-vscode-quickaccess-service-override'
import getSearchServiceOverride from '@codingame/monaco-vscode-search-service-override'
import getSnippetServiceOverride from '@codingame/monaco-vscode-snippets-service-override'
import getStorageServiceOverride, {
    BrowserStorageService
} from '@codingame/monaco-vscode-storage-service-override'
import getTextmateServiceOverride from '@codingame/monaco-vscode-textmate-service-override'
import TextMateWorker from '@codingame/monaco-vscode-textmate-service-override/worker?worker'
import getThemeServiceOverride from '@codingame/monaco-vscode-theme-service-override'
import getBannerServiceOverride from '@codingame/monaco-vscode-view-banner-service-override'
import getStatusBarServiceOverride from '@codingame/monaco-vscode-view-status-bar-service-override'
import getTitleBarServiceOverride from '@codingame/monaco-vscode-view-title-bar-service-override'
import getViewsServiceOverride, {
    isEditorPartVisible
} from '@codingame/monaco-vscode-views-service-override'
import getWorkspaceTrustOverride from '@codingame/monaco-vscode-workspace-trust-service-override'

import { openNewCodeEditor } from './editor'
import { toCrossOriginWorker, toWorkerConfig } from './tools/workers'

// Workers
export type WorkerLoader = () => Worker
const workerLoaders: Partial<Record<string, WorkerLoader>> = {
    editorWorkerService: () => new (toCrossOriginWorker(EditorWorker))(),
    textMateWorker: () => new (toCrossOriginWorker(TextMateWorker))(),
    outputLinkComputer: () =>
        new (toCrossOriginWorker(OutputLinkComputerWorker))(),
    languageDetectionWorkerService: () =>
        new (toCrossOriginWorker(LanguageDetectionWorker))()
}
window.MonacoEnvironment = {
    getWorker: function (moduleId, label) {
        const workerFactory = workerLoaders[label]
        if (workerFactory != null) {
            return workerFactory()
        }
        throw new Error(`Unimplemented worker ${label} (${moduleId})`)
    }
}

const params = new URL(document.location.href).searchParams
const remoteAuthority = params.get('remoteAuthority') ?? undefined
const remotePath =
    remoteAuthority != null ? params.get('remotePath') ?? undefined : undefined

export async function initMonacoServiceOverride() {
    // Override services
    await initializeMonacoService({
        ...getExtensionServiceOverride(toWorkerConfig(ExtensionHostWorker)),
        ...getModelServiceOverride(),
        ...getNotificationServiceOverride(),
        ...getDialogsServiceOverride(),
        ...getConfigurationServiceOverride(
            remotePath == null
                ? monaco.Uri.file('/tmp')
                : {
                      id: 'remote-workspace',
                      uri: monaco.Uri.from({
                          scheme: 'vscode-remote',
                          path: remotePath,
                          authority: remoteAuthority
                      })
                  }
        ),
        ...getKeybindingsServiceOverride(),
        ...getTextmateServiceOverride(),
        ...getThemeServiceOverride(),
        ...getLanguagesServiceOverride(),
        ...getAudioCueServiceOverride(),
        ...getDebugServiceOverride(),
        ...getPreferencesServiceOverride(),
        ...getViewsServiceOverride(openNewCodeEditor),
        ...getBannerServiceOverride(),
        ...getStatusBarServiceOverride(),
        ...getTitleBarServiceOverride(),
        ...getSnippetServiceOverride(),
        ...getQuickAccessServiceOverride({
            isKeybindingConfigurationVisible: isEditorPartVisible,
            shouldUseGlobalPicker: (_editor, isStandalone) =>
                !isStandalone && isEditorPartVisible()
        }),
        ...getOutputServiceOverride(),
        ...getSearchServiceOverride(),
        ...getMarkersServiceOverride(),
        ...getAccessibilityServiceOverride(),
        ...getLanguageDetectionWorkerServiceOverride(),
        ...getStorageServiceOverride(),
        ...getLifecycleServiceOverride(),
        ...getEnvironmentServiceOverride({
            remoteAuthority,
            enableWorkspaceTrust: true
        }),
        ...getWorkspaceTrustOverride()
    })
    StandaloneServices.get(ILogService).setLevel(LogLevel.Off)

    await initializeVscodeExtensions()
}

export async function clearStorage(): Promise<void> {
    await ((await getService(IStorageService)) as BrowserStorageService).clear()
}

await initMonacoServiceOverride()
