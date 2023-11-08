import { useEffect, useState } from 'react'

export const useDevicePermissions = (permissionName: PermissionName) => {
  const [permission, setPermission] = useState<PermissionStatus | null>(null)

  useEffect(() => {
    navigator.permissions.query({ name: permissionName }).then(setPermission)
  }, [permissionName])

  useEffect(() => {
    if (!permission) return

    const changeHandler: Parameters<
      typeof permission.addEventListener<'change'>
    >[1] = (e) => {
      return setPermission(e.target as PermissionStatus)
    }

    permission.addEventListener('change', changeHandler)

    return () => {
      permission.removeEventListener('change', changeHandler)
    }
  }, [permission])

  return permission
}
