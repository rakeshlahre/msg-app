# msg-app

### Create Database
1. Create Role = rakesh and database = chatapp
    * For Windows, run `psql.exe -U postgres -f sql/db.sql`
    * For Mac / Linux, run `psql -U {default-db-admin-role} -f sql/db.sql`
2. With user and database created, create schema
    * For Windows, run `psql.exe -U rakesh -d chatapp -f sql/schema.sql`
    * For Mac / Linux, run `psql -U rakesh -d chatapp -f sql/schema.sql`
3. Drop all tables in database
    * For Windows, run `psql.exe -U rakesh -d chatapp -f sql/drop-tables.sql`
    * For Mac / Linux, run `psql -U rakesh -d chatapp -f sql/drop-tables.sql`

### Development
1. `npm run install-all`
    * Installs dependencies in base and server-frontend directory
2. `npm start`: (*This should be sufficient to start the app for development*)
    * This runs two scripts: `npm run server`, `npm run serve`. Open `http://localhost:8080`