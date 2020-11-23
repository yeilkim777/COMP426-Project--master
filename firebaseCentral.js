const firebaseConfig = {
    apiKey: "AIzaSyDUsTofzxg1qguG8LXv18lbb2G4JbUqtpo",
    authDomain: "comp-426-final-824f1.firebaseapp.com",
    databaseURL: "https://comp-426-final-824f1.firebaseio.com",
    projectId: "comp-426-final-824f1",
    storageBucket: "comp-426-final-824f1.appspot.com",
    messagingSenderId: "96551300072",
    appId: "1:96551300072:web:659cf8a809423dd9dd925d",
    measurementId: "G-4SDCCT28QK" 
};
let db = firebase.initializeApp(firebaseConfig)

export function centralDataBase () {
    return db;
}