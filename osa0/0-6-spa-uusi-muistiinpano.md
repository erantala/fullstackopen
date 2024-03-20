```mermaid
sequenceDiagram
    participant server
    participant browser
    
    Note left of browser: Browser appends new note to notes array in memory and triggers redrawNotes().<br>Browser sends copy of new note to backend.
    
    browser->>+server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    server-->>-browser: {"message":"note created"}