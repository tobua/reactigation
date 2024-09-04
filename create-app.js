import { execSync } from 'child_process'
import { cpSync, readFileSync, renameSync, rmSync, mkdirSync } from 'fs'
import { join, resolve } from 'path'
import Arborist from '@npmcli/arborist'
import packlist from 'npm-packlist'

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

const packageName = JSON.parse(readFileSync('./package.json')).name
const packageDirectory = resolve(`app/node_modules/${packageName}`)

// Package files and copy them to app node_modules.
// Couldn't get symlinks to work with metro.
const arborist = new Arborist({ path: process.cwd() })
const tree = await arborist.loadActual()
const files = await packlist(tree)

mkdirSync(packageDirectory, { recursive: true })

files.forEach((file) => cpSync(join(process.cwd(), file), join(packageDirectory, file), { recursive: true }))

console.log('')
console.log('🍞 React Native App created inside /app.')
console.log('🛠️  To run the example with the plugin included:')
console.log('🐚 cd app')
console.log('🐚 npm run ios / npm run android')
console.log('🌪️  To copy over the changes from the plugin source run:')
console.log('🐚 npm run watch')
console.log('🛠️  This will copy changes over to the app.')
