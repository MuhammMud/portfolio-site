# Deployment Guide: mmudassir.com

## What You Have

A complete Astro project that:
- Renders your Professional/Personal toggle portfolio
- Auto-fetches your Substack posts via RSS at build time
- Rebuilds daily via GitHub Actions so new posts appear automatically
- Deploys for free on Netlify

---

## Step 1: Set Up Locally (5 min)

1. Unzip the project folder
2. Open it in VS Code
3. Open the terminal in VS Code and run:

```bash
npm install
npm run dev
```

4. Visit http://localhost:4321 to see your site locally

---

## Step 2: Push to GitHub (3 min)

1. Go to https://github.com/new
2. Create a new repository called `portfolio-site` (or whatever you prefer)
3. Make it **public** (free Netlify deploys work with public repos)
4. In your VS Code terminal:

```bash
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio-site.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 3: Deploy on Netlify (5 min)

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub** and authorize if needed
4. Choose your `portfolio-site` repository
5. Netlify will auto-detect the settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click **"Deploy site"**
7. Wait ~30 seconds for the first build

Your site is now live at a random Netlify URL like `https://random-name-123.netlify.app`

---

## Step 4: Connect Your Domain (5 min)

1. In Netlify, go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter `www.mmudassir.com`
4. Netlify will tell you to update your DNS settings
5. Go to your domain registrar (wherever you bought mmudassir.com)
6. Update the DNS records:
   - Add a CNAME record: `www` → `your-site-name.netlify.app`
   - Or use Netlify DNS (they'll walk you through it)
7. Wait for DNS propagation (can take up to 48 hours, usually ~30 min)
8. Netlify will auto-provision an SSL certificate

---

## Step 5: Set Up Auto-Rebuild for Substack (5 min)

This makes new Substack posts appear on your site automatically.

1. In Netlify, go to **Site settings** → **Build & deploy** → **Build hooks**
2. Click **"Add build hook"** and name it `daily-rebuild`
3. Copy the hook URL (looks like `https://api.netlify.com/build_hooks/abc123...`)
4. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
5. Click **"New repository secret"**
6. Name: `NETLIFY_BUILD_HOOK`
7. Value: paste the hook URL from step 3
8. Save

Now GitHub Actions will trigger a Netlify rebuild every day at 3am EST. Each rebuild fetches your latest Substack posts.

---

## Making Changes Later

### Update text content (About, Beyond Work, etc.)
Edit `src/data/site.js` — all your content is in one clean file.

### Add/update work experience
Edit the `WORK` array in `src/data/site.js`.

### Update project links
Edit the `PROJECTS` array in `src/data/site.js` — change `url: '#'` to the real URL.

### Swap your personal photo
Replace `public/images/me.jpg` with a new file (keep the same filename), or add a second image and update the `src` in `src/pages/index.astro`.

### Change styles/colors
Edit `src/styles/global.css`.

### After any change:
```bash
git add .
git commit -m "Description of change"
git push
```
Netlify auto-deploys within ~30 seconds.

---

## File Structure

```
portfolio-site/
├── .github/workflows/rebuild.yml  ← Daily auto-rebuild
├── public/images/me.jpg           ← Your photo
├── src/
│   ├── data/
│   │   ├── site.js                ← ALL your content (edit this!)
│   │   └── substack.js            ← RSS fetcher (don't touch)
│   ├── layouts/
│   │   └── BaseLayout.astro       ← HTML wrapper
│   ├── pages/
│   │   └── index.astro            ← Main page
│   └── styles/
│       └── global.css             ← All styles
├── astro.config.mjs               ← Astro config
├── netlify.toml                   ← Netlify config
├── package.json                   ← Dependencies
└── tsconfig.json
```

---

## Troubleshooting

**Build fails on Netlify:**
Check the deploy log — most likely a Node version issue. The `netlify.toml` sets Node 20.

**Substack posts not showing:**
Check that `https://msmudassir.substack.com/feed` is accessible. The RSS fetch happens at build time, not in the browser.

**Domain not working:**
DNS propagation can take time. Check https://dnschecker.org to see if your records have propagated.

**Want to trigger a rebuild manually:**
Go to Netlify → Deploys → click "Trigger deploy" → "Deploy site".
