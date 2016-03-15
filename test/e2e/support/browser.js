import Nightmare from 'nightmare'

export function createBrowser() {
  return Nightmare({
    show: false,
    waitTimeout: 5 * 1000,
    webPreferences: {
      webSecurity: false
    }
  })
}
