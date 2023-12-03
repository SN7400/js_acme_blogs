// Shenandoah Bennett Final Project INF 651 VC Fall 2023

function createElemWithText(htmlElement = "p", textContent = "", className) {
    const element = document.createElement(htmlElement);
    element.textContent = textContent;
    if (className) {
        element.classList.add(className);
    }
    return element;
}

function createSelectOptions(users) {
    if (!users) {
        return undefined
    } else {
        const optionsArray = [];
        for (user of users) {
            const option = createElemWithText("option", user.name);
            option.value = user.id;
            optionsArray.push(option);
        }
        return optionsArray;
    }
}

function toggleCommentSection(postId) {
    if (!postId) {
        return undefined;
    } else {
        const section = document.querySelector(`section[data-post-id="${postId}"]`);
        if (section) {
            section.classList.toggle("hide");
        }
        return section;
    }
}

function toggleCommentButton(postId) {
    if (!postId) {
        return undefined;
    } else {
        const button = document.querySelector(`button[data-post-id="${postId}"]`);
        if (button) {
            switch (button.textContent) {
                case "Show Comments":
                    button.textContent = "Hide Comments";
                    break;
                case "Hide Comments":
                    button.textContent = "Show Comments";
                    break;
            }
        }
        return button;
    }
}

function deleteChildElements(parentElement) {
    if (!parentElement || typeof parentElement !== "object" || !parentElement.toString().includes("HTML")) {
        return undefined;
    } else {
        child = parentElement.lastElementChild;
        while (child) {
            parentElement.removeChild(child);
            child = parentElement.lastElementChild;
        }
        return parentElement;
    }
}

function addButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    if (buttons) {
        for (let button of buttons) {
            if (button.dataset.postId) {
                button.addEventListener("click", (e) => toggleComments(e, button.dataset.postId));
            }
        }
    }
    return buttons;
}

function removeButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    if (buttons) {
        for (let button of buttons) {
            if (button.dataset.postId) {
                button.removeEventListener("click", toggleComments);
            }
        }
    }
    return buttons;
}

function createComments(commentsData) {
    if (!commentsData) {
        return undefined;
    } else {
        const fragment = document.createDocumentFragment();
        for (let comment of commentsData) {
            const article = document.createElement("article");
            const h3 = createElemWithText("h3", comment.name);
            const body = createElemWithText("p", comment.body);
            const from = createElemWithText("p", `From: ${comment.email}`);
            article.append(h3, body, from);
            fragment.append(article);
        }
        return fragment;
    }
}

function populateSelectMenu(usersData) {
    if (!usersData) {
        return undefined;
    } else {
        const selectMenu = document.getElementById("selectMenu");
        const options = createSelectOptions(usersData);
        for (let option of options) {
            selectMenu.append(option);
        }
        return selectMenu;
    }
}

async function getUsers() {
    try {
        const users = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!users.ok) throw new Error("Fetching list of users was unsuccessful.");
        return await users.json();
    } catch (error) {
        console.error(error);
    }
}

async function getUserPosts(userId) {
    if (!userId) {
        return undefined;
    } else {
        try {
            const posts = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);
            if (!posts.ok) throw new Error("Fetching user's posts was unsuccessful.");
            return await posts.json();
        } catch (error) {
            console.error(error);
        }
    }
}

async function getUser(userId) {
    if (!userId) {
        return undefined;
    } else {
        try {
            const user = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
            if (!user.ok) throw new Error("Fetching user data was unsuccessful.");
            return await user.json();
        } catch (error) {
            console.error(error);
        }
    }
}

async function getPostComments(postId) {
    if (!postId) {
        return undefined;
    } else {
        try {
            const comments = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
            if (!comments.ok) throw new Error("Fetching post's comments was unsuccessful.");
            return await comments.json();
        } catch (error) {
            console.error(error);
        }
    }
}

async function displayComments(postId) {
    if (!postId) {
        return undefined;
    } else {
        const section = document.createElement("section");
        section.dataset.postId = postId;
        section.classList.add("comments", "hide");
        const comments = await getPostComments(postId);
        const fragment = createComments(comments);
        section.append(fragment);
        return section;
    }
}

async function createPosts(posts) {
    if (!posts) {
        return undefined;
    } else {
        const fragment = document.createDocumentFragment();
        for (let post of posts) {
            const article = document.createElement("article");
            const postTitle = createElemWithText("h2", post.title);
            const postBody = createElemWithText("p", post.body);
            const postId = createElemWithText("p", `Post ID: ${post.id}`);
            const author = await getUser(post.userId);
            const postAuthor = createElemWithText("p", `Author: ${author.name} with ${author.company.name}`);
            const postCatchPhrase = createElemWithText("p", author.company.catchPhrase);
            const postButton = createElemWithText("button", "Show Comments");
            postButton.dataset.postId = post.id;
            const section = await displayComments(post.id);
            article.append(postTitle, postBody, postId, postAuthor, postCatchPhrase, postButton, section);
            fragment.append(article);
        }
        return fragment;
    }
}

async function displayPosts(posts) {
    const mainElement = document.querySelector("main");
    let element;
    if (posts) {
        element = await createPosts(posts);
    } else {
        element = createElemWithText("p", "Select an Employee to display their posts.");
        element.classList.add("default-text");
    }
    mainElement.append(element);
    return element;
}

function toggleComments(event, postId) {
    if (!event || !postId) {
        return undefined;
    } else {
        event.target.listener = true;
        const section = toggleCommentSection(postId);
        const button = toggleCommentButton(postId);
        return [section, button];
    }
}

async function refreshPosts(posts) {
    if (!posts) {
        return undefined;
    } else {
        const removeButtons = removeButtonListeners();
        mainElement = document.querySelector("main");
        const main = deleteChildElements(mainElement);
        const fragment = await displayPosts(posts);
        const addButtons = addButtonListeners();
        return [removeButtons, main, fragment, addButtons];
    }
}

async function selectMenuChangeEventHandler(event) {
    if (!event || event.type !== "change") {
        return undefined;
    } else {
        const selectMenu = document.getElementById("selectMenu");
        selectMenu.disabled = true;
        const userId = event?.target?.value || 1;
        const posts = await getUserPosts(userId);
        const refreshPostsArray = await refreshPosts(posts);
        selectMenu.disabled = false;
        return [userId, posts, refreshPostsArray];
    }
}

async function initPage() {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
}

function initApp() {
    initPage();
    const selectMenu = document.getElementById("selectMenu");
    selectMenu.addEventListener("change", selectMenuChangeEventHandler);
}

document.addEventListener("DOMContentLoaded", initApp);