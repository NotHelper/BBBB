$ErrorActionPreference = 'Stop'
Write-Host 'Building Brail Performance Monitor...'
npm install
npm run build
npm run tauri build
Write-Host 'Bundles:'
Get-ChildItem -Recurse -File src-tauri/target/release/bundle | Select-Object FullName, Length
