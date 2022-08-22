import React from 'react'
import Icons from './Icon'
import MenuBar from './MenuBar'

function Pagination ({ page, totalPages, totalItems, next, previous, onPageChangeSuccess }) {
  function onPageChange (fn) {
    fn({ onSuccess: onPageChangeSuccess })
  }

  if (totalItems === 0) {
    return (
      <MenuBar.Item>No cards!</MenuBar.Item>
    )
  }

  return (
    <>
      {totalItems && <MenuBar.Item>{`Total cards: ${totalItems}`}</MenuBar.Item>}
      {page && <MenuBar.Item>{`${page} / ${totalPages}`}</MenuBar.Item>}
      <MenuBar.Button disabled={!previous} onClick={() => onPageChange(previous)}>
        <Icons.ChevronLeft />Previous
      </MenuBar.Button>
      <MenuBar.Button disabled={!next} onClick={() => onPageChange(next)}>
        Next<Icons.ChevronRight />
      </MenuBar.Button>
    </>
  )
}

export default Pagination
