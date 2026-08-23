🗑️ File Rot & Retention Policy Engine
The Problem: We generate digital clutter daily — temporary screenshots, duplicate downloads, and forwarded media, that silently consumes device storage and expensive cloud quotas. Manual cleanup is overwhelming and rarely happens.

The Solution: The Retention Policy Engine is a "set-it-and-forget-it" automated assistant. Users can create custom rules (e.g., "Flag screenshots older than 30 days") through a clean dashboard. A background cron job acts as the engine, continuously evaluating files against these policies and moving them to a Safe-Action Sandbox before final deletion.

Tech Stack:

Frontend: Next.js (App Router), Tailwind CSS

Backend & Database: Neon Serverless PostgreSQL, Drizzle ORM

Automation: Vercel Cron Jobs




This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
