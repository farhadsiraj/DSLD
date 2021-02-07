import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../../../firebase';

// context provider-wrap all of your code that needs access to the information in the context, has a single props of value which is going to be whatever the value of your context is
// everything inside of our provider, all of the children and their children and their children's children will have access to the variable in the value prop
// passing down props to all children without having to manually pass the props for each one

// context consumer-
const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  // currentUser starts off as null and then sets itself. Firebase sets local storage for us and set tokens so that way it can verify that if you have a user already signed in it'll connect that user for you and use onAuthStateChange
  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  // only run this when we mount our component so we put the empty brackets as the second argument
  useEffect(() => {
    // firebase uses the following method to notify you when a user gets set
    // we set user here
    // take in a user and allow us to set the user to current user or null
    // use unsusbscribe to unsubscribe us from this listener (onAuthStateChanged) when we're done by using it
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      // setLoading is set to false once we have a user
      // use this will currentUser is changing from null to the current user
      // as soon as we get this first useEffect that runs that means it did the verification to see if there is a user then we set loading to false
      await setCurrentUser(user);
      await setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  // check to see if we are loading, otherwise we don't want to run this
  // if not loading, then we render the children
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
