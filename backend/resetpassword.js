import { sendPasswordResetEmail } from 'firebase/auth';

// Helper function to reset password
export const resetUserPassword = async (authInstance, email) => {
  if (!email) {
    throw new Error('Email is required');
  }

  try {
    await sendPasswordResetEmail(authInstance, email);
    return true; // Return true on success
  } catch (error) {
    throw error; // If error, it will be caught and handled in the component
  }
};