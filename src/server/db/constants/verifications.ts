import { InferSelectModel } from 'drizzle-orm'
import { verificationRequirements } from '../schema'

export type VerificationRequirements = InferSelectModel<
  typeof verificationRequirements
>

export function isVerificationRequired<T extends VerificationRequirements>(
  verificationRequirements: T | null
): verificationRequirements is T {
  if (!verificationRequirements) return false

  return verificationRequirements.isLocationRequired
}
