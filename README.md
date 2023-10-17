# Descobreix Begur App

Source code for the app.

<https://descobreixbegur.vercel.app>

## Development

### Setup

1. Create the file `.env.local`.
   - Copy the `.env.example` file and update the variables.
   - Or ask @mauriciabad for the file.
1. Install [pnpm](https://pnpm.io/), and the project's dependencies:

   ```bash
   pnpm i
   ```

1. If you want to use a **local database**:

   1. Install [docker](https://www.docker.com/products/docker-desktop/).
   1. Run the database in another console:

      ```bash
      pnpm db:run
      ```

   1. Run database migrations:

      ```bash
      pnpm db:migrate
      ```

1. Run development server:

   ```bash
   pnpm dev
   ```

1. Open <http://localhost:3000> with your browser.
