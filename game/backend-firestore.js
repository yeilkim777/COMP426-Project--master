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
firebase.initializeApp(firebaseConfig)
// const db = firebase.firestore();
// db.settings({timestampsInSnapshot: true})
const database = firebase.firestore();
//let testget = database.collection('1').doc('time');

// export async function setData() {
//     for (let i = 1; i <= 20; i ++) {
//         let set = i.toString()
//         await database.collection(set).doc('time').set({
//             'body':[]
//         })
//         await database.collection(set).doc('move').set({
//             'body':[]
//         })
//     }
// }

// setData()

export async function boardSet(id, type, array) {//set parameter to array
    let stid = id.toString();
    let dbURL = database.collection(stid).doc(type);
    // everything needs to be in strings
    await dbURL.set({
        'body': array
    })
}

export async function boardGet(id, type) {
    let stid = id.toString()
    let dbURL = database.collection(stid).doc(type)
    let result = await dbURL.get();
    return result.data().body
}