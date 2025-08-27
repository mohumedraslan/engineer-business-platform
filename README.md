# Engineer-Business Platform

A full-stack web application that connects engineers with business owners for project collaboration. Built with Next.js 14+, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

- **User Authentication**: Secure login/registration with Supabase Auth
- **Role-Based Access**: Separate flows for engineers and business owners
- **Profile Management**: Engineers can showcase skills and portfolios
- **Project Posting**: Business owners can post projects with required skills
- **Smart Matching**: AI-powered matching algorithm for engineers and projects
- **Interview Scheduling**: Built-in interview management system
- **Admin Panel**: User approval and platform management
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project
- Git

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd engineer-business-platform
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database-schema.sql`
4. Run the script to create all tables and policies

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

The platform uses three main tables:

- **profiles**: User profiles with role-based fields
- **projects**: Business projects with required skills
- **interviews**: Scheduled meetings between parties

All tables have Row Level Security (RLS) enabled for data privacy.

## 🔐 Authentication Flow

1. Users register with email/password and role selection
2. Engineers complete profile with skills and portfolio
3. Business owners can post projects immediately
4. Admin approval required for engineer profiles
5. Secure session management with Supabase

## 🎯 User Roles

### Engineer
- Complete profile with skills and portfolio
- Browse available projects
- Get matched based on skills
- Schedule interviews with business owners

### Business Owner
- Post projects with requirements
- View matched engineers
- Schedule interviews
- Manage project lifecycle

### Admin
- Approve/reject engineer profiles
- Monitor platform activity
- Manage user accounts

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   └── layout.tsx         # Root layout
├── components/             # Reusable UI components
│   ├── auth/              # Auth forms
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   └── ui/                # Shadcn/UI components
├── lib/                   # Utility libraries
│   ├── supabase/          # Supabase configuration
│   ├── types.ts           # TypeScript types
│   ├── validators.ts      # Zod schemas
│   ├── utils.ts           # Utility functions
│   └── store.ts           # Zustand store
└── middleware.ts          # Route protection
```

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS v4 with custom color schemes and component variants.

### Shadcn/UI
Pre-configured with essential components. Add new components with:

```bash
npx shadcn@latest add <component-name>
```

### Supabase
Configured with SSR support for both client and server-side operations.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review Supabase documentation

## 🔮 Roadmap

- [ ] Real-time notifications
- [ ] Advanced matching algorithm
- [ ] Payment integration
- [ ] Mobile app
- [ ] Analytics dashboard
- [ ] API rate limiting
- [ ] Multi-language support

---

Built with ❤️ using Next.js and Supabase
