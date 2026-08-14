# Emmanuel Chinjekure — Personal Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.2-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-10.x-orange?style=flat-square&logo=pnpm)](https://pnpm.io/)

> **Full-Stack Developer · Systems Administrator · Cybersecurity Enthusiast**  
> IT Intern at Cimas Health Group · B.Tech Honours in Information Technology student at Harare Institute of Technology (HIT).

🔗 **GitHub Repository**: [github.com/elic01/elic-portfolio](https://github.com/elic01/elic-portfolio)  
🔗 **LinkedIn**: [linkedin.com/in/emmanuel-l-i-chinjekure](https://www.linkedin.com/in/emmanuel-l-i-chinjekure)  
✉️ **Contact**: [emmanuelisheanesu2004@gmail.com](mailto:emmanuelisheanesu2004@gmail.com)

---

## 🌟 Overview

This repository contains the source code for **Emmanuel Chinjekure's (`elic01`)** personal portfolio and interactive technical showcase. 

Designed with a sleek dark aesthetic, glassmorphism, and custom interactive widgets, the site is engineered on Next.js 16 with a strongly-typed content layer that decouples data from UI rendering.

### ✨ Key Features

- **🚀 Typed Content Engine**: All career data (projects, skills, work experience, education, site changelog) lives in structured, strongly-typed TypeScript modules (`lib/content/`).
- **💻 Interactive Security Shell**: An in-browser CLI terminal (`/cybersecurity`) supporting interactive commands like `whoami`, `skills`, `certifications`, `contact`, and `sudo hire me`.
- **⚙️ DevOps & Homelab Visualizers**: Interactive diagrams (`/devops`) showcasing self-hosted Proxmox VE infrastructure, Docker container stacks (Authentik SSO, Nextcloud, Gitea), and CI/CD pipelines.
- **🎨 Modern Dark Aesthetic**: Built with custom HSL CSS tokens, glassmorphism (`glass-panel`), neumorphic card depth (`neu-card`), CRT scanline overlays, and smooth Framer Motion micro-animations.
- **🛡️ Validated Contact Form**: Built with React Hook Form and Zod validation, complete with anti-spam honeypot protection.
- **🔍 SEO & Accessibility**: Includes JSON-LD structured data (`Person` schema), semantic HTML5, and automatic reduced-motion accessibility fallbacks.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router + Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Framer Motion
- **UI Components**: `@base-ui/react` primitives & Lucide React icons
- **Form Handling**: `react-hook-form` + `@hookform/resolvers` + `zod`
- **Analytics**: `@vercel/analytics`
- **Linting & Quality**: ESLint 9 (Flat Config) + TypeScript Compiler

---

## 📁 Repository Structure

```text
elic-portfolio/
├── app/                  # Next.js App Router routes
│   ├── page.tsx          # Home page (Hero, About, Featured Projects, Skills, Timeline)
│   ├── projects/         # Project showcase & deep-dives
│   ├── cybersecurity/    # Interactive CLI terminal & BIOS boot animation
│   ├── devops/           # CI/CD pipeline & homelab architecture diagrams
│   ├── now/              # Current focus & learning updates
│   ├── contact/          # Contact form with Zod validation
│   └── changelog/        # Site revision history
├── components/           # UI & Feature components
│   ├── cybersecurity/    # Interactive CLI shell & boot sequence
│   ├── devops/           # Pipeline & Stack visualizers
│   ├── home/             # Hero, about, skills preview, timeline
│   ├── projects/         # Detailed project cards
│   └── ui/               # Base UI primitives (buttons, etc.)
├── lib/
│   ├── content/          # Data models & content sources (projects, skills, profile)
│   └── utils.ts          # Utility functions (clsx, tailwind-merge)
├── eslint.config.mjs     # ESLint Flat Config setup
└── package.json          # Dependency definitions & scripts
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js (v20+) and `pnpm` installed:

```bash
corepack enable
```

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/elic01/elic-portfolio.git
   cd elic-portfolio
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start the development server**:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verification & Build Scripts

- **Run Linter**:
  ```bash
  pnpm run lint
  ```
- **TypeScript Type Check**:
  ```bash
  npx tsc --noEmit
  ```
- **Production Build**:
  ```bash
  pnpm run build
  ```
- **Start Production Server**:
  ```bash
  pnpm start
  ```

---

## 📬 Contact & Connect

- **Portfolio Site**: [https://github.com/elic01/elic-portfolio](https://github.com/elic01/elic-portfolio)
- **GitHub**: [@elic01](https://github.com/elic01)
- **LinkedIn**: [Emmanuel Chinjekure](https://www.linkedin.com/in/emmanuel-l-i-chinjekure)
- **Email**: [emmanuelisheanesu2004@gmail.com](mailto:emmanuelisheanesu2004@gmail.com)
- **Location**: Harare, Zimbabwe
