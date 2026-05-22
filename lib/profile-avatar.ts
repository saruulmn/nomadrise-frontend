export const PROFILE_AVATAR_UPDATED_EVENT = 'nomadrise:profile-avatar-updated';

export type ProfileAvatarUpdatedEvent = CustomEvent<{
  avatarUrl: string | null;
}>;
