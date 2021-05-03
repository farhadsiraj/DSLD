import { db, auth } from '../../../firebase';

async function setLifetimeStats() {
  const loggedIn = auth.currentUser.uid;
  const usersRef = db.collection('users').doc(loggedIn);

  const doc = await usersRef.get();
  if (!doc.exists) {
    console.log('No user data found.');
  } else {
    const user = doc.data();
    lifetimeReps = user.lifetimeReps;
    lifetimeSets = user.lifetimeSets;
  }
}
export default setLifetimeStats;
