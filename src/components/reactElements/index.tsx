import React from 'react'

const ReactElements = () => {
    // const reactElement = (
    //   <div>
    //     <h1>Hello World</h1>
    //     <p>Welcome to my React app!</p>
    //   </div>
    // )
    const reactElement = React.createElement(
        'div',
        null,
        React.createElement('h1', null, 'Hello World'),
        React.createElement('p', null, 'Welcome to my React app!')
    );

    const reactATag = React.createElement(
        'a',
        {
            href: 'https://www.google.com',
            target: '_blank',
        },
        'Click me to visit google'
    )
    const anotherUser = "teaching 2 mern stack"
    const reactElement2 = React.createElement(
        'div',
        null,
        React.createElement('h1', null, anotherUser),
        React.createElement('p', null, 'Welcome to my React app!')
    );

    const title = "teaching mern stack"
    return (
        <div>
            {reactElement}
            {reactATag}
            <h1>{title}</h1>
            {reactElement2}
        </div>
    )
}

export default ReactElements

