import styled from '@emotion/styled'
import React from 'react'
import Button from './Button'
import CardSearchDetailsModal from './CardSearchDetailsModal'
import { useCardDrawer } from './Providers/CardDrawerProvider'
import { useCardModalControls } from './CardModal'
import { useCardStorage } from './Providers/CardStorageProvider'
import Colors from './Colors'
import Drawer from './Drawer'
import GradeSelect, { gradeOptions } from './GradeSelect'
import Icons from './Icon'
import LinkButton from './LinkButton'
import PriceInput from './PriceInput'

function CardDrawer ({ open, onClose }) {
  const cardStorage = useCardStorage()
  const cardDrawer = useCardDrawer()

  const { visible, selectedCard, openCardDetails, closeCardDetails } = useCardModalControls()

  function save () {
    // cardStorage.merge(cardDrawer.cards)
    cardStorage.save(cardDrawer.cards, { onSuccess: onSaveSuccess, onError: onSaveError })
  }

  function onSaveSuccess () {
    cardDrawer.clear()
  }

  function onSaveError (error) {
    console.log(error)
  }

  function asd () {
    cardStorage.setSavePath('E:/Dev/mtg-log/asd')
  }

  return (
    <>
      <Drawer open={open}>
        <CardDrawerHeader>
          <Menu>
            {!cardDrawer.empty() && (
              <LinkButton.Decline onClick={cardDrawer.clear}>
                Clear<Icons.Cross />
              </LinkButton.Decline>
            )}
          </Menu>
          <Menu>
            <LinkButton onClick={onClose}>Close<Icons.ArrowRight /></LinkButton>
          </Menu>
        </CardDrawerHeader>
        <CardDrawerContainer>
          <CardTable>
            <thead><tr><th /><th /><th /><th /></tr></thead>
            <tbody>
              {cardDrawer.toArray().map(({ card, meta }) => (
                <tr key={card.id}>
                  <td>
                    <CardDrawerRemove onClick={() => cardDrawer.remove(card)}>
                      <Icons.Cross />
                    </CardDrawerRemove>
                  </td>
                  <td>
                    <GradeSelect.Inline.Sm
                      value={gradeOptions[meta.grade]}
                      onChange={(grade) => cardDrawer.updateGrade(card.id, grade)}
                    />
                  </td>
                  <td>
                    <PriceInput
                      editInline
                      value={meta.price}
                      onChange={(price) => cardDrawer.updatePrice(card.id, price)}
                    />
                  </td>
                  <td>
                    <CardDrawerCardName onClick={() => openCardDetails(card)}>{card.name}</CardDrawerCardName>
                  </td>
                </tr>
              ))}
            </tbody>
          </CardTable>
        </CardDrawerContainer>
        <CardDrawerFooter>
          <SaveButton disabled={cardDrawer.empty()} onClick={save}>
            Save!
          </SaveButton>
          <SaveButton onClick={asd}>
            Asd
          </SaveButton>
        </CardDrawerFooter>
      </Drawer>
      <CardSearchDetailsModal
        visible={visible}
        initialCard={selectedCard}
        onClose={closeCardDetails}
      />
    </>
  )
}

const CardDrawerHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between'
})

const Menu = styled('div')({
  display: 'flex',
  gap: 12
})

const CardDrawerContainer = styled('div')({
  fontSize: 14,
  lineHeight: '20px',
  overflowX: 'hidden',
  overflowY: 'auto',
  height: 'calc(100% - 112px)',
  margin: '0 12px',
  padding: 8,
  borderRadius: 3,
  backgroundColor: Colors.backgroundDark,
  '::-webkit-scrollbar-track': {
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3
  }
})

const CardTable = styled('table')({
  borderCollapse: 'collapse',
  width: '100%',
  th: {
    ':nth-of-type(1)': { // Remove
      width: '1%',
      whiteSpace: 'nowrap'
    },
    ':nth-of-type(2)': { // Grade
      width: '1%',
      whiteSpace: 'nowrap'
    },
    ':nth-of-type(3)': { // Price
      textAlign: 'right',
      width: '1%',
      whiteSpace: 'nowrap'
    }
  },
  td: {
    padding: '2px 4px',
    ':nth-of-type(4)': { // Name
      maxWidth: 0
    }
  }
})

const CardDrawerFooter = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: 64
})

const CardDrawerCardName = styled('div')({
  cursor: 'pointer',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  color: Colors.foregroundLight,
  ':hover': {
    color: Colors.accept
  }
})

const CardDrawerRemove = styled('div')({
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: '0 0 20px',
  color: Colors.decline,
  ':hover': {
    color: Colors.declineLight
  }
})

const SaveButton = styled(Button)({
  width: 160
})

export default CardDrawer
