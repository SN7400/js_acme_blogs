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