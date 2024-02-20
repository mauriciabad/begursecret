'use client'

import { Button } from '@nextui-org/button'
import { Textarea } from '@nextui-org/input'
import { Snippet } from '@nextui-org/snippet'
import { IconExternalLink } from '@tabler/icons-react'
import { FC, useState } from 'react'
import {
  multiLineFromGeoJson,
  multiLineToString,
} from '~/helpers/spatial-data/multi-line'
import { Link } from '~/navigation'
import { SRID_CODE } from '~/server/helpers/spatial-data'

export const WipRoutes: FC = () => {
  const [input, setInput] = useState('')

  const output = stringToGeoJson(input)

  return (
    <>
      <h2 className="mt-8 text-xl font-bold">GeoJSON input</h2>
      <Button
        as={Link}
        href="https://geojson.io/#map=13.26/41.95443/3.21328"
        endContent={<IconExternalLink />}
        className="mb-4"
        color="primary"
      >
        Open GeoJSON.io
      </Button>

      <Textarea
        label="GeoJSON Route"
        rows={10}
        className="w-full"
        value={input}
        onValueChange={setInput}
        labelPlacement="outside"
        isInvalid={!!input && !output}
      />

      {output && (
        <>
          <h2 className="mt-8 text-xl font-bold">SQL code</h2>
          <Snippet
            className="mt-4 w-full"
            classNames={{
              pre: 'overflow-x-auto w-[calc(100%-2rem)]',
            }}
            symbol={null}
          >{`ST_MLineFromText('${multiLineToString(
            output
          )}', ${SRID_CODE})`}</Snippet>
        </>
      )}
    </>
  )
}

function stringToGeoJson(string: string) {
  try {
    return multiLineFromGeoJson(JSON.parse(string))
  } catch (e) {
    return null
  }
}
