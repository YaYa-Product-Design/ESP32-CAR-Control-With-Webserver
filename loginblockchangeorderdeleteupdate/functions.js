import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, get, push, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

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

// Function to add a user action
export function addUserAction(username, action) {
    const userActionsRef = ref(database, 'usersActions/' + username);
    push(userActionsRef, action);
}

// Function to get user actions
export function getUserActions(username, callback) {
    const userActionsRef = ref(database, 'usersActions/' + username);
    get(userActionsRef).then((snapshot) => {
        if (snapshot.exists()) {
            const actions = Object.values(snapshot.val());
            callback(actions);
        } else {
            callback([]);
        }
    }).catch((error) => {
        console.error("Error getting user actions:", error);
        callback([]);
    });
}

// Function to update user actions order
export function updateUserActionsOrder(username, orderedActions) {
    const userActionsRef = ref(database, 'usersActions/' + username);
    set(userActionsRef, orderedActions.reduce((acc, action, index) => {
        acc[index] = action;
        return acc;
    }, {}));
}

// Function to delete a user action
export function deleteUserAction(username, actionId, callback) {
    const userActionRef = ref(database, 'usersActions/' + username + '/' + actionId);
    remove(userActionRef).then(() => {
        console.log("Action deleted successfully.");
        callback(true);
    }).catch((error) => {
        console.error("Error deleting action:", error);
        callback(false);
    });
}

// Function to add a new user
export function addUser(username, password) {
    const usersRef = ref(database, 'users/' + username);
    set(usersRef, { password: password });
}

// Function to authenticate a user
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
