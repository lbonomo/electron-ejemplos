// const electron = require('electron')

const { app, Menu, Tray, BrowserWindow } = require('electron')
const path = require('path')

// https://electronjs.org/docs/faq#my-apps-windowtray-disappeared-after-a-few-minutes
let tray = null
let about = null

function About() {
   // Creo la ventana "About"
   about = new BrowserWindow({
      width: 400,
      height: 250,
      resizable: false,
      minimizable: false,
      maximizable: false,
      closable: false,
      alwaysOnTop: true,
      modal: true,
      // type: 'splash',
      // type: 'notification',
    })
   // about.setIgnoreMouseEvents(true)
   about.hide() // Oculta, en principio
   // Asigno el contenido HTML a about
   const renderPath = path.join(__dirname, 'render/index.html')
   about.loadFile(renderPath)

   about.on('close', (e) => {
      e.preventDefault()
      about.hide()
   })
   return about
}

app.on('ready', () => {
   about = About()
   // Defino el icono
   // Imagen
   const iconPath = path.join(__dirname, 'icon.png')
   // const tray = new Tray(iconPath)
   tray = new Tray(iconPath)

   // Menu
   const contextMenu = Menu.buildFromTemplate([
      { label: 'Información', click: () => { about.isVisible() ? about.hide() : about.show() } },
      { type: 'separator' },
      { label: 'Salir', click: () => {
         about.destroy()
         app.quit()
      }},
   ])
   // Aplico el menu
   tray.setContextMenu(contextMenu)
})

// Evito que se cierre la aplicacion cuando cierro "About"
app.on('window-all-closed', (e) => {
   e.preventDefault()
})
