import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { TravelAppData } from '../types';

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId || '(default)');
export const auth = getAuth(app);

// Sign in anonymously to guarantee Firestore access
export async function ensureAuth() {
  if (!auth.currentUser) {
    try {
      await signInAnonymously(auth);
    } catch (e) {
      console.warn('Firebase anonymous auth warning:', e);
    }
  }
  return auth.currentUser;
}

/**
 * Subscribe to real-time changes for a specific trip room
 */
export function subscribeToTrip(
  tripId: string,
  onData: (data: TravelAppData | null, exists: boolean) => void,
  onError?: (err: Error) => void
) {
  const tripRef = doc(db, 'trips', tripId);

  return onSnapshot(
    tripRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const remoteData = snapshot.data() as TravelAppData;
        onData(remoteData, true);
      } else {
        // Document doesn't exist yet in remote
        onData(null, false);
      }
    },
    (err) => {
      console.error('Firestore snapshot error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Save/Sync the entire trip data to Firestore
 */
export async function saveTripToCloud(tripId: string, data: TravelAppData) {
  await ensureAuth();
  const tripRef = doc(db, 'trips', tripId);
  const payload = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await setDoc(tripRef, payload, { merge: true });
}

/**
 * Fetch trip data once from Firestore
 */
export async function fetchTripFromCloud(tripId: string): Promise<TravelAppData | null> {
  await ensureAuth();
  const tripRef = doc(db, 'trips', tripId);
  const snap = await getDoc(tripRef);
  if (snap.exists()) {
    return snap.data() as TravelAppData;
  }
  return null;
}
