import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, get, child, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyC-vHtpum7WrQhZEfEBTfqXCyNXr7hUCOo",
    authDomain: "appfor-c2ff8.firebaseapp.com",
    databaseURL: "https://appfor-c2ff8-default-rtdb.firebaseio.com",
    projectId: "appfor-c2ff8",
    storageBucket: "appfor-c2ff8.appspot.com",
    messagingSenderId: "545004458407",
    appId: "1:545004458407:web:55ca4f2b953910c8312682"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to add a new user (admin use)
export function addUser(username, password) {
    const usersRef = ref(database, 'users/' + username);
    set(usersRef, {
        password: password
    });
}

// Function to authenticate a user (student use)
export function authenticateUser(username, password, callback) {
    const usersRef = ref(database, 'users/' + username);
    get(usersRef).then((snapshot) => {
        if (snapshot.exists() && snapshot.val().password === password) {
            callback(true);
        } else {
            callback(false);
        }
    }).catch((error) => {
        console.error("Error authenticating user:", error);
        callback(false);
    });
}


// Function to submit values to the database (student use)
export function submitValues(username, values) {
    const userValuesRef = ref(database, 'user-values/' + username);
    push(userValuesRef, values);
}

// Function to fetch values from the database (student use)
export function fetchValues(username, callback) {
    const userValuesRef = ref(database, 'user-values/' + username);
    onValue(userValuesRef, (snapshot) => {
        callback(snapshot.val());
    });
}
