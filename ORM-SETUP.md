# Neon-Postgre + Drizzle ORM + Next + TS
- ### Install drizzle kit
```
npm i drizzle-orm
npm i -D drizzle-kit
```

- ### You should have installed the Neon serverless driver.
```
npm i @neondatabase/serverless
```

- #### install dotenv package for managing environment variables.
```
npm i dotenv
```

- ### Create a neonDB and get the Connection String
```
    DATA_BASE_URL = <url>
```

# `Create a drizzle.ts file in /src/db dir`
```
import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';
config({ path: ".env" }); // or .env.local
export const db = drizzle(process.env.DATABASE_URL!);
```

# `Create /schema folder in /src/db dir`
##### write the schema for each table

# `Write the schema for each table`
Add `drizzle.config.ts` in the root dir.
```
import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env' });

export default defineConfig({
  schema: "./src/db/Schema/**/*.{ts,js}",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
``` 

## `Apply Changes`
```
npx drizzle-kit generate
```

## `Push Changes`
```
npx drizzle-kit push
```