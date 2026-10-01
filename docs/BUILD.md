# Windows build

Install Node.js 24 LTS, Rust stable, WebView2, and Visual Studio Build Tools with the Desktop development with C++ workload.

From PowerShell:

```powershell
npm install
npm run build
npm run tauri build
```

Development:

```powershell
npm run tauri:dev
```

If Rust dependencies fail to resolve, update the stable Rust toolchain and retry before changing pinned application dependencies.
