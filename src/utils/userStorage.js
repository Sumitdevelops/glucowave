import { auth } from '../lib/firebase';

export function getUserScopedKey(baseKey) {
  const uid = auth.currentUser?.uid || 'guest';
  return `${baseKey}_${uid}`;
}
