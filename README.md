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

- t_services
- t_users (must always start with a admin user)

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
