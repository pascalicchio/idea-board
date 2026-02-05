# 🚀 Quick Deploy to Vercel

Since we don't have a Vercel API token stored, here's the **fastest way** to deploy:

## Option 1: GitHub Import (Recommended) ⭐

1. **Go to Vercel Import:**
   👉 https://vercel.com/import/git

2. **Select your repository:**
   - Click "Import Git Repository"
   - Search for "idea-board"
   - Select "pascalicchio/idea-board"

3. **Configure Project:**
   - Framework Preset: `Next.js` (auto-detected)
   - Root Directory: `./` (default)
   - Click "Deploy"

4. **Add Environment Variables:**
   After deployment, go to:
   👉 https://vercel.com/idea-board/settings/environment-variables
   
   Add these two:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
   Then redeploy to apply changes.

5. **🎉 Your board is live at:**
   `https://idea-board.vercel.app/board`

---

## Option 2: Vercel CLI (If you have token)

```bash
export VERCEL_TOKEN=your_token_here
cd /root/.openclaw/idea-board
./deploy-vercel.sh
```

Get token at: https://vercel.com/account/tokens

---

## Option 3: Deploy from Vercel Dashboard

1. 👉 https://vercel.com/new
2. Click "Add GitHub Repository"
3. Select "pascalicchio/idea-board"
4. Add environment variables
5. Deploy!

---

## After Deployment

### Set Up Supabase Database

1. Create project at https://supabase.com
2. Go to SQL Editor
3. Copy & paste contents of `schema.sql`
4. Copy credentials to Vercel

### Your Board URL
```
https://idea-board.vercel.app/board
```

---

**Need help?** The code is already on GitHub:
https://github.com/pascalicchio/idea-board
