import { Session } from 'next-auth'
import { useTranslations } from 'next-intl'
import { FC } from 'react'

const DEFAULT_IMAGE =
  'data:image/svg+xml;utf8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cpath fill="%23E0E0E0" d="M0 0h40v40H0z"/%3E%3Cpath fill="%23FFF" d="M20 40c11.046 0 20-8.954 20-20S31.046 0 20 0 0 8.954 0 20s8.954 20 20 20z"/%3E%3Cpath fill="%239C92AC" d="M20 35c8.271 0 15-6.729 15-15S28.271 5 20 5 5 11.729 5 20s6.729 15 15 15z"/%3E%3C/g%3E%3C/svg%3E'

export const UserPreview: FC<{ user: Session['user'] }> = ({ user }) => {
  const t = useTranslations('profile.preview')

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={user.image ?? DEFAULT_IMAGE}
        alt=""
        className="mx-auto mb-2 block h-24 w-24 rounded-full border border-stone-300"
      />
      <h2 className="text-center  text-lg font-bold">
        {user.name ?? t('anonymous')}
      </h2>
    </>
  )
}
