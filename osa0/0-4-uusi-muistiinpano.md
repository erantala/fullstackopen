```mermaid
sequenceDiagram
    participant server
    participant browser
    
    browser->>+server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    Note right of server: Server adds new note to it's internal storage.<br>Server sends redirect to browser in order to achieve a reload of the page.
    server-->>-browser: 302 redirect to /exampleapp/notes
    
    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    server-->>-browser: HTML document

    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    Note right of server: Notify browser that there have been no changes to css file - use the one already loaded<br>Nevertheless send css file in response.
    server-->>-browser: 304 Not Modified (Stylesheet)
    
    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    Note right of server: Notify browser that there have been no changes to the JavaScript file - use the one already loaded<br>Nevertheless resend file.
    server-->>-browser: 304 Not Modified (JavaScript file)
    
    Note left of browser: The browser starts executing the JavaScript code that fetches the JSON from the server
    
    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    server-->>-browser: [{ "content", "date"}, ... ]

    Note left of browser: The browser executes the callback function that renders the notes 
