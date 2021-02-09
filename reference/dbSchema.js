const users = {
  id: string,
  username: string,
  email: email,
  height: number,
  weight: float,
  age: number,
  workoutHistory: {
    workoutId: {
      date: string,
      time: time,
      squat: {
        rep: 10,
        set: 3,
        accuracy: 85,
      },
      pushup: {
        rep: 10,
        set: 3,
      },
      comments: string,
    },
  },
  lifetimeReps: {
    pushups: 9999,
    squats: 999999999,
    total: 1000000000000,
  },
  status: {
    paid: true,
  },
  skin: {
    active: false,
  },
  purchasedSkins: ['greenman', 'goldman', 'santa'],
  friends: {
    friendA: {
      name: string,
      score: number,
    },
  },
  longestStreak: 9,
  activeStreak: 3,
};
