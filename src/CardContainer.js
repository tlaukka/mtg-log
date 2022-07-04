import React from 'react'
import styled from '@emotion/styled'
import Button from './Button'
import { Route, useRoute } from './RouteProvider'

function CardContainer () {
  const { setRoute } = useRoute()

  return (
    <>
      <Button onClick={() => setRoute(Route.search)}>Search</Button>
      <div>asdsdsd</div>
    </>
  )
}

export default CardContainer
