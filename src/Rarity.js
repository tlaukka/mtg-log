import styled from '@emotion/styled'
import React from 'react'
import Colors from './Colors'
import Tag from './Tag'

// const rarityLabel = {
//   common: 'common',
//   uncommon: 'uncommon',
//   rare: 'rare',
//   mythic: 'mythic',
//   bonus: 'bonus'
// }

const rarityLabel = {
  common: 'co',
  uncommon: 'un',
  rare: 'ra',
  mythic: 'my',
  bonus: 'bo'
}

export const rarityBackground = {
  common: 'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(15,15,15,1) 50%)',
  uncommon: 'linear-gradient(90deg, rgba(94,104,107,1) 0%, rgba(245,253,255,1) 50%)',
  rare: 'linear-gradient(90deg, rgba(102,84,56,1) 0%, rgba(255,244,146,1) 50%)',
  mythic: 'linear-gradient(90deg, rgba(210,87,29,1) 0%, rgba(255,192,53,1) 50%)',
  bonus: 'linear-gradient(90deg, rgba(69,88,112,1) 0%, rgba(156,181,214,1) 50%)'
}

// export const rarityBackground = {
//   // common: 'rgba(90,90,90,1)',
//   common: 'rgba(10,10,10,1)',
//   uncommon: 'rgba(245,253,255,1)',
//   rare: 'rgba(255,244,146,1)',
//   mythic: 'rgba(255,192,53,1)',
//   bonus: 'rgba(156,181,214,1)'
// }
// export const rarityBackground = {
//   common: '#101010',
//   uncommon: '#E0E0E0',
//   rare: '#F4E087',
//   mythic: '#FF9730',
//   bonus: '9CB5D6'
// }

// export const rarityBackground = {
//   common: 'black',
//   uncommon: 'rgba(245,253,255,1)',
//   rare: 'rgba(255,244,146,1)',
//   mythic: 'rgba(255,192,53,1)',
//   bonus: 'rgba(156,181,214,1)'
// }

export const rarityBorderColor = {
  // common: 'rgba(10,10,10,1)',
  common: '#5A5A5A',
  uncommon: 'rgba(245,253,255,1)',
  rare: 'rgba(255,244,146,1)',
  mythic: 'rgba(255,192,53,1)',
  bonus: 'rgba(156,181,214,1)'
}

function Rarity ({ rarity }) {
  return (
    <RarityTag rarity={rarity} background={rarityBackground[rarity]}>
    {/* <RarityTag rarity={rarity} background={'transparent'}> */}
      {rarityLabel[rarity] || '-'}
    </RarityTag>
  )
}

const RarityTag = styled(Tag)(({ rarity }) => ({
  border: `1px solid ${rarityBorderColor[rarity]}`,
  // border: (rarity === 'common') ? '1px solid #5A5A5A' : 'none',
  color: (rarity === 'common') ? '#5A5A5A' : '#101010'
  // color: `${rarityBorderColor[rarity]}`
}))

export default Rarity
