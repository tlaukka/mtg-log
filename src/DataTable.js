import styled from '@emotion/styled'
import React from 'react'
import Colors from './Colors'

function DataTable ({ data = [], renderHeader, renderRow, ...rest }) {
  return (
    <Table {...rest}>
      <thead>
        <tr>
          {renderHeader()}
        </tr>
      </thead>
      <tbody>
        <tr />
        {data.map((entry) => (
          <tr key={entry.id}>
            {renderRow(entry)}
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

const Table = styled('table')({
  borderCollapse: 'collapse',
  width: '100%',
  marginBottom: 24,
  backgroundColor: Colors.backgroundLight,
  thead: {
    fontSize: 16,
    color: Colors.control,
    tr: {
      position: 'sticky',
      zIndex: 2,
      top: 0,
      overflow: 'hidden',
      boxShadow: '0px -2px 14px rgba(0, 0, 0, 0.6)'
    }
  },
  th: {
    padding: '8px 12px',
    backgroundColor: Colors.backgroundLight
  },
  tbody: {
    fontSize: 16,
    'tr:nth-of-type(odd)': {
      backgroundColor: Colors.backgroundAccent
    },
    'tr:first-of-type': {
      height: 12
    }
  },
  td: {
    padding: '8px 12px'
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

DataTable.Header = styled('th')()
DataTable.Data = styled('td')()

export default DataTable
