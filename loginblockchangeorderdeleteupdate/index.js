import { authenticateUser, addUserAction, getUserActions, updateUserActionsOrder, deleteUserAction } from './functions.js';

document.addEventListener("DOMContentLoaded", function() {
    const loginContainer = document.getElementById("login-container");
    const logoutContainer = document.getElementById("logout-container");
    const loginButton = document.getElementById("login-button");
    const logoutButton = document.getElementById("logout-button");
    const sidebar = document.getElementById("sidebar");
    const nodesContainer = document.getElementById("nodes-container");
    const updateOrderButton = document.getElementById("update-order-button");

    let loggedInUser = localStorage.getItem('loggedInUser');

    if (loggedInUser) {
        loginContainer.style.display = "none";
        logoutContainer.style.display = "block";
        sidebar.style.display = "block";
        nodesContainer.parentElement.style.display = "block"; // Show draggable container

        // Load user actions from Firebase and display draggable nodes
        loadUserActions();

        // Handle sidebar button clicks
        document.querySelectorAll(".action-button").forEach(button => {
            button.addEventListener("click", function() {
                const action = button.getAttribute("data-action");
                addUserAction(loggedInUser, action);
                loadUserActions(); // Refresh the list to show updated actions
            });
        });

        // Handle update order button click
        updateOrderButton.addEventListener("click", function() {
            const nodes = Array.from(nodesContainer.children).map(node => node.dataset.action);
            updateUserActionsOrder(loggedInUser, nodes);
        });
    } else {
        loginContainer.style.display = "block";
        logoutContainer.style.display = "none";
        sidebar.style.display = "none";
        nodesContainer.parentElement.style.display = "none"; // Hide draggable container
    }

    loginButton.addEventListener("click", function() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        authenticateUser(username, password, function(success) {
            if (success) {
                loggedInUser = username;
                localStorage.setItem('loggedInUser', username);
                loginContainer.style.display = "none";
                logoutContainer.style.display = "block";
                sidebar.style.display = "block";
                nodesContainer.parentElement.style.display = "block"; // Show draggable container

                // Load user actions from Firebase and display draggable nodes
                loadUserActions();
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
            logoutContainer.style.display = "none";
            sidebar.style.display = "none";
            nodesContainer.parentElement.style.display = "none"; // Hide draggable container
        });
    }

    function loadUserActions() {
        getUserActions(loggedInUser, actions => {
            nodesContainer.innerHTML = ''; // Clear existing nodes
            if (actions && actions.length > 0) {
                actions.forEach((action, index) => {
                    const node = document.createElement("div");
                    node.className = "draggable-node";
                    node.dataset.action = action;
                    node.dataset.id = index; // Store the index as data-id
                    node.textContent = action;

                    // Create delete button
                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Delete";
                    deleteButton.className = "delete-button";
                    deleteButton.addEventListener("click", function() {
                        deleteUserAction(loggedInUser, index, (success) => {
                            if (success) {
                                // Remove the node from the DOM
                                nodesContainer.removeChild(node);
                            } else {
                                alert("Failed to delete action.");
                            }
                        });
                    });

                    node.appendChild(deleteButton);
                    nodesContainer.appendChild(node);
                    makeDraggable(node);
                });
            } else {
                nodesContainer.innerHTML = "<p>No actions available.</p>";
            }
        });
    }

    function makeDraggable(element) {
        element.draggable = true;

        element.addEventListener("dragstart", function(event) {
            event.dataTransfer.setData("text/plain", element.dataset.id);
            element.classList.add("dragging");
        });

        element.addEventListener("dragend", function() {
            element.classList.remove("dragging");
        });

        element.addEventListener("dragover", function(event) {
            event.preventDefault();
            const draggingElement = document.querySelector(".dragging");
            if (event.target && event.target !== draggingElement && event.target.classList.contains("draggable-node")) {
                event.target.classList.add("drag-over");
            }
        });

        element.addEventListener("dragleave", function(event) {
            if (event.target.classList.contains("drag-over")) {
                event.target.classList.remove("drag-over");
            }
        });

        element.addEventListener("drop", function(event) {
            event.preventDefault();
            const draggingElement = document.querySelector(".dragging");
            if (event.target && event.target.classList.contains("draggable-node") && draggingElement !== event.target) {
                const draggingId = draggingElement.dataset.id;
                const targetId = event.target.dataset.id;

                const draggingAction = draggingElement.dataset.action;
                const targetAction = event.target.dataset.action;

                draggingElement.dataset.action = targetAction;
                draggingElement.textContent = targetAction;

                event.target.dataset.action = draggingAction;
                event.target.textContent = draggingAction;

                updateNodeOrder();
            }
            event.target.classList.remove("drag-over");
        });
    }

    function updateNodeOrder() {
        const nodes = Array.from(nodesContainer.children).map(node => node.dataset.action);
        updateUserActionsOrder(loggedInUser, nodes);
    }
});
