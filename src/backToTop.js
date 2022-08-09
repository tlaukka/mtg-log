import { animateScroll } from 'react-scroll'

function backToTop (containerId, duration = 200, delay = 0) {
  animateScroll.scrollToTop({
    containerId,
    duration,
    delay
  })
}

export default backToTop
