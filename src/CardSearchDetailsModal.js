import styled from '@emotion/styled'
import React from 'react'
import { useCardDrawer } from './CardDrawerProvider'
import Colors from './Colors'
import { Grade } from './GradeTag'
import useCardNameSearch from './Hooks/useCardNameSearch'
import Button from './Button'
import CardModal, { CardMetaDataTable } from './CardModal'

function CardSearchDetailsModal ({ initialCard, onClose, ...rest }) {
  const [searchedCard, setSearchedCard] = React.useState()
  const [selectedGrade, setSelectedGrade] = React.useState(Grade.nm)
  const [selectedPrice, setSelectedPrice] = React.useState()

  const cardDrawer = useCardDrawer()

  const { searchCard, fetching } = useCardNameSearch()

  const card = searchedCard || initialCard
  const isInCollection = cardDrawer.has(card || {})
  const meta = isInCollection ? cardDrawer.get(card.id).meta : { grade: selectedGrade, price: selectedPrice }

  function onSearch (search, handleSuccess, handleError) {
    const setRegExp = new RegExp(/set:\w+/i)
    const setInSearch = search.match(setRegExp)?.[0] || ''

    const set = setInSearch.replace('set:', '')
    const fuzzy = search.replace(setRegExp, '').trim()

    const params = {
      fuzzy,
      set
    }

    function onSuccess (card) {
      onSearchSuccess(card)
      handleSuccess(card)
    }

    searchCard(params, { onSuccess, onError: handleError })
  }

  function onSearchSuccess (card) {
    setSearchedCard(card)
    setSelectedGrade(Grade.nm)
    setSelectedPrice('')
  }

  function onChangeGrade (grade) {
    if (isInCollection) {
      cardDrawer.updateGrade(card.id, grade)
    } else {
      setSelectedGrade(grade)
    }
  }

  function onChangePrice (price) {
    if (isInCollection) {
      cardDrawer.updatePrice(card.id, price)
    } else {
      setSelectedPrice(price)
    }
  }

  function handleClose () {
    setSelectedPrice('')
    setSelectedGrade(Grade.nm)
    setSearchedCard(null)

    onClose && onClose()
  }

  function renderDetails () {
    return (
      <CardMetaDataTable
        card={card}
        meta={meta}
        onChangeGrade={onChangeGrade}
        onChangePrice={onChangePrice}
      />
    )
  }

  function renderMenu () {
    if (isInCollection) {
      return (
        <RemoveButton size={'small'} onClick={() => cardDrawer.remove(card)}>
          Remove
        </RemoveButton>
      )
    }

    return (
      <AddButton
        size={'small'}
        disabled={!card}
        onClick={() => cardDrawer.add(card, meta)}
      >
        Add
      </AddButton>
    )
  }

  return (
    <CardModal
      card={card}
      fetching={fetching}
      onSearch={onSearch}
      onClose={handleClose}
      renderDetails={renderDetails}
      renderMenu={renderMenu}
      {...rest}
    >
    </CardModal>
  )
}

const AddButton = styled(Button.Accept)({
  padding: 0,
  borderRadius: 0,
  borderBottom: `1px solid ${Colors.accept}`,
  backgroundColor: 'transparent',
  ':hover': {
    borderColor: Colors.acceptLight
  }
})

const RemoveButton = styled(Button.Danger)({
  padding: 0,
  borderRadius: 0,
  borderBottom: `1px solid ${Colors.decline}`,
  backgroundColor: 'transparent',
  ':hover': {
    borderColor: Colors.declineLight
  }
})

export default CardSearchDetailsModal
