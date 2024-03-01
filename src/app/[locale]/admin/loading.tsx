import { IconLoader } from '@tabler/icons-react'
import { FC } from 'react'

const Loading: FC = () => {
  return (
    <div className="flex h-full grow items-center justify-center py-32">
      <IconLoader
        size={48}
        className="animate animate-spin text-brand-600 [animation-duration:2s]"
        stroke={1}
      />
    </div>
  )
}

export default Loading
