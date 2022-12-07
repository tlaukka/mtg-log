import React from 'react'

function useDomReady () {
  const [domReady, setDomReady] = React.useState(false)

  React.useLayoutEffect(
    () => {
      setDomReady(true)
    },
    []
  )

  return domReady
}

export default useDomReady
