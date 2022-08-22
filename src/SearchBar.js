import styled from '@emotion/styled'
import React from 'react'
import ReactDOM from 'react-dom'
import Colors from './Colors'
import useDomReady from './useDomReady'
import useFadeIn from './useFadeIn'

function SearchBar () {
  return (
    <SearchBarContainer>
      <div id={'search-input-bar'}></div>
    </SearchBarContainer>
  )
}

function InputBar ({ onSubmit, children }) {
  const domReady = useDomReady()
  const fadeIn = useFadeIn(0.6)

  function handleSubmit (e) {
    e.preventDefault()
    onSubmit && onSubmit()
  }

  if (!domReady) {
    return null
  }

  return ReactDOM.createPortal(
    <InputBarContainer fadeIn={fadeIn} onSubmit={handleSubmit}>
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
})//, ({ fadeIn }) => fadeIn)

SearchBar.InputBar = InputBar

export default SearchBar
