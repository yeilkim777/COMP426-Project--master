import { centralDataBase  } from "/../firebaseCentral.js"

const database = centralDataBase().firestore(); 

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