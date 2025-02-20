node v18.20.2
npm i @apollo/server graphql

O/P-http://localhost:9000/graphql

nvm use 20.18.0
npm rebuild better-sqlite3 --location=global
npm install

//client
npm i graphql-request graphql

<!-- db reset -->

node scripts/create-db.js

npm i @apollo/client

<!-- populate the db with 50 jobs using the seed -->

node scripts/insert-50-jobs.js
npm i @apollo/client
