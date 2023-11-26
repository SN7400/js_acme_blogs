// Shenandoah Bennett Final Project INF 651 VC Fall 2023

function createElemWithText (htmlElement = "p", textContent = "", className) {
    const element = document.createElement(htmlElement);
    const content = document.createTextNode(textContent);
    element.appendChild(content);
    if (className !== undefined) {
        element.classList.add(className);
    }
    return element;
}

function createSelectOptions (users) {
    if (users === undefined) {
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