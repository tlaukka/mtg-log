import React from 'react'

class QueryStack {
  constructor () {
    this.queries = []
  }

  push (query) {
    this.queries.push(query)
  }

  pop () {
    this.queries.pop()
  }

  get current () {
    return this.queries[this.queries.length - 1]
  }

  get size () {
    return this.queries.length
  }

  reset () {
    this.queries = []
  }
}

export function useQueryStack () {
  const queryStack = React.useRef(new QueryStack())
  return queryStack.current
}

export default useQueryStack
