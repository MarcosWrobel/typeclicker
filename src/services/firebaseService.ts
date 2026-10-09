import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

import { ADMIN_EMAILS, isStaffMember, extractLevel100Pioneers, isSuperAdminEmail } from '../utils/leaderboardUtils';
export { ADMIN_EMAILS, isStaffMember, extractLevel100Pioneers };

export function checkIsSuperAdmin(user: User | null): boolean {
  return isSuperAdminEmail(user?.email, user?.emailVerified);
}

import { getSystemSettings } from './systemSettingsService';

export async function checkIsAdminAsync(user: User | null): Promise<boolean> {
  if (!user?.email) return false;
  if (checkIsSuperAdmin(user)) return true;
  try {
    const settings = await getSystemSettings();
    return !!settings?.allowedTeachers?.includes(user.email);
  } catch {
    return false;
  }
}

// Re-exporta todos os serviços e tipos pedagógicos migrados para o Supabase
export * from './systemSettingsService';

export type {
  LeaderboardEntry,
  Level100PioneerSlot,
  CloudResponse,
  CloudLoadResponse
} from '../types/leaderboard';

// Auth Functions
export async function loginWithGoogle(): Promise<User | null> {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
  }
}

export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Remove recursivamente propriedades com valor undefined de objetos
 */
export function removeUndefinedFields<T extends Record<string, any>>(obj: T): T {
  const clean = {} as Record<string, any>;
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined) {
      if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
        clean[key] = removeUndefinedFields(val);
      } else {
        clean[key] = val;
      }
    }
  }
  return clean as T;
}

