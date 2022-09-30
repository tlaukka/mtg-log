import styled from '@emotion/styled'
import { ipcRenderer } from 'electron'
import React from 'react'
import Button from './Button'
import { storageFile, useCardStorage } from './CardStorageProvider'
import Colors from './Colors'
import Modal from './Modal'
import { useStorage } from './storage'

function SettingsModal ({ visible, onClose }) {
  const storage = useStorage()
  const { load } = useCardStorage()

  async function setSavePath () {
    try {
      const result = await ipcRenderer.invoke('show-open-dialog', { properties: ['openDirectory'] })

      if (!result.canceled) {
        const path = `${result.filePaths[0]}/mtg-log-storage`

        await storageFile.changeLocation(storage.getValue('cardStorageSavePath'), path)
        storage.setValue('cardStorageSavePath', path)

        await load()
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal visible={visible} onClose={onClose}>
      <Wrapper>
        <Label>Save path:</Label>
        <CurrentPath>{storage.getValue('cardStorageSavePath')}</CurrentPath>
        <SetPathButton onClick={setSavePath}>Set save path</SetPathButton>
      </Wrapper>
    </Modal>
  )
}

const Wrapper = styled('div')({
  width: '100%',
  height: '80vh'
})

const Label = styled('h3')({
  fontSize: 18,
  marginBottom: 8,
  color: Colors.foregroundDark
})

const CurrentPath = styled('div')({
  fontSize: 20,
  fontWeight: 'bold',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  height: 33,
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
