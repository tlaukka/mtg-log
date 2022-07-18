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

DataTable.Header = styled('th')()
DataTable.Data = styled('td')()

export default DataTable
