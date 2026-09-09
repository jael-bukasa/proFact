const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');
const fs = require('fs');

let backendProcess = null;

function startBackend() {
  // Détecte si on est en mode production (packagé) ou développement
  const isPackaged = app.isPackaged;
  
  // Chemin robuste vers le backend selon l'environnement
  const backendPath = isPackaged
    ? path.join(path.dirname(app.getAppPath()), 'app.asar.unpacked', 'backend', 'src', 'index.js')
    : path.join(__dirname, '../../backend/src/index.js');

  // Si le chemin direct échoue en prod, on pointe sur le dossier parent de l'app
  const resolvedBackendPath = isPackaged 
    ? path.join(process.resourcesPath, '../backend/src/index.js')
    : path.join(__dirname, '../../backend/src/index.js');

  backendProcess = fork(resolvedBackendPath, [], {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc']
  });

  backendProcess.on('error', (err) => {
    console.error('Erreur du processus backend :', err);
  });
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 700,
    title: "ProFact",
    autoHideMenuBar: true,
    // Utilisation d'app.getAppPath() pour charger correctement l'icône peu importe l'environnement
    icon: path.join(app.getAppPath(), 'public/profact-icone.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../dist-react/index.html')}`;
  mainWindow.loadURL(startUrl);
}

app.whenReady().then(() => {
  startBackend();
  createWindow();
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});