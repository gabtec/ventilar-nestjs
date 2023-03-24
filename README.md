# Ventilators Park Management API

v.pARk for short is a app that allows users to manage ventilation equipments in Hospitals. Synce after, and even during, covid pandemic, this kind of equipments were vital and many times short for the needs.

## API software stack

- node v18.13.0 LTS
- NESTjs v9.0.0
- Postgresql v14

## Initial setup

- npm install
- npm run start:dev

## Database schema

- t_wards
- t_users (must always start with a admin user)
- t_ventilators
- t_orders

## Database pg_dumps

Added a container volume called /backups to extract pg_dump files
The commands used are:

```sh
# dumps only schemas (including create db), ignoring migrations tables
$ pg_dump -U <user> -d ventilar_db -sC --exclude-table=public.migrations* -f backups/dump_v1.sql

# dumps only data (for seeds purposes), ignoring migrations tables
$ pg_dump -U <user> -d ventilar_db -a --exclude-table=public.migrations* -f backups/data_v1.sql
```

## Deploy using containers

This project has a built in github actions workflow that builds docker images
To use those images you can use this command:

```sh
$ docker run -p 3002:3002 --env-file .env.production --name ventilar-api <registry>/ventilar-api:latest
```

.env.production file example

```sh
# can be ignored, since we must explicitly set this env vars
NODE_ENV=production

# required
DB_USER=admin
# required
DB_PASSWORD=admin
# required
DB_HOST=localhost
# can be ignored, default is ventilar_db
DB_NAME=ventilar_db
# can be ignored, default is 5432
DB_PORT=5432
# can be ignored, default is postgres (at the moment, also the only supported)
DB_DRIVER=postgres
# can be ignored, default is 3002
API_SRV_PORT=3002

# required
ACCESS_TOKEN_SECRET=<some-token>
# can be ignored, default is 1 minute
ACCESS_TOKEN_DURATION=600000
# required
REFRESH_TOKEN_SECRET=<some-token>
# can be ignored, default is 1 day
REFRESH_TOKEN_DURATION=86400000
```

## Tests

In order to ru unit tests I needed to add this lines to package.json / jest obj

```js
  "moduleNameMapper": {
    "^src/(.*)$": "<rootDir>/$1"
  }
```

If I don't do this,, I get this error:

`````js
Cannot find module 'src/orders/entities/order.entity' from 'wards/entities/ward.entity.ts'

    Require stack:
      wards/entities/ward.entity.ts
````

...
`````

## Development decisions

- it's allowed to create a user without a ward, because admin user may not have a ward
- but other users, MUST, be created with a ward associated
