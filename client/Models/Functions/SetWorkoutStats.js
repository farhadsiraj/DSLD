import { db, auth } from '../../../firebase';

async function setWorkoutStats(workout) {
  const loggedIn = auth.currentUser.uid;
  db.collection('users').doc(loggedIn).collection('workoutHistory').doc().set(
    {
      date: new Date(),
      workout: workout,
    },
    { merge: true }
  );
}

export default setWorkoutStats;
