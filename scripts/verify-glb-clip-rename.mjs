#!/usr/bin/env node
import { VERIFIED_FILE_TO_CANONICAL } from '../src/constants/glbClipRenameMap.js'

const canonicalValues = Object.values(VERIFIED_FILE_TO_CANONICAL)
const files = Object.keys(VERIFIED_FILE_TO_CANONICAL)

if (new Set(canonicalValues).size !== canonicalValues.length) {
  console.error('ERROR: duplicate canonical names')
  process.exit(1)
}

if (new Set(files).size !== files.length) {
  console.error('ERROR: duplicate file keys')
  process.exit(1)
}

console.log('VERIFIED_FILE_TO_CANONICAL —', files.length, 'clips\n')
for (const [file, canonical] of Object.entries(VERIFIED_FILE_TO_CANONICAL)) {
  console.log(`${file.padEnd(28)} => ${canonical}`)
}

console.log('\nCANONICAL_TO_FILE (play):\n')
for (const [canonical, file] of Object.entries(
  Object.fromEntries(
    Object.entries(VERIFIED_FILE_TO_CANONICAL).map(([file, canonical]) => [canonical, file]),
  ),
).sort()) {
  console.log(`${canonical.padEnd(28)} => ${file}`)
}

console.log('\nOK — bijection verified')
