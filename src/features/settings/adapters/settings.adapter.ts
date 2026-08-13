// src/features/settings/adapters/settings.adapter.ts

export interface UserProfile {
  displayName: string;
  email: string;
  emailVerified: boolean;
  avatarUrl: string | null;
  businessName: string;
  industry: string;
  location: string;
}

export interface UserPreferences {
  dateFormat: 'DD/MM/YYYY' | 'YYYY-MM-DD';
  currencyDisplay: 'symbol' | 'text';
}

export interface AdapterResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

const mockProfile: UserProfile = {
  displayName: 'Somchai Wattana',
  email: 'somchai@example.com',
  emailVerified: true,
  avatarUrl: null,
  businessName: 'Wattana Coffee Co.',
  industry: 'Food & Beverage',
  location: 'Bangkok, Thailand',
};

const mockPreferences: UserPreferences = {
  dateFormat: 'DD/MM/YYYY',
  currencyDisplay: 'symbol',
};

export async function getProfile(): Promise<AdapterResult<UserProfile>> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { success: true, data: { ...mockProfile } };
}

export async function updateProfile(
  updates: Partial<Pick<UserProfile, 'displayName'>>
): Promise<AdapterResult> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (updates.displayName) {
    mockProfile.displayName = updates.displayName;
  }
  return { success: true };
}

export async function getPreferences(): Promise<AdapterResult<UserPreferences>> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { success: true, data: { ...mockPreferences } };
}

export async function updatePreferences(
  updates: Partial<UserPreferences>
): Promise<AdapterResult> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  Object.assign(mockPreferences, updates);
  return { success: true };
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<AdapterResult> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  if (currentPassword !== 'password123') {
    return { success: false, error: 'current_password_incorrect' };
  }
  if (newPassword.length < 8) {
    return { success: false, error: 'password_too_short' };
  }
  return { success: true };
}

export async function deleteAccount(
  businessName: string,
  password: string
): Promise<AdapterResult> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (password !== 'password123') {
    return { success: false, error: 'reauthentication_failed' };
  }
  if (businessName !== mockProfile.businessName) {
    return { success: false, error: 'business_name_mismatch' };
  }
  return { success: true };
}
