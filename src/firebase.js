import firebase from 'firebase'

const firebaseConfig = {
//ADD CONFIGS HERE
};

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();
  const storage = firebaseApp.storage()
  export {storage}
  export default db;