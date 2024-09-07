import { addUser } from './functions.js';

const addUserButton = document.getElementById("add-user-button");

addUserButton.addEventListener("click", function() {
    const newUsername = document.getElementById("new-username").value;
    const newPassword = document.getElementById("new-password").value;

    if (newUsername && newPassword) {
        addUser(newUsername, newPassword);
        alert("User added successfully!");
    } else {
        alert("Please enter both a username and password.");
    }
});
