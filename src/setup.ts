import * as monaco from 'monaco-editor'
import { initialize as initializeVscodeExtensions } from 'vscode/extensions'
import {
    getService,
    ILogService,
    initialize as initializeMonacoService,
    IStorageService,
    LogLevel,
    StandaloneServices
} from 'vscode/services'

import getAccessibilityServiceOverride from '@codingame/monaco-vscode-accessibility-service-override'
import getAudioCueServiceOverride from '@codingame/monaco-vscode-audio-cue-service-override'
import getConfigurationServiceOverride from '@codingame/monaco-vscode-configuration-service-override'
import getDebugServiceOverride from '@codingame/monaco-vscode-debug-service-override'
import getDialogsServiceOverride from '@codingame/monaco-vscode-dialogs-service-override'
import getEnvironmentServiceOverride from '@codingame/monaco-vscode-environment-service-override'
import getExtensionServiceOverride from '@codingame/monaco-vscode-extensions-service-override'
import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override'
import getLanguageDetectionWorkerServiceOverride from '@codingame/monaco-vscode-language-detection-worker-service-override'
import getLanguagesServiceOverride from '@codingame/monaco-vscode-languages-service-override'
import getLifecycleServiceOverride from '@codingame/monaco-vscode-lifecycle-service-override'
import getModelServiceOverride from '@codingame/monaco-vscode-model-service-override'
import getNotificationServiceOverride from '@codingame/monaco-vscode-notifications-service-override'
import getPreferencesServiceOverride from '@codingame/monaco-vscode-preferences-service-override'
import getQuickAccessServiceOverride from '@codingame/monaco-vscode-quickaccess-service-override'
import getSnippetServiceOverride from '@codingame/monaco-vscode-snippets-service-override'
import getStorageServiceOverride, {
    BrowserStorageService
} from '@codingame/monaco-vscode-storage-service-override'
import getTextmateServiceOverride from '@codingame/monaco-vscode-textmate-service-override'
import getThemeServiceOverride from '@codingame/monaco-vscode-theme-service-override'
import getBannerServiceOverride from '@codingame/monaco-vscode-view-banner-service-override'
import getStatusBarServiceOverride from '@codingame/monaco-vscode-view-status-bar-service-override'
import getTitleBarServiceOverride from '@codingame/monaco-vscode-view-title-bar-service-override'
import getViewsServiceOverride, {
    attachPart,
    isEditorPartVisible,
    isPartVisibile,
    onPartVisibilityChange,
    Parts
} from '@codingame/monaco-vscode-views-service-override'
import getWorkspaceTrustOverride from '@codingame/monaco-vscode-workspace-trust-service-override'

import { openNewCodeEditor } from './editor'

// Workers
export type WorkerLoader = () => Worker

const params = new URL(document.location.href).searchParams
const remoteAuthority = params.get('remoteAuthority') ?? undefined
const remotePath =
    remoteAuthority != null ? params.get('remotePath') ?? undefined : undefined

// Override services
await initializeMonacoService({
    ...getExtensionServiceOverride(),
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

export async function clearStorage(): Promise<void> {
    await ((await getService(IStorageService)) as BrowserStorageService).clear()
}

await initializeVscodeExtensions()

for (const { part, element } of [
    { part: Parts.TITLEBAR_PART, element: '#titleBar' },
    { part: Parts.BANNER_PART, element: '#banner' },
    { part: Parts.SIDEBAR_PART, element: '#sidebar' },
    { part: Parts.ACTIVITYBAR_PART, element: '#activityBar' },
    { part: Parts.PANEL_PART, element: '#panel' },
    { part: Parts.EDITOR_PART, element: '#editors' },
    { part: Parts.STATUSBAR_PART, element: '#statusBar' },
    { part: Parts.AUXILIARYBAR_PART, element: '#auxiliaryBar' }
]) {
    const el = document.querySelector<HTMLDivElement>(element)!
    attachPart(part, el)

    if (!isPartVisibile(part)) {
        el.style.display = 'none'
    }

    onPartVisibilityChange(part, (visible) => {
        el.style.display = visible ? 'block' : 'none'
    })
}
