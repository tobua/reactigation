#!/usr/bin/env node
import { cpSync, renameSync, rmSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

// Enhances source files inside /app with a fresh RN project template.
const appName = 'ReactigationApp'

console.log('⌛ Initializing a fresh RN project...')

execSync(`npx react-native init ${appName} --skip-git-init true --install-pods true`, {
  // Write output to cnosole.
  stdio: 'inherit',
})

cpSync('app/component', `${appName}/component`, { recursive: true })
cpSync('app/App.tsx', `${appName}/App.tsx`)
cpSync('app/logo.png', `${appName}/logo.png`)

rmSync('app', { recursive: true })

renameSync(appName, 'app')

// Run build to ensure distributed files for plugin exist.
execSync('npm run build', {
  stdio: 'inherit',
})

// Install this package locally, avoiding symlinks.
execSync('npm install $(npm pack .. | tail -1) --legacy-peer-deps', {
  cwd: join(process.cwd(), 'app'),
  stdio: 'inherit',
})

console.log('')
console.log('🍞 React Native App created inside /app.')
console.log('🛠️  To run the example with the plugin included:')
console.log('🐚 cd app')
console.log('🐚 npm run ios / npm run android')
console.log('🌪️  To copy over the changes from the plugin source run:')
console.log('🐚 npm run watch')
console.log('🛠️  This will copy changes over to the app.')
