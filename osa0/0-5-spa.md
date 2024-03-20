```mermaid
sequenceDiagram
    participant server
    participant browser
    
    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    server-->>-browser: HTML document

    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    server-->>-browser: Style sheet
    
    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    server-->>-browser: SPA JavaScript
    
    Note left of browser: The browser starts executing the JavaScript code that fetches the JSON from the server
    
    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    server-->>-browser: [{ "content", "date"}, ... ]

    Note left of browser: The browser executes the callback function that renders the notes