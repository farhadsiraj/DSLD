import firebase from 'firebase';

const app = firebase.initializeApp({
  apiKey: 'AIzaSyBAtPYNPhfkmKXoPzywBwNagod36U8SeoM',
  authDomain: 'dsld-6914b.firebaseapp.com',
  projectId: 'dsld-6914b',
  storageBucket: 'dsld-6914b.appspot.com',
  messagingSenderId: '949003913383',
  appId: '1:949003913383:web:c6255d9459c19f64e8b382',
  measurementId: 'G-V30TFTK6F2',
});

export const auth = app.auth();
export default app;
