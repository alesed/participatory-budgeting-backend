# Backend part

Express based server including APIs connecting frontend and database.

# Installation

Requirements:

- PostgreSQL v13
- Node.js (v14.16.0+)
- Optional: nodemon (for development purpose - hot reload)

Install:

```bash
$ npm install
```

# Usage

Production mode:

```bash
$ node app
```

Development (hot reload) mode:

```bash
$ nodemon app
```

# Database seed

- Repository contains database schema and seed with testing data (for subject Svinov)
- Files are available in `./database`
- Files are `.sql` and neeeds to be executed in this order: `schema.sql` -> `seed.sql`
