import { Session } from 'next-auth'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { UserAvatar } from '~/components/user-avatar'

export const UserPreview: FC<{ user: Session['user'] }> = ({ user }) => {
  const t = useTranslations('profile.preview')

  return (
    <>
      <UserAvatar user={user} className="mx-auto mb-2 block h-24 w-24" />
      <h2 className="text-center  text-lg font-bold">
        {user.name ?? t('anonymous')}
      </h2>
    </>
  )
}
