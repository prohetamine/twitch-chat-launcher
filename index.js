const { BrowserWindow, app, Menu } = require('electron')
const prompt = require('electron-prompt')



;(async () => {
  await app.whenReady()

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    alwaysOnTop: true,
    frame: false,
    backgroundColor: 'transparent',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  await win.loadFile(__dirname+'/connect.html')

  win.webContents.once('update-target-url', (event) => {
    const isTwitch = !!event.sender.getURL().match(/https:\/\/www.twitch.tv\/embed\//)

    console.log(isTwitch)
    if (!isTwitch) {
      return
    }

    win.webContents.executeJavaScript(`
      const electron = require('electron')

      const draggablePanel  = document.querySelector("#root > div > div.Layout-sc-nxg1ff-0.bhxQWy > div > div > div")
      draggablePanel.style['-webkit-user-select'] = 'none'
      draggablePanel.style['-webkit-app-region'] = 'drag'

      const box = document.createElement('div')
      box.style.position = 'absolute'
      box.style.zIndex = '99999'
      box.style.left = '10px'
      box.style.position = '10px'
      box.style.cursor = 'pointer'
      box.style.width = '50px'
      box.style.height = '50px'
      box.style.display = 'flex'
      box.style.justifyContent = 'center'
      box.style.alignItems = 'center'
      box.style.boxSizing = 'border-box'
      box.style.padding = '14px'
      box.innerHTML = '<svg width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px" class="ScIconSVG-sc-1bgeryd-1 eOJUoR"><g><path d="M8.5 10L4 5.5 5.5 4 10 8.5 14.5 4 16 5.5 11.5 10l4.5 4.5-1.5 1.5-4.5-4.5L5.5 16 4 14.5 8.5 10z"></path></g></svg>'
      document.body.appendChild(box)

      box.addEventListener('click', () => {
        electron.webFrame.context.close()
      })

      new Promise(res => {
        const timeId = setInterval(() => {
          if (document.querySelector('[class="simplebar-content"]')) {
            clearInterval(timeId)
            res()
          }
        }, 1000)
      }).then(() => {
        document.querySelectorAll('*').forEach(elem => {
          if (
            window.getComputedStyle(elem).background.match(/(255, 255, 255|0, 255, 170)/) ||
            window.getComputedStyle(elem).backgroundColor.match(/(255, 255, 255|0, 255, 170)/)
            ) {
              elem.setAttribute( 'style', 'background: #ffffff00 !important' );
           }
        })

        document.body.backgroundImage = '/image.gif'
      })
    `)
  })

})()
