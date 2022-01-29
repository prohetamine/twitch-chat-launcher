const { BrowserWindow, app, Menu } = require('electron')

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
      const gen = require('color-generator')

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
      box.innerHTML = '<svg width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px" class="ScIconSVG-sc-1bgeryd-1 eOJUoR" style="color: #fff"><g><path d="M8.5 10L4 5.5 5.5 4 10 8.5 14.5 4 16 5.5 11.5 10l4.5 4.5-1.5 1.5-4.5-4.5L5.5 16 4 14.5 8.5 10z"></path></g></svg>'
      document.body.appendChild(box)

      box.addEventListener('click', () => {
        electron.webFrame.context.close()
      })

      new Promise(res => {
        const timeId = setInterval(() => {
          if (document.querySelector("#root > div > div.Layout-sc-nxg1ff-0.bhxQWy > div > div > section > div > div.InjectLayout-sc-588ddc-0.chat-list--default.cnTPsW.font-scale--default > div > div.scrollable-area > div.simplebar-scroll-content > div > div > div > span")) {
            clearInterval(timeId)
            res()
          }
        }, 1000)
      }).then(() => {
        document.querySelectorAll('*').forEach(elem => {
          elem.style.zIndex === '99999' || elem.setAttribute('style', 'color: #ffffff !important; -webkit-user-select: none; -webkit-app-region: drag;')
          if (
            window.getComputedStyle(elem).background.match(/(255, 255, 255|0, 255, 170)/) ||
            window.getComputedStyle(elem).backgroundColor.match(/(255, 255, 255|0, 255, 170)/)
          ) {
              elem.setAttribute('style', 'color: #ffffff; background: #ffffff00 !important; -webkit-user-select: none; -webkit-app-region: drag;')
          }
        })

        document.querySelector('[data-a-target="chat-input"]').setAttribute('style', 'color: #242424; background: #fff')

        document.body.setAttribute( 'style', 'background-image: url("https://github.com/prohetamine/twitch-chat-launcher/blob/main/image.gif?raw=true") !important; background-size: cover; background-color: #242424;');

        setInterval(() => {
          document.querySelectorAll('[class="chat-line__message"]').forEach((elem) => {
            elem.setAttribute('style', 'background:' + gen(0.8, 0.6).hexString() + '99; color: #ffffff')
          })
        }, 1000)
      })
    `)
  })

})()
