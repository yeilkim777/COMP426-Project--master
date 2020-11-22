export function loginapi() {


    firebase.auth().signOut();

    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const btnLogin = document.getElementById('btnLogin');
    const btnSignUp = document.getElementById('btnSignUp');
    const btnLogout = document.getElementById('btnLogout');

    btnLogin.addEventListener('click', e => {
        // get email and pass
        const email = txtEmail.value;
        const password = txtPassword.value;
        const auth = firebase.auth();
        // sign in 
        const promise = auth.signInWithEmailAndPassword(email, password);
        promise.catch(e => console.log(e.message));
    });

    btnSignUp.addEventListener('click', e => {
        // get email and pass
        // todo: check for real email
        const email = txtEmail.value;
        const password = txtPassword.value;
        const auth = firebase.auth();
        // create user
        const promise = auth.createUserWithEmailAndPassword(email, password);
        promise.catch(e => console.log(e.message));

    });

    btnLogout.addEventListener('click', e => {
        firebase.auth().signOut();
    });

    // realtime auth listener
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            // console.log(firebaseUser)
            console.log('logged in as: ' + firebaseUser.email);
            testUser=  firebaseUser;
            btnLogout.classList.remove('hide');
        } else {
            console.log('not logged in');
            btnLogout.classList.add('hide');
        }
    });
};
