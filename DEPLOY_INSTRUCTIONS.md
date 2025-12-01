# Deploying as a Tauri v2 App on Fedora Linux

This guide explains how to package this React web application as a native desktop application using [Tauri v2](https://v2.tauri.app/) on Fedora Linux.

## Prerequisites

### 1. System Dependencies
Tauri relies on specific system libraries for compilation and the WebView. Open your terminal and run the following to install them on Fedora:

```bash
sudo dnf check-update
sudo dnf install webkit2gtk4.0-devel openssl-devel curl wget file libappindicator-gtk3-devel librsvg2-devel
```

> **Note:** If you are on a very new version of Fedora, you might need `webkit2gtk4.1-devel` if 4.0 is not available.

### 2. Rust & Cargo
Tauri is built with Rust. Install it using the official script:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Restart your terminal or run `source $HOME/.cargo/env` to activate it.

### 3. Node.js
Ensure you have Node.js (v18+) installed.

## Step 1: Install Tauri CLI

Add the Tauri v2 CLI to your project:

```bash
npm install -D @tauri-apps/cli@latest
```

## Step 2: Initialize Tauri

Initialize the Tauri configuration in your project root:

```bash
npx tauri init
```

Answer the prompts as follows:
- **Application name:** `markdown-unicode-converter`
- **Window title:** `Markdown Converter`
- **Frontend language:** `TypeScript / JavaScript`
- **Package manager:** `npm`
- **UI Template:** (Choose `React` if asked, or `none` since you have existing code)
- **Dev Server URL:** `http://localhost:5173` (Or whatever port Vite uses)
- **Frontend Dist:** `dist`

This will create a `src-tauri` directory containing the Rust backend configuration.

## Step 3: Configure Build Settings

Ensure your `package.json` scripts are set up to handle the desktop environment.

1. Open `package.json` and add/update the scripts:
   ```json
   "scripts": {
     "dev": "vite",
     "build": "tsc && vite build",
     "tauri": "tauri"
   }
   ```

2. **Important:** Since this app uses Google Gemini, you need to ensure the API Key is handled.
   - For a desktop app, you generally cannot rely on `window.aistudio` (which is specific to the web IDE environment).
   - You may need to create a `.env` file for development or allow the user to input their API key in the Settings modal you created.

## Step 4: Development Mode

To run the app in desktop mode locally:

```bash
npm run tauri dev
```

This command will:
1. Start your React frontend server.
2. Compile the Rust backend.
3. Launch a native window showing your app.

## Step 5: Build for Distribution

To create a deployable package (RPM, AppImage, or Deb):

1. **Update Identifier:** Open `src-tauri/tauri.conf.json` and ensure the `identifier` is unique (e.g., `com.yourname.markdownconverter`).

2. **Run Build:**
   ```bash
   npm run tauri build
   ```

### Output
Once finished, your binaries will be located in:
`src-tauri/target/release/bundle/`

- **RPM:** `src-tauri/target/release/bundle/rpm/markdown-unicode-converter-x.x.x.x86_64.rpm` (Native Fedora installer)
- **AppImage:** `src-tauri/target/release/bundle/appimage/markdown-unicode-converter-x.x.x.AppImage` (Portable executable)

## Troubleshooting

**"Blank White Screen" in Production Build:**
If your app runs in dev but is blank in build, ensure your `index.html` loads scripts correctly relative to the root.
- Ensure your `vite.config.ts` (if exists) has `base: './'`.
- Since this project currently uses CDN links for React (`https://aistudiocdn.com/...`), the desktop app **must have internet access** to function. For a completely offline app, you must `npm install react react-dom` and bundle them locally instead of using the CDN import map.
