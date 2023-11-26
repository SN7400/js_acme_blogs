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