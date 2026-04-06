import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

function requireUid(uid) {
  if (!uid) throw new Error('User is not authenticated');
}

export async function saveUserProfile(uid, profile) {
  requireUid(uid);
  await setDoc(
    doc(db, 'users', uid),
    { profile, profileUpdatedAt: serverTimestamp() },
    { merge: true },
  );
}

export async function addUserLog(uid, payload) {
  requireUid(uid);
  await addDoc(collection(db, 'users', uid, 'logs'), {
    ...payload,
    createdAt: serverTimestamp(),
    createdAtMs: Date.now(),
  });
}

export async function addUserPrediction(uid, payload) {
  requireUid(uid);
  await addDoc(collection(db, 'users', uid, 'predictions'), {
    ...payload,
    createdAt: serverTimestamp(),
    createdAtMs: Date.now(),
  });
}

export function subscribeToUserLogs(uid, onNext, onError) {
  requireUid(uid);
  const q = query(
    collection(db, 'users', uid, 'logs'),
    orderBy('createdAtMs', 'desc'),
    limit(100),
  );
  return onSnapshot(q, onNext, onError);
}

export function subscribeToUserPredictions(uid, onNext, onError) {
  requireUid(uid);
  const q = query(
    collection(db, 'users', uid, 'predictions'),
    orderBy('createdAtMs', 'desc'),
    limit(200),
  );
  return onSnapshot(q, onNext, onError);
}
