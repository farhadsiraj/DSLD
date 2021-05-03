import { db, auth } from '../../../firebase';

async function setRepPrefs() {
  const loggedIn = auth.currentUser.uid;
  const usersRef = db
    .collection('users')
    .doc(loggedIn)
    .collection('setupWorkout')
    .doc('setup');
  const doc = await usersRef.get();
  if (!doc.exists) {
    console.log('No default workout preferences set.');
  } else {
    const user = doc.data();
    exercise = user.exercise;
    totalReps = user.reps;
    successfulReps = user.reps * user.sets;
    reps = user.reps;
    totalSets = user.sets;
    setCount = totalSets;
    restTimer = user.restTimer;
  }
}

export default setRepPrefs;
