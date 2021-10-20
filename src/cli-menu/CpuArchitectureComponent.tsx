import React, { ReactElement } from 'react'
import { Text } from 'ink'
import SelectInput from 'ink-select-input'
import type { Item } from 'ink-select-input/build/SelectInput'
import Indicator from './IndicatorComponent.js'
import ItemComponent from './ItemComponent.js'
import type { ItemHandler } from './PageComponent.js'

const archs = [
  {
    label: 'arm64',
    value: 'arm64',
  },
  {
    label: 'x86_64',
    value: 'x86_64',
  },
]

interface Props {
  onSelect: (item: ItemHandler) => void
  readonly page: number
}

export default function CpuArchitectureComponent(props: Props): ReactElement {
  const { page, onSelect } = props

  function handleSelect(event: Item<string>) {
    onSelect({
      cpuArchitecture: event.value,
      page,
    })
  }

  return (
    <>
      <Text color="yellow">Which CPU Architecture would you like to use?</Text>
      {/* @ts-ignore */}
      <SelectInput.default
        indicatorComponent={Indicator}
        itemComponent={ItemComponent}
        items={archs}
        onSelect={handleSelect}
      />
    </>
  )
}
