import { Card } from '@nextui-org/card'
import { Input } from '@nextui-org/input'
import { FC } from 'react'
import { Map } from '~/components/map/map'
import { cn } from '~/helpers/cn'

export const MapPointSelector: FC<{
  isInvalid?: boolean
  errorMessage?: string
  label?: string
  value?: string | undefined
  onChange: (e: { target: { value: string | undefined } }) => void
  onBlur: () => void
  className?: string
}> = ({
  isInvalid,
  errorMessage,
  label,
  value,
  onChange,
  onBlur,
  className,
}) => {
  const valueAsMapPoint = stringToMapPoint(value)

  return (
    <div className={cn('flex h-96 flex-col', className)}>
      <p className="mb-1">{label}</p>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <Card
        radius="sm"
        className={cn(
          {
            'border-2 border-red-500': isInvalid,
          },
          'relative grow'
        )}
      >
        <Input
          isInvalid={isInvalid}
          onBlur={onBlur}
          onChange={onChange}
          value={value}
          className="absolute inset-x-2 top-2 z-10 w-auto shadow-lg"
          label={label}
          placeholder="Lat, Lng"
        />
        <Map
          className="h-full w-full rounded-md"
          onValueChange={(newValue) => {
            const newValueString = newValue
              ? `${newValue.lat}, ${newValue.lng}`
              : undefined

            onChange({ target: { value: newValueString } })
            onBlur()
          }}
          value={valueAsMapPoint}
          fullControl
          disableMarkers
          zoom={18}
        />
      </Card>
    </div>
  )
}

function stringToMapPoint(value: string | undefined) {
  const [lat, lng] = (value?.split(',') ?? []).map((v) => Number(v))

  return !isNaN(lat) && !isNaN(lng) ? { lat, lng } : undefined
}
