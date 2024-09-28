import { execSync } from 'node:child_process'
import { cpSync, renameSync, rmSync } from 'node:fs'

// Enhances source files inside /app with a fresh RN project template.
const appName = 'ReactigationApp'

console.log('⌛ Initializing a fresh RN project...')

execSync(`bunx @react-native-community/cli init ${appName} --skip-git-init true --install-pods true`, {
  // Write output to cnosole.
  stdio: 'inherit',
})

cpSync('app/component', `${appName}/component`, { recursive: true })
cpSync('app/App.tsx', `${appName}/App.tsx`)
cpSync('app/logo.png', `${appName}/logo.png`)
rmSync('app', { recursive: true })
renameSync(appName, 'app')

const output = execSync('bun pm pack', {
  encoding: 'utf-8',
})

const tgzFileName = output.match(/[\w.-]+\.tgz/)[0]

execSync(`bun install ../${tgzFileName}`, {
  cwd: './app',
})

console.log('')
console.log('🍞 React Native App created inside /app.')
console.log('🛠️  To run the example with the plugin included:')
console.log('🐚 cd app')
console.log('🐚 npm run ios / npm run android')
console.log('🌪️  To copy over the changes from the plugin source run:')
console.log('🐚 npm run watch')
console.log('🛠️  This will copy changes over to the app.')
