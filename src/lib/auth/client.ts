import { createAuthClient } from 'better-auth/react';

const realAuthClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
});

// --- TEMPORARY: Frontend dev mock. Remove when backend is connected. ---
const DEV_BYPASS =
  process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true' &&
  typeof window !== 'undefined';

function createMockAuthClient() {
  return {
    ...realAuthClient,
    signIn: {
      ...realAuthClient.signIn,
      email: async () => {
        await new Promise((r) => setTimeout(r, 800)); // simulate delay
        window.location.href = '/en/dashboard';
        return {
          data: {
            user: { id: 'dev-user', name: 'Dev User', email: 'dev@wallflower.local' },
          },
          error: null,
        };
      },
      social: async () => {
        window.location.href = '/en/dashboard';
        return { data: null, error: null };
      },
    },
    signUp: {
      ...realAuthClient.signUp,
      email: async () => {
        await new Promise((r) => setTimeout(r, 800));
        window.location.href = '/en/onboarding';
        return {
          data: {
            user: { id: 'dev-user', name: 'Dev User', email: 'dev@wallflower.local' },
          },
          error: null,
        };
      },
    },
    requestPasswordReset: async () => {
      await new Promise((r) => setTimeout(r, 500));
      return { data: null, error: null };
    },
    resetPassword: async () => {
      await new Promise((r) => setTimeout(r, 500));
      return { data: null, error: null };
    },
    changePassword: async () => {
      await new Promise((r) => setTimeout(r, 500));
      return { data: null, error: null };
    },
  };
}

// Export the mock client in dev bypass mode, real client otherwise.
// All existing imports of `authClient` continue working without changes.
const finalClient = DEV_BYPASS ? createMockAuthClient() : realAuthClient;
export { finalClient as authClient };
