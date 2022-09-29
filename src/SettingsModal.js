import styled from '@emotion/styled'
import React from 'react'
import Button from './Button'
import Colors from './Colors'
import Modal from './Modal'

function SettingsModal ({ visible, onClose }) {
  return (
    <Modal visible={visible} onClose={onClose}>
      <Wrapper>
        <CurrentPath>asd/qwe/asdasddasasasd/sadasd/asdas/asdasdasdasda/asdsadasdd/asdasd/asd/asdasdsad/asdasdasd/asdasd</CurrentPath>
        <SetPathButton>Set save path</SetPathButton>
      </Wrapper>
    </Modal>
  )
}

const Wrapper = styled('div')({
  width: '100%'
})

const CurrentPath = styled('h3')({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  marginTop: 32,
  marginBottom: 48,
  paddingBottom: 8,
  borderBottom: `2px solid ${Colors.borderLight}`,
  color: Colors.foregroundDark
})

const SetPathButton = styled(Button)({
  display: 'block',
  fontSize: 24,
  height: 64,
  margin: '0 auto',
  padding: '0 48px',
  border: `2px solid ${Colors.control}`,
  backgroundColor: 'transparent'
})

export default SettingsModal
