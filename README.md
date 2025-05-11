# TaskFlow - Task Management System

A comprehensive task management system built with Next.js and Supabase, designed for team collaboration and efficient task tracking.

## Features

- **User Authentication:** Secure email/password login and registration
- **Task Management:** Create, read, update, and delete tasks with full details
- **Team Collaboration:** Assign tasks to team members with real-time notifications
- **Dashboard:** View tasks assigned to you, created by you, and overdue tasks
- **Search & Filtering:** Find tasks by title, description, status, priority, and due date
- **Responsive Design:** Works seamlessly on mobile, tablet, and desktop
- **Dark/Light Mode:** Choose your preferred visual theme
- **Real-time Updates:** Instant notifications for task assignments and changes

## Tech Stack

- **Frontend:** Next.js 13 with App Router
- **UI Components:** shadcn/ui with Tailwind CSS
- **Authentication:** Supabase Auth
- **Database:** Supabase PostgreSQL
- **Deployment:** Vercel, Netlify, or your preferred platform

## Setup Instructions

1. **Clone this repository**

   ```bash
   git clone https://github.com/yourusername/taskflow.git
   cd taskflow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Supabase**

   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Connect your application to Supabase following their setup guide
   - Copy your Supabase URL and anon key to `.env.local` file (use `.env.example` as a template)

4. **Run migrations**

   - Apply the database migrations in the `supabase/migrations` folder

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Visit [http://localhost:3000](http://localhost:3000) to see the app running**

## Approach and Methodology

This project was built with a focus on:

- **Clean, maintainable code** with proper separation of concerns
- **Type safety** using TypeScript throughout
- **Responsive design** for all device sizes
- **Performance optimization** for a smooth user experience
- **Security best practices** for data and authentication
- **Modern UI/UX principles** for an intuitive interface


## License

MIT
