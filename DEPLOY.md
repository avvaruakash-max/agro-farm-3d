# Deploy 3D Farm Model to GitHub Pages (Free)

## One-Time Setup (5 minutes)

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `agro-farm-3d`
3. Set to **Public** (required for free GitHub Pages)
4. Click **Create repository**

### Step 2: Push Code
Run these commands in Terminal:
```bash
cd /Users/ammu/Documents/Agro
git remote add origin https://github.com/YOUR_USERNAME/agro-farm-3d.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repo on GitHub → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** → folder: **/ (root)**
4. Click **Save**
5. Wait 1-2 minutes

### Step 4: Access Your Site
Your 3D model will be live at:
```
https://YOUR_USERNAME.github.io/agro-farm-3d/3d-model/
```

## Updating
After any changes, just run:
```bash
cd /Users/ammu/Documents/Agro
git add -A && git commit -m "Update layout" && git push
```
GitHub Pages auto-redeploys in ~30 seconds.
