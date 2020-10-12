#!/usr/bin/env node

import { join } from 'path'
import { execSync } from 'child_process'
import copy from 'recursive-copy'
import rimraf from 'rimraf'

// Enhances source files inside /app with a fresh RN project template.
(async () => {
  const appName = 'NavigationApp'

  console.log('Initializing a fresh RN project...')

  // Remove local CLI, as it interferes with the global.
  rimraf.sync('node_modules/@react-native-community/cli')

  // Initialize RN project.
  execSync(`react-native init ${appName}`, {
    cwd: 'app',
    // Write output to console.
    stdio: 'inherit'
  })

  // Copy to destination directory, leaving source files untouched.
  await copy(`app/${appName}`, 'app', {
    dot: true,
    overwrite: false,
    filter: ['**/*', '!App.js']
  })

  // Remove temporary project directory.
  rimraf.sync(`app/${appName}`)

  // Install this package locally, avoiding symlinks.
  execSync('npm install $(npm pack .. | tail -1)', {
    cwd: join(__dirname, 'app'),
    stdio: 'inherit'
  })

  // TODO add to scripts: https://www.npmjs.com/package/edit-json-file

  console.log('🍞 React Native App created inside /app.')
})()
