function customRender(element, container) {
    const { type, props, children } = element;

    // Create the DOM element
    const domElement = document.createElement(type);

    // Set the attributes
    for (const [key, value] of Object.entries(props)) {
        domElement.setAttribute(key, value);
    }

    // Set the text content
    domElement.textContent = children;

    // Append the element to the container
    container.appendChild(domElement);
}
    
const ReactElement = {
    type: 'a',
    props: {
        href: 'https://www.google.com',
        target: '_blank',
    },
    children: 'Click me to visit google'
}
const container = document.getElementById("root");

customRender(ReactElement, container);