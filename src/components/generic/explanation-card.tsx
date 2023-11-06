import { Card } from '@nextui-org/card'
import { Icon } from '@tabler/icons-react'
import { FC, PropsWithChildren } from 'react'

export const ExplanationCard: FC<
  PropsWithChildren<{
    title: string
    subtitle?: string
    icon: Icon
  }>
> = ({ title, subtitle, icon, children }) => {
  const Icon = icon
  return (
    <Card className="mb-4 space-y-2 p-4 text-center">
      <div className="mx-auto inline-block rounded-full bg-primary-50 p-4 text-primary-900">
        <Icon size={24 * 2} stroke={1.5} />
      </div>
      <p className="text-balance font-bold">{title}</p>
      {subtitle && <p className="text-balance">{subtitle}</p>}
      {children}
    </Card>
  )
}
