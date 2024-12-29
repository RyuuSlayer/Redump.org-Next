# Redump.org-Next
A cleanroom redump.org reimplementation using the 2009 source code

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/redump-next.git
cd redump-next
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up PostgreSQL Database

1. Create a new PostgreSQL database:
```sql
CREATE DATABASE redump;
CREATE USER redump_admin WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE redump TO redump_admin;
```

2. Create a `.env` file in the root directory with the following content:
```env
DATABASE_URL="postgresql://redump-admin:your_password@localhost:5432/redump"
NEXTAUTH_SECRET="your-secret-key"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Initialize the Database

Run the following commands to set up the database schema and seed initial data:

```bash
# Generate Prisma client
npx prisma generate

# Push the database schema
npx prisma db push

# Seed the database with initial data
npx prisma db seed
```

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Default Admin Account

After seeding the database, you can log in with these credentials:
- Username: `admin`
- Password: `password123`

## Database Management

### Prisma Studio (Visual Database Editor)

To access the visual database editor:

```bash
npx prisma studio
```

This will open Prisma Studio at `http://localhost:5555`, where you can:
- Browse and edit database records
- Add new entries
- Filter and sort data
- View relationships between tables

### Sample Data

The seed script creates:
1. An admin user
2. Three gaming systems (PS1, PS2, Dreamcast)
3. Sample disc dumps:
   - Final Fantasy VII (PS1)
   - Metal Gear Solid (PS1)
   - Shenmue (Dreamcast)
   - Gran Turismo 3 (PS2)

### Adding Custom Data

1. Using Prisma Studio:
   - Navigate to `http://localhost:5555`
   - Select the table you want to modify
   - Click "Add record" button
   - Fill in the required fields
   - Save changes

2. Using the Web Interface:
   - Log in as admin
   - Use the "New Disc" button on the discs page
   - Fill in the disc information
   - Submit the form

## Project Structure

```
redump-next/
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   └── lib/              # Utility functions and shared code
├── .env                  # Environment variables
└── package.json          # Project dependencies
```

## Development Notes

- The project uses Next.js 14 with the App Router
- Authentication is handled by Auth.js (formerly NextAuth.js)
- Database operations use Prisma ORM
- Styling is done with Tailwind CSS

## Common Issues

1. Database Connection Issues:
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure the database exists and user has proper permissions

2. Authentication Issues:
   - Clear browser cookies
   - Verify NEXTAUTH_SECRET and NEXTAUTH_URL in `.env`
   - Check database connection for session storage

3. Prisma Issues:
   - Run `npx prisma generate` after schema changes
   - Run `npx prisma db push` to sync schema with database
   - Use `npx prisma studio` to verify database state

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
