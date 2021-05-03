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
    let exercise = user.exercise;
    let totalReps = user.reps;
    let successfulReps = user.reps * user.sets;
    let reps = user.reps;
    let totalSets = user.sets;
    let setCount = totalSets;
    let restTimer = user.restTimer;
    return [
      exercise,
      totalReps,
      successfulReps,
      reps,
      totalSets,
      setCount,
      restTimer,
    ];
  }
}

export default setRepPrefs;
