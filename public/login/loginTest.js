import { centralDataBase } from "../firebaseCentral.js"

$("#btnLogin").on('click', login)
$("#btnSignUp").on('click', signUp)

logOut();

export function hideAll(){
    $("#text1").hide();
    $("#text2").hide();
    $("#text4").hide();
    $("#text5").hide();
}

export function login() {
    let firebase = centralDataBase();
    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    console.log('reach login')
    const email = txtEmail.value;
    const password = txtPassword.value;
    const auth = firebase.auth();
    // sign in 
    const promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(e => console.log(e.message));
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            console.log('logged in as: ' + firebaseUser.email);
            hideAll();
            $("#text2").show();
            window.localStorage.setItem('user',firebaseUser.email);
        } else {
            console.log('not logged in');
            hideAll();
            $("#text5").show();
        }
    });
}

export function logOut() {
    let firebase = centralDataBase();
    hideAll();
    firebase.auth().signOut();
}

export function signUp() {
    let firebase = centralDataBase()

    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const email = txtEmail.value;
    const password = txtPassword.value;
    const auth = firebase.auth();
    // create user
    const promise = auth.createUserWithEmailAndPassword(email, password);
    promise.catch(e => console.log(e.message));
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            console.log('logged in as: ' + firebaseUser.email);
            hideAll();
            $("#text1").show();
        } else {
            hideAll();
            $("#text4").show();
            console.log('not logged in');
        }
    });
}