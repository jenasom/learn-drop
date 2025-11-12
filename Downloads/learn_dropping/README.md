# Learn Drop - Newsletter Platform

A modern, Apple-inspired newsletter platform built with Next.js, featuring newsletter creation, subscription management, and monetization through Paystack.

## Features

- **Newsletter Management**: Create, edit, and publish newsletters with a beautiful editor
- **Subscriber Management**: Grow and manage your audience with built-in tools
- **Monetization**: Earn money through flexible subscription and sponsorship options
- **Analytics**: Track opens, clicks, and subscriber growth
- **Admin Dashboard**: Comprehensive platform management tools
- **Authentication**: Secure user authentication and authorization
- **Responsive Design**: Works seamlessly on all devices

## Project Structure

\`\`\`
learn-drop/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # User dashboard
│   ├── onboarding/       # Onboarding flow
│   ├── pricing/          # Pricing page
│   ├── page.tsx          # Landing page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── ui/              # UI components
│   ├── newsletter-card.tsx
│   └── stat-card.tsx
├── lib/
│   ├── auth.ts          # Auth utilities
│   ├── api.ts           # API helpers
│   └── utils.ts         # General utilities
├── scripts/
│   └── 01-create-tables.sql  # Database schema
├── public/              # Static assets
├── package.json
├── tsconfig.json
└── next.config.mjs
\`\`\`

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for database)
- Paystack account (for payments)
- MailerLite account (for email delivery)

### Installation

1. Clone the repository and install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Set up environment variables in the Vercel UI or create a `.env.local` file:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
PAYSTACK_SECRET_KEY=your-paystack-secret-key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your-paystack-public-key
MAILERLITE_API_KEY=your-mailerlite-api-key
\`\`\`

3. Set up the database:
   - Go to your Supabase dashboard
   - Run the SQL script from `scripts/01-create-tables.sql`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Database Schema

The platform uses Supabase (PostgreSQL) with the following main tables:

- **users**: User accounts with authentication and subscription info
- **newsletters**: Newsletter configurations and metadata
- **newsletter_issues**: Individual newsletter editions
- **subscribers**: Newsletter subscribers
- **payments**: Payment transaction records
- **analytics**: Performance metrics and analytics data

## API Routes

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - User login

### Newsletters
- `GET /api/newsletters` - List user's newsletters
- `POST /api/newsletters` - Create new newsletter
- `GET /api/newsletters/[id]` - Get newsletter details
- `POST /api/newsletters/[id]/issues` - Create newsletter issue

### Payments
- `POST /api/payments/paystack` - Initialize Paystack payment
- `GET /api/payments/paystack/verify` - Verify payment

### Admin
- `GET /api/admin/stats` - Get platform statistics

## Integration Setup

### Supabase
1. Create a new Supabase project
2. Run the database schema SQL script
3. Enable Row Level Security (RLS) on tables
4. Get your API credentials from the dashboard

### Paystack
1. Sign up for a Paystack account
2. Get your API keys from the dashboard
3. Add your webhook URL in Paystack settings

### MailerLite
1. Create a MailerLite account
2. Get your API key from settings
3. Set up automation for welcome emails

## Development

### Running Tests
\`\`\`bash
npm run test
\`\`\`

### Building for Production
\`\`\`bash
npm run build
npm start
\`\`\`

## Deployment

The app is ready to deploy on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Features TODO

- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Advanced analytics dashboard
- [ ] Sponsor marketplace
- [ ] API for third-party integrations
- [ ] Custom domains
- [ ] Webhook support
- [ ] A/B testing
- [ ] Subscriber segmentation
- [ ] Automated campaigns

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@learndrop.com or open an issue in the repository.

## Roadmap

- Q1 2025: Launch beta version
- Q2 2025: Premium features
- Q3 2025: Marketplace launch
- Q4 2025: Advanced analytics and AI features
