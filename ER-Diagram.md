# ERD - Safereturn

```mermaid
---
title: ERD - Safereturn (Optimizado)
---
erDiagram
    Object {
        int IdObject PK
        int IdUser FK
        string Description
        string Category
    }

    Image {
        int IdImage PK
        int IdObject FK
        string Url
    }

    Location {
        int IdLocation PK
        string Name
        string Address
        string Description
    }

    Found {
        int IdFound PK
        int IdObject FK
        int IdLocation FK
        int IdFinder FK
        date FoundDate
    }

    Returned {
        int IdReturned PK
        int IdObject FK
        int IdReturner FK 
        date ReturnDate
    }

    Status_History {
        int IdHistory PK
        int IdObject FK
        int IdStatus FK 
        date StatusChangeDate
    }

    User {
        int IdUser PK
        string Name
        text Password 
        string Role
    }

    Status {
        int IdStatus PK
        string StatusName
    }

    %% Relationships
    Object ||--o{ Image: "has"
    Object ||--o{ Found: "is found"
    Object ||--o{ Returned: "is returned"
    Found ||--o| Location: "at"
    Status_History ||--o| Object: "tracks"
    Status_History ||--|| Status: "refers to"
    User ||--o{ Object: "manages"
    Found ||--|o User: "optional finder"
    Returned ||--|o User: "optional returner"

```
