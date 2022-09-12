import styled from '@emotion/styled'
import React from 'react'
import Colors from './Colors'
import Icons from './Icon'

function defaultKeyExtractor (entry) {
  return entry.id
}

function DataTable ({ data = [], keyExtractor = defaultKeyExtractor, renderHeader, renderRow, ...rest }) {
  return (
    <Table {...rest}>
      <thead>
        <tr>
          {renderHeader()}
        </tr>
      </thead>
      <tbody>
        <tr />
        {data.map((entry, index) => (
          <tr key={keyExtractor(entry)}>
            {renderRow(entry, index)}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export function ExpandableRow ({ content, children }) {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <>
      <tr onClick={() => setExpanded((value) => !value)}>
        {children}
      </tr>
      <tr>
        <ExpandedRowContainer colSpan={5}>
          <ExpandedRowWrapper visible={expanded}>
            {content}
          </ExpandedRowWrapper>
        </ExpandedRowContainer>
      </tr>
    </>
  )
}

function SortingHeader ({ active, sort, children, ...rest }) {
  const [order, setOrder] = React.useState()

  function handleSort () {
    let value = undefined

    if (!order) {
      value = 'asc'
      setOrder(value)
    } else {
      value = (order === 'asc') ? 'desc' : 'asc'
      setOrder(value)
    }

    sort(value)
  }

  return (
    <DataTable.Header {...rest}>
      <TableSortingHeader direction={order} onClick={handleSort}>
        <Sorting active={active} order={order} />
        {children}
      </TableSortingHeader>
    </DataTable.Header>
  )
}

function Sorting ({ active, order }) {
  if (!active) {
    return null
  }

  return (
    <>
      {(order === 'asc') && <Icons.CaretUp style={caretUpStyles} />}
      {(order === 'desc') && <Icons.CaretDown style={caretDownStyles} />}
    </>
  )
}

const caretStyles = {
  lineHeight: '8px',
  position: 'absolute',
  left: 'calc(50% - 4px)',
  width: 8,
  height: 8,
  color: Colors.foregroundDark
}

const caretUpStyles = {
  ...caretStyles,
  top: -8
}

const caretDownStyles = {
  ...caretStyles,
  bottom: -8
}

const Table = styled('table')({
  borderCollapse: 'collapse',
  width: '100%',
  marginBottom: 24,
  backgroundColor: Colors.backgroundLight,
  '> thead': {
    fontSize: 16,
    color: Colors.control,
    '> tr': {
      position: 'sticky',
      zIndex: 2,
      top: 0,
      overflow: 'hidden',
      boxShadow: '0px -2px 14px rgba(0, 0, 0, 0.6)',
      '> th': {
        padding: '8px 12px',
        backgroundColor: Colors.backgroundLight
      }
    }
  },
  '> tbody': {
    fontSize: 16,
    '> tr:nth-of-type(odd)': {
      backgroundColor: Colors.backgroundAccent
    },
    '> tr:first-of-type': {
      height: 12,
    }
  }
})

const ExpandedRowContainer = styled('td')({
  padding: '0px !important'
})

const ExpandedRowWrapper = styled('div')({
  overflow: 'hidden',
  transition: 'max-height 0.2s ease'
}, ({ visible }) => ({
  maxHeight: visible ? 43 : 0
}))

const TableSortingHeader = styled('div')({
  display: 'inline-block',
  cursor: 'pointer',
  position: 'relative',
  textDecoration: 'underline',
  ':hover': {
    color: Colors.accept
  }
})

DataTable.Header = styled('th')(({ textAlign = 'center', width = 'auto', fitToContent }) => ({
  textAlign,
  width: fitToContent ? '1%' : width,
  whiteSpace: fitToContent ? 'nowrap' : 'normal'
}))

DataTable.SortingHeader = SortingHeader

DataTable.Data = styled('td')(({
  verticalAlign = 'middle',
  textAlign = 'left',
  noPadding,
  noWrap,
  truncate,
  color = Colors.foregroundLight
}) => {
  const style = {
    verticalAlign,
    textAlign,
    whiteSpace: noWrap ? 'nowrap' : 'normal',
    padding: noPadding ? 0 : '8px 12px',
    color
  }

  if (truncate) {
    style.maxWidth = 1
    style.overflow = 'hidden'
    style.textOverflow = 'ellipsis'
    style.whiteSpace = 'nowrap'
    style.div = {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: '100%'
    }
  }

  return style
})

export default DataTable
