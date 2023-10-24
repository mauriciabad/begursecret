import { FC } from 'react'
import { Avatar, AvatarProps } from '@nextui-org/avatar'

function getProfileImage(user: User) {
  if (user.image) return user.image

  const seed: string = user.name ?? user.email ?? user.id
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`
}

type User = {
  id: string
  email?: string | null | undefined
  image?: string | null | undefined
  name?: string | null | undefined
}

export const UserAvatar: FC<
  Omit<AvatarProps, 'src'> & {
    user: User
  }
> = ({ user, ...props }) => {
  return <Avatar src={getProfileImage(user)} {...props} />
}
