import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase configuration
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

document.addEventListener("DOMContentLoaded", function() {
    // HTML elements
    const loginContainer = document.getElementById("login-container");
    const valueContainer = document.getElementById("value-container");
    const loginButton = document.getElementById("login-button");
    const submitButton = document.getElementById("submit-button");
    const logoutButton = document.getElementById("logout-button");
    const valuesListEl = document.getElementById("values-list");

    let loggedInUser = localStorage.getItem('loggedInUser');

    if (loggedInUser) {
        loginContainer.style.display = "none";
        valueContainer.style.display = "block";
        fetchAndDisplayValues();
    } else {
        loginContainer.style.display = "block";
        valueContainer.style.display = "none";
    }

    loginButton.addEventListener("click", function() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        authenticateUser(username, password, function(success) {
            if (success) {
                loggedInUser = username;
                localStorage.setItem('loggedInUser', username);
                loginContainer.style.display = "none";
                valueContainer.style.display = "block";
                fetchAndDisplayValues();
            } else {
                alert("Login failed. Please check your credentials.");
            }
        });
    });

    if (logoutButton) {
        logoutButton.addEventListener("click", function() {
            localStorage.removeItem('loggedInUser');
            loggedInUser = null;
            loginContainer.style.display = "block";
            valueContainer.style.display = "none";
        });
    }

    submitButton.addEventListener("click", function() {
        const value1 = document.getElementById("value1").value;
        const value2 = document.getElementById("value2").value;
        const value3 = document.getElementById("value3").value;

        if (value1 && value2 && value3) {
            const values = { value1, value2, value3 };
            submitValues(loggedInUser, values);
            clearValueFields();
            appendValuesToList(values);
        } else {
            alert("Please enter all values.");
        }
    });

    function clearValueFields() {
        document.getElementById("value1").value = "";
        document.getElementById("value2").value = "";
        document.getElementById("value3").value = "";
    }

    function fetchAndDisplayValues() {
        fetchValues(loggedInUser, function(values) {
            if (values) {
                valuesListEl.innerHTML = ""; // Clear existing list
                Object.values(values).forEach(value => {
                    appendValuesToList(value);
                });
            }
        });
    }

    function appendValuesToList(values) {
        valuesListEl.innerHTML += `<li>Value1: ${values.value1}, Value2: ${values.value2}, Value3: ${values.value3}</li>`;
    }

    function authenticateUser(username, password, callback) {
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

    function submitValues(username, values) {
        const userValuesRef = ref(database, 'user-values/' + username);
        push(userValuesRef, values);
    }

    function fetchValues(username, callback) {
        const userValuesRef = ref(database, 'user-values/' + username);
        onValue(userValuesRef, (snapshot) => {
            callback(snapshot.val());
        });
    }
});
