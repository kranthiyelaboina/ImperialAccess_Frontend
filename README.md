# ImperialAccess

> A modern, face-first access control and hospitality management platform built with React, TypeScript, and Vite.

## Overview

ImperialAccess is a comprehensive access management system designed for premium hospitality and residency environments. It provides seamless guest registration, face-recognition-based access, and integrated administrative controls for managing camera feeds, attendance, dining, and facility access.

## Key Features

- **Face-First Authentication**: Secure, seamless access via facial recognition
- **Guest Experience Portal**: One-time registration for comprehensive facility access
- **Admin Control Panel**: 
  - Real-time camera feed monitoring
  - Access control management
  - Attendance tracking
  - Dining reservations
- **Premium Dashboard**: Intuitive, real-time data visualization
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern Architecture**: React 19 with TypeScript for type safety and developer experience

## Tech Stack

- **Frontend Framework**: React 19.2.4
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.3.1
- **Routing**: React Router DOM 7.13.1
- **Animation**: Framer Motion 12.34.3
- **Styling**: Pure CSS (no Tailwind)
  - Normalize.css
  - Webflow CSS framework
  - Custom styles (auth.css, custome.css, df-club.css)
- **Utilities**: clsx 2.1.1

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn or pnpm

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EmperialAccess
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## 🚀 Usage

### Development

```bash
# Start dev server with hot module reloading
npm run dev
```

### Building for Production

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
EmperialAccess/
├── src/
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   ├── guest/                 # Guest portal components
│   │   ├── admin/                 # Admin dashboard components
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── StatsSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── RequirementsSection.tsx
│   │   └── Footer.tsx
│   ├── styles/
│   │   ├── auth.css               # Authentication & landing styles
│   │   ├── normalize.css
│   │   ├── webflow.css
│   │   ├── dreamfolks-website.webflow.css
│   │   ├── custome.css
│   │   └── df-club.css
│   ├── App.tsx                    # Main app with routing
│   ├── main.tsx                   # Entry point
│   └── index.css
├── public/
│   └── images/                    # Static images
├── dist/                          # Production build output
├── package.json
├── tsconfig.json
├── vite.config.mts
└── .gitignore
```

## 🔑 Key Pages & Routes

### Public Pages
- `/` - Landing page with product showcase
- `/auth/login` - User login
- `/auth/register` - New user registration

### Guest Portal
- `/guest/registration` - Face registration
- `/guest/dashboard` - Guest experience dashboard
- `/guest/*` - 10 guest-specific sub-pages

### Admin Portal
- `/admin/dashboard` - Admin control panel
- `/admin/*` - 10 admin-specific sub-pages (camera feeds, access control, attendance, dining management, etc.)

## 🎨 Design Features

- **Landing Page**: Full-page background image (main.jpg) with semi-transparent overlay
- **Responsive Sections**: Smooth scrolling between Stats, Features, How It Works, and Requirements sections
- **Interactive Cards**: Hover effects on feature and requirement cards
- **Dark Dashboard**: Modern dark-themed dashboards for both guest and admin users
- **Animated Counters**: Real-time animated statistics on landing page

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 📋 CSS Architecture

The project uses a layered CSS architecture (loaded in order):
1. `normalize.css` - Browser reset
2. `webflow.css` - Webflow framework base
3. `dreamfolks-website.webflow.css` - Main design system (8000+ lines)
4. `custome.css` - Custom overrides
5. `df-club.css` - Component-specific styles
6. `auth.css` - Authentication & landing styles (highest priority)

### CSS Variables

Key variables defined in `:root`:
```css
--bg: #fdfcf7              /* Light background */
--font-color: #1f1f20      /* Dark text */
--bg-underline-hover: #ee9a1e  /* Accent orange */
--white: white             /* White */
--lines: #bbbbb6           /* Border color */
```

## 🎯 Features Highlights

### Guest Experience
- **Face Registration**: Secure facial enrollment (480px camera feed)
- **One-Time Registration**: Quick access setup
- **Premium Dashboard**: Exclusive guest features and information

### Admin Control
- **Multi-Camera Monitoring**: Real-time video feeds from various access points
- **Access Logging**: Complete audit trail
- **Attendance Management**: Track guest movements and schedules
- **Dining Integration**: Manage reservations and service

## 🚦 Performance

- Production build: ~1.16 kB HTML, 165.77 kB CSS, 468.97 kB JS (gzipped sizes: 0.54 kB, 32.87 kB, 137.79 kB)
- Fast development server with HMR
- Tree-shaking and code splitting enabled

## 🔐 Security Considerations

- Environment variables for sensitive data (see `.env.local`)
- TypeScript for type-safe code
- React Router for protected routes (authentication context required)
- Face data privacy compliance ready

## 📝 File Organization

- **Components**: Functional components with TypeScript
- **Styles**: Scoped CSS with Webflow framework
- **Public Assets**: Static files served directly
- **Build Output**: Vite-optimized production bundle in `dist/`

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Build and test locally: `npm run build`
4. Submit a pull request

## 📄 License

[Add your license here]

## 📧 Contact

For questions or support, please contact the development team.

---

**Built with ❤️ using React, TypeScript, and modern web technologies.**

## Frontend Integration Checks

### Backend Connectivity

- Dev proxy routes `/api` to `http://localhost:5000`.
- For non-proxy environments, define `VITE_API_URL` with backend base URL.

### Smoke Validation

1. Run build check:
   - `npm run build`
2. Start frontend:
   - `npm run dev`
3. Manual checks:
   - Login as guest and admin
   - Guest dashboard loads with and without active lounge access
   - Admin pages load without null event-name/time crashes
   - Unauthorized direct access to `/guest/*` and `/admin/*` redirects to `/login`
