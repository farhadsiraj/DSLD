import { db, auth } from '../../../firebase';

async function updateLifetimeStats(updateStats) {
  const loggedIn = auth.currentUser.uid;
  db.collection('users').doc(loggedIn).set(updateStats, { merge: true });
}

export default updateLifetimeStats;
