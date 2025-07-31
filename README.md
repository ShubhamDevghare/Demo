# Sharp Images Photography & Films

A professional photography portfolio and booking website built with Next.js, featuring:

## Features
- Modern, responsive design
- Service booking system
- Photo gallery management
- Owner admin panel
- Email notifications
- Cloudinary image hosting
- Vercel KV database

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Database**: Vercel KV (Redis)
- **Image Storage**: Cloudinary
- **Email**: Nodemailer with Gmail
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- Vercel account
- Cloudinary account
- Gmail app password

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd sharp-images-photography
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
Create `.env.local` file with the required variables (see `.env.local` example)

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment to Vercel

1. Push your code to GitHub/GitLab/Bitbucket
2. Import project in Vercel dashboard
3. Add environment variables in Vercel project settings
4. Deploy

## Admin Access
- Login URL: `/owner`
- Default credentials:
  - Email: shubhamkd.a02@gmail.com  
  - Password: password

## API Endpoints
- `POST /api/booking-inquiries` - Submit booking inquiry
- `GET /api/gallery/active` - Get active gallery photos
- `POST /api/owner/login` - Owner authentication
- `GET /api/owner/photos` - Manage photos (admin only)

## Project Structure
\`\`\`
├── app/                    # Next.js app router pages
├── components/            # Reusable React components
├── lib/                   # Utility functions and configs
├── public/               # Static assets
└── package.json          # Dependencies and scripts
\`\`\`

## License
This project is proprietary and confidential.
