# Muhammad Ali — Portfolio

Personal portfolio website for Muhammad Ali, AI Engineer specializing in Generative AI, RAG systems, LLM fine-tuning, and workflow automation.

🔗 **Live site:** _add your Vercel link here after deploying_

## Overview

A single-page portfolio built with plain HTML, CSS, and JavaScript — no frameworks, no build step. Features a terminal-inspired dark theme with a typing animation, project showcase, experience timeline, and downloadable resume.

## Sections

- **Home** — intro with animated terminal and profile photo
- **About** — bio, education, and quick facts
- **Stack** — skills grouped by category (AI/ML, prompt engineering, automation, data, deployment)
- **Work** — featured projects with tech tags
- **Path** — internship experience and education timeline
- **Contact** — email, LinkedIn, and GitHub links

## Project structure

```
portfolio/
├── index.html      # main page markup
├── style.css        # all styling
├── script.js         # typing effect, nav scroll, mobile menu, chat widget
├── api/
│   └── chat.js       # serverless function — proxies chat messages to Claude API
└── assets/
    ├── photo.jpg     # profile photo
    └── resume.pdf    # downloadable resume
```

## AI assistant setup

The site includes a floating AI chat widget (bottom-right corner). It calls a Vercel serverless function (`api/chat.js`) which talks to Groq's free API — your API key never reaches the browser.

To enable it after deploying:

1. Get a free API key from [console.groq.com/keys](https://console.groq.com/keys) (sign up, no card required)
2. In your Vercel project: **Settings → Environment Variables**
3. Add a variable named `GROQ_API_KEY` with your key as the value
4. (Optional) Add `GROQ_MODEL` to use a different Groq model — defaults to `openai/gpt-oss-20b`
5. Redeploy (Vercel → Deployments → ⋯ → Redeploy)

Groq's free tier is generous and requires no billing setup — good fit for a portfolio site's traffic.

## Running locally

No build tools needed — just open `index.html` in a browser, or serve the folder with any static server:

```bash
npx serve .
```

## Deployment

Deployed on [Vercel](https://vercel.com):

1. Push this repo to GitHub
2. Import the repo in Vercel
3. Framework preset: **Other** (no build command / output directory needed)
4. Deploy

Any push to the main branch triggers an automatic re-deploy.

## Contact

- Email: aliuniet@gmail.com
- LinkedIn: [muhammad-ali-8a66082b1](https://www.linkedin.com/in/muhammad-ali-8a66082b1)
- GitHub: [@mali-ops](https://github.com/mali-ops)
