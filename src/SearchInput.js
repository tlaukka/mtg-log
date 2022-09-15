import styled from '@emotion/styled'
import React from 'react'
import Colors from './Colors'
import Icons from './Icon'
import LinkButton from './LinkButton'
import Spinner from './Spinner'

function SearchInput ({ fetching, onChange, onClear, ...rest }) {
  const input = React.useRef()

  const [search, setSearch] = React.useState('')

  function handleChange (e) {
    setSearch(e.target.value)
    onChange && onChange(e.target.value)
  }

  function handleClear () {
    setSearch('')
    input.current.value = ''
    onClear && onClear()
  }

  return (
    <SearchContainer>
      <Search
        ref={input}
        spellCheck={false}
        placeholder={'Search...'}
        onChange={handleChange}
        {...rest}
      />
      {search && (
        <SearchClear onClick={handleClear}>
          <Icons.Cross />
        </SearchClear>
      )}
      <SearchButtonSeparator />
      {fetching ? (
        <SearchSpinnerContainer>
          <Spinner size={16} />
        </SearchSpinnerContainer>
      ) : (
        <SearchButton type={'submit'}>
          <Icons.ArrowRight />
        </SearchButton>
      )}
    </SearchContainer>
  )
}

const SearchContainer = styled('div')({
  display: 'flex',
  flex: 2,
  justifyContent: 'center',
  position: 'relative',
  borderBottom: `2px solid ${Colors.foregroundDark}`
})

const Search = styled('input')({
  flex: 1,
  fontSize: 31,
  outline: 'none',
  border: 'none',
  color: Colors.control,
  backgroundColor: Colors.backgroundLight,
  '::placeholder': {
    color: Colors.foregroundDark
  }
})

const SearchButtonSeparator = styled('span')({
  width: 1,
  margin: '8px 0',
  backgroundColor: Colors.foregroundDark
})

const searchButtonStyles = {
  fontSize: 22,
  lineHeight: '38px',
  width: 38,
  height: 38,
  padding: 0,
  backgroundColor: Colors.backgroundLight
}

const SearchButton = styled(LinkButton)({
  ...searchButtonStyles
})

const SearchClear = styled('span')({
  ...searchButtonStyles,
  cursor: 'pointer',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: Colors.control,
  ':hover': {
    color: Colors.decline
  }
})

const SearchSpinnerContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 38,
  height: 38
})

export default SearchInput
