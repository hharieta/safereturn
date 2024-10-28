# Safereturn

> SafeReturn is a lost property control program that efficiently manages collection, storage and return of lost items.

## Project Overview

The project structure is as follows:

```bash
.
├── Dockerfile.postgres
├── ER-Diagram.md
├── README.md
├── .env
├── app
│   ├── README.md
│   ├── nest-cli.json
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── src
│   ├── test
│   ├── tsconfig.build.json
│   └── tsconfig.json
├── db
│   ├── assets
│   ├── conf
│   ├── data
│   └── scripts
├── docker-compose.yml
└── secrets
    ├── db_password
    └── postgres-passwd
```

`app` - Contains the source code of the NestJS application.

`db` - Contains the database configuration and scripts to create the database and user. This folder is mounted as a volume in the database container.

`secrets` - Contains the passwords for the database and the postgres user.

`.env` - Contains the environment variables for the application and database.

`docker-compose.yml` - Contains the configuration to run the application and database.

`Dockerfile.postgres` - Contains the configuration to build the database image.

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose v2](https://docs.docker.com/compose/)

## How usage

1 - Clone the repository:

```bash
git clone https://github.com/hharieta/safereturn.git
```

2 - create a `.env` file in the root of the project with the following content:

```bash
DB_NAME=safereturn
DB_USER=safeuser
USER_GROUP=safegroup
DB_PORT=5432
DB_VOLUME=./db
DB_HOST=db-safe-service

ADMINER_PORT=8080

NODE_PORT=3000
NODE_VOLUME=./app
NODE_HOST=nest-safe-service
```

Example `.env` file**

3 - Create a `secrets` folder in the root of the project and create two files `db_password` and `postgres-passwd` with the passwords for the database and the postgres user respectively.

```bash
mkdir secrets
echo "strong_password" > secrets/db_password
echo "strong_password" > secrets/postgres-passwd
```

4 - Set permissions to execute the script `init.sh`:

```bash
chmod +x db/scripts/init.sh
```

Note: This script will create a user and grant privileges to the database.

5 - Create folders for the database volumes:

```bash
mkdir db/data
mkdir db/conf
```

6 - Run the following command to start the application:

```bash
docker compose up --build -d
```

Note: Recommended to run the command to whatch the logs:

```bash
docker compose up --build
```

*Note: Future versions will include a script to automate the process of creating the `.env` file and the `secrets` folder.

## ERD - Safereturn

```mermaid
---
title: ERD - Safereturn
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
        varchar FinderName
        date FoundDate
    }

    Returned {
        int IdReturned PK
        int IdObject FK
        varchar ReturnerName
        date ReturnDate
    }

    Status_History {
        int IdHistory PK
        int IdObject FK
        string Status
        date StatusChangeDate
    }

    User {
        int IdUser PK
        string Name
        string Password
        string Role
    }

    %% Relationships
    Object ||--o{ Image: "has"
    Object ||--o{ Found: "is found"
    Object ||--o{ Returned: "is returned"
    Found ||--o| Location: "at"
    Status_History ||--o| Object: "tracks"
    User ||--o{ Object: "manages"
```
