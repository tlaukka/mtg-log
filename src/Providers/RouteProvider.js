import React from 'react'

export const Route = {
  list: 'list',
  search: 'search'
}

export const RouteContext = React.createContext()

export function useRoute () {
  return React.useContext(RouteContext)
}

function RouteProvider ({ children }) {
  const [route, setRoute] = React.useState(Route.search)

  return (
    <RouteContext.Provider value={{ route, setRoute }}>
      {children}
    </RouteContext.Provider>
  )
}

export default RouteProvider
