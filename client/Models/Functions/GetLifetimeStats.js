import { db, auth } from '../../../firebase';

async function getLifetimeStats() {
  const loggedIn = auth.currentUser.uid;
  const usersRef = db.collection('users').doc(loggedIn);

  const doc = await usersRef.get();
  if (!doc.exists) {
    console.log('No user data found.');
  } else {
    const user = doc.data();
    let lifetimeReps = user.lifetimeReps;
    let lifetimeSets = user.lifetimeSets;
    return [lifetimeReps, lifetimeSets];
  }
}
export default getLifetimeStats;
