import { useEffect, useState } from 'react'

export const useDevicePermissions = (permissionDesc: PermissionDescriptor) => {
  const [permission, setPermission] = useState<PermissionStatus | null>(null)

  useEffect(() => {
    navigator.permissions.query(permissionDesc).then(setPermission)
  }, [permissionDesc])

  useEffect(() => {
    if (!permission) return

    const changeHandler: Parameters<
      typeof permission.addEventListener<'change'>
    >[1] = (e) => setPermission(e.target as PermissionStatus)

    permission.addEventListener('change', changeHandler)

    return () => {
      permission.removeEventListener('change', changeHandler)
    }
  }, [permission])

  return {
    state: permission?.state,
  }
}
