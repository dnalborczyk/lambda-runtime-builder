import React, { ReactElement, useState } from 'react'
import CpuArchitectureComponent from './CpuArchitectureComponent.js'
import ExitComponent from './ExitComponent.js'
import NodeVersionsComponent from './NodeVersionsComponent.js'

export interface ItemHandler {
  cpuArchitecture?: string | null
  nodeVersion?: string | null
  page: number
}

interface State {
  currentPage: number
  cpuArchitecture?: string | null
  nodeVersion?: string | null
}

const initialState: State = {
  currentPage: 0,
  cpuArchitecture: null,
  nodeVersion: null,
}

export default function PageComponent(): ReactElement {
  const [state, setState] = useState(initialState)

  const handleSelect = (item: ItemHandler) => {
    // console.log(item)

    setState({
      ...item,
      currentPage: item.page + 1,
    })
  }

  switch (state.currentPage) {
    case 0:
      return <CpuArchitectureComponent onSelect={handleSelect} page={0} />
    case 1:
      return <NodeVersionsComponent onSelect={handleSelect} page={1} />
    default:
      return <ExitComponent />
    // throw new Error('Unknown page to render')
  }
}
