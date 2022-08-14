import styled from '@emotion/styled'
import React from 'react'
import Button from './Button'
import CardModal, { CardMetaDataTable } from './CardModal'
import { useCardStorage } from './CardStorageProvider'
import Colors from './Colors'

function CardCollectionDetailsModal ({ initialCard, onClose, ...rest }) {
  const [searchedCard, setSearchedCard] = React.useState()
  const [selectedGrade, setSelectedGrade] = React.useState()
  const [selectedPrice, setSelectedPrice] = React.useState()

  const cardStorage = useCardStorage()

  const card = searchedCard || initialCard
  const cardMeta = cardStorage.get(card?.id)?.meta || {}
  const meta = { grade: selectedGrade, price: selectedPrice }

  React.useEffect(
    () => {
      setSelectedGrade(cardMeta.grade)
      setSelectedPrice(cardMeta.price)
    },
    [cardMeta.grade, cardMeta.price]
  )

  function onSearch (search, handleSuccess, handleError) {
    const collection = cardStorage.toArray()
    let result = null

    const regexp = new RegExp(`${search}`, 'i')

    for (let i = 0; i < collection.length; i++) {
      if (collection[i].card.name.match(regexp)) {
        result = collection[i]
        break
      }
    }

    if (result) {
      setSearchedCard(result.card)
      handleSuccess()
    } else {
      handleError({ details: 'A card with the given name doesn\'t exist!' })
    }
  }

  function onChangeGrade (grade) {
    setSelectedGrade(grade)
  }

  function onChangePrice (price) {
    setSelectedPrice(price)
  }

  function handleClose () {
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
    return (
      <UpdateButton>
        Update
      </UpdateButton>
    )
  }

  return (
    <CardModal
      card={card}
      searchEnabled={false}
      onSearch={onSearch}
      onClose={handleClose}
      renderDetails={renderDetails}
      renderMenu={renderMenu}
      {...rest}
    >
    </CardModal>
  )
}

const UpdateButton = styled(Button.Accept)({
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

export default CardCollectionDetailsModal
