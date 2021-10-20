import React, { ReactElement, useEffect, useState } from 'react'
import { Text } from 'ink'
import SelectInput from 'ink-select-input'
import type { Item } from 'ink-select-input/build/SelectInput'
import getLatestVersions, { LatestVersions } from '../getLatestVersions.js'
import IndicatorComponent from './IndicatorComponent.js'
import ItemComponent from './ItemComponent.js'
import type { ItemHandler } from './PageComponent.js'

interface Props {
  onSelect: (item: ItemHandler) => void
  readonly page: number
}

export default function NodeVersionsComponent(props: Props): ReactElement {
  const { page, onSelect } = props

  function handleSelect(event: Item<string>) {
    onSelect({
      nodeVersion: event.value,
      page,
    })
  }

  const [items, setList] = useState<LatestVersions[]>([])

  useEffect(() => {
    async function loadData() {
      const result = await getLatestVersions()

      setList(result)
    }

    loadData()
  }, [setList])

  return (
    <>
      <Text color="yellow">Which node.js version would you like to use?</Text>
      {/* @ts-ignore */}
      <SelectInput.default
        indicatorComponent={IndicatorComponent}
        itemComponent={ItemComponent}
        items={items}
        limit={10}
        onSelect={handleSelect}
      />
    </>
  )
}
