import styled from '@emotion/styled'
import React from 'react'
import ReactDOM from 'react-dom'
import Colors from './Colors'
import constants from './constants'

function SearchBar () {
  return (
    <SearchBarContainer>
      <div id={'search-input-bar'}></div>
    </SearchBarContainer>
  )
}

function InputBar ({ onSubmit, children }) {
  const [domReady, setDomReady] = React.useState(false)

  React.useEffect(
    () => {
      setDomReady(true)
    },
    []
  )

  function handleSubmit (e) {
    e.preventDefault()
    onSubmit && onSubmit()
  }

  if (!domReady) {
    return null
  }

  return ReactDOM.createPortal(
    <InputBarContainer onSubmit={handleSubmit}>
      {children}
    </InputBarContainer>,
    document.getElementById('search-input-bar')
  )
}

const SearchBarContainer = styled('div')({
  height: 62,
  backgroundColor: Colors.backgroundLight
})

const InputBarContainer = styled('form')({
  display: 'flex',
  flex: 1,
  gap: 12,
  padding: 12
})

SearchBar.InputBar = InputBar

export default SearchBar
