🗑️ File Rot & Retention Policy Engine
The Problem: We generate digital clutter daily — temporary screenshots, duplicate downloads, and forwarded media, that silently consumes device storage and expensive cloud quotas. Manual cleanup is overwhelming and rarely happens.

The Solution: The Retention Policy Engine is a "set-it-and-forget-it" automated assistant. Users can create custom rules (e.g., "Flag screenshots older than 30 days") through a clean dashboard. A background cron job acts as the engine, continuously evaluating files against these policies and moving them to a Safe-Action Sandbox before final deletion.

Tech Stack:

Frontend: Next.js (App Router), Tailwind CSS

Backend & Database: Neon Serverless PostgreSQL, Drizzle ORM

Automation: Vercel Cron Jobs