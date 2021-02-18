#!/usr/bin/env node
import { join } from 'path'
import { execSync } from 'child_process'
import copy from 'recursive-copy'
import rimraf from 'rimraf'

// Enhances source files inside /app with a fresh RN project template.
const appName = 'NavigationApp'

console.log('Initializing a fresh RN project...')

// Initialize RN project.
execSync(`npx react-native init ${appName}`, {
  // Write output to console.
  stdio: 'inherit',
})

// Copy to destination directory, leaving source files untouched.
await copy(`${appName}`, 'app', {
  dot: true,
  overwrite: false,
  filter: ['**/*', '!App.js'],
})

// Remove temporary project directory.
rimraf.sync(appName)

// Install this package locally, avoiding symlinks.
execSync('npm install $(npm pack .. | tail -1)', {
  cwd: join(process.cwd(), 'app'),
  stdio: 'inherit',
})

// TODO add to scripts: https://www.npmjs.com/package/edit-json-file

console.log('🍞 React Native App created inside /app.')
