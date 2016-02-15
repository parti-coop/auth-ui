import Nightmare from 'nightmare'

export const createBrowser = () => (
  Nightmare({
    show: false,
    waitTimeout: 5 * 1000
  })
)

export default Nightmare
