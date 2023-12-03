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
            let option = document.createElement("option");
            option.value = user.id;
            option.textContent = user.name;
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

function toggleComments() {

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

async function createPosts(postsData) {
    if (!postsData) {
        return undefined;
    } else {
        const fragment = document.createDocumentFragment();
        for (post of postsData) {
            let article = document.createElement("article");
            let postTitle = document.createElement("h2");
            postTitle.textContent = post.title;
            let postBody = document.createElement("p");
            postBody.textContent = post.body;
            let postId = document.createElement("p");
            postId.textContent = `Post ID: ${post.id}`;
            let author = await getUser(post.userId);
            let postAuthor = document.createElement("p");
            postAuthor.textContent = `Author: ${author.name} with ${author.company.name}`;
            let postCatchPhrase = document.createElement("p");
            postCatchPhrase.textContent = author.company.catchPhrase;
            let postButton = document.createElement("button");
            postButton.textContent = "Show Comments";
            postButton.dataset.postId = post.id;
            let section = await displayComments(post.id);
            article.append(postTitle, postBody, postId, postAuthor, postCatchPhrase, postButton, section);
            fragment.append(article);
        }
        return fragment;
    }
}