import styled from '@emotion/styled'
import React from 'react'
import Button from './Button'
import CardModal, { CardMetaDataTable } from './CardModal'
import { useCardStorage } from './Providers/CardStorageProvider'
import Colors from './Colors'
import Icons from './Icon'
import Popup from './Popup'


function CardCollectionDetailsModal ({ initialCard, onClose, ...rest }) {
  const [editMode, setEditMode] = React.useState(false)
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
    setEditMode(false)
    setSearchedCard(null)

    onClose && onClose()
  }

  function update () {
    const data = {
      [card.id]: {
        card,
        meta
      }
    }

    cardStorage.save(data, { onSuccess: onUpdateSuccess, onError: onUpdateError })
  }

  function onUpdateSuccess () {
    handleClose()
  }

  function onUpdateError (error) {
    console.log(error)
  }

  function remove () {
    cardStorage.removeCard(card, { onSuccess: onRemoveSuccess })
  }

  function onRemoveSuccess () {
    handleClose()
  }

  function renderDetails () {
    return (
      <CardMetaDataTable
        isReadOnly={!editMode}
        card={card}
        meta={meta}
        onChangeGrade={onChangeGrade}
        onChangePrice={onChangePrice}
      />
    )
  }

  function renderMenu () {
    if (editMode) {
      return (
        <>
          <MenuButton onClick={() => setEditMode(false)}>
            <Icons.Cross />
          </MenuButton>
          <UpdateButton onClick={update}>
            Update
          </UpdateButton>
          <Popup openOnHover={false} content={renderRemovePopup()}>
            <RemoveButton>
              Remove
            </RemoveButton>
          </Popup>
        </>
      )
    }

    return (
      <MenuButton onClick={() => setEditMode(true)}>
        <Icons.Edit />
      </MenuButton>
    )
  }

  function renderRemovePopup () {
    return (
      <RemovePopup>
        <Button.Accept onClick={remove}>Yes</Button.Accept>
        <Button.Danger>No</Button.Danger>
      </RemovePopup>
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

const menuButtonStyles = {
  padding: 0,
  borderRadius: 0,
  borderBottom: `1px solid ${Colors.control}`,
  backgroundColor: 'transparent'
}

const MenuButton = styled(Button)({
  ...menuButtonStyles,
  ':hover:enabled': {
    color: Colors.foregroundLight,
    borderColor: Colors.foregroundLight
  }
})

const UpdateButton = styled(Button.Accept)({
  ...menuButtonStyles,
  borderColor: Colors.accept,
  ':hover': {
    borderColor: Colors.acceptLight
  }
})

const RemoveButton = styled(Button.Danger)({
  ...menuButtonStyles,
  borderColor: Colors.decline,
  ':hover': {
    borderColor: Colors.declineLight
  }
})

const RemovePopup = styled('div')({
  display: 'flex',
  position: 'absolute',
  top: '-100%',
  left: '-50%',
  padding: '0 4px',
  borderRadius: 3,
  backgroundColor: Colors.backgroundDark,
  button: {
    borderRadius: 0
  },
  ':before': {
    content: '""',
    position: 'absolute',
    top: '100%',
    left: '50%',
    marginLeft: -5,
    border: `5px solid ${Colors.backgroundDark}`,
    borderColor: `${Colors.backgroundDark} transparent transparent transparent`
  }
})

export default CardCollectionDetailsModal
