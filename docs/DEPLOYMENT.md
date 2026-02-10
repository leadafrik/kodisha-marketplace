# Deployment Guide - Vercel

## Overview

Deploy your Kodisha Marketplace to Vercel - the easiest way to go live with Next.js.

**Deployment Time: ~15 minutes**

---

## Step 1: Prepare Repository

Your code is already on GitHub. Verify everything is committed:

```bash
cd c:\Users\gordo\kodisha-marketplace
git status  # Should show "nothing to commit"
```

---

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** → Choose **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account
4. Click **"Import Project"**
5. Select **`leadafrik/kodisha-marketplace`**
6. Click **"Import"**

### Option B: Using Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts to link your GitHub repo.

---

## Step 3: Configure Environment Variables

After importing, Vercel will ask for environment variables. Add these:

### Essential (Required)

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### M-Pesa (If using payments)

```
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORT_CODE=174379
MPESA_PASSKEY=your_passkey
MPESA_ENVIRONMENT=production
MPESA_CALLBACK_URL=https://your-domain.com/api/payments/callback
```

### Email (If using notifications)

```
RESEND_API_KEY=your_resend_key
EMAIL_FROM=noreply@kodisha.co.ke
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## Step 4: Deploy

### From Dashboard
1. Click **"Deploy"** button
2. Wait for build to complete (2-3 minutes)
3. Get your live URL: `https://your-project.vercel.app`

### From CLI
```bash
vercel --prod
```

---

## Step 5: Update Supabase Settings

### Enable Realtime for Messaging

```bash
# In Supabase dashboard:
1. Go to Realtime > Policies
2. Enable for `conversations` table
3. Enable for `messages` table
```

### Update OAuth Redirect URL

In Supabase Auth settings:
- Add: `https://your-vercel-domain.vercel.app/auth/callback`

---

## Step 6: Configure Custom Domain (Optional)

### Add Custom Domain

1. In Vercel Dashboard: Project → Settings → Domains
2. Click **"Add Domain"**
3. Enter your domain: `kodisha.co.ke`
4. Follow DNS configuration instructions
5. Point your domain registrar to Vercel nameservers

**DNS Setup:**
- Registrar: Go to DNS settings
- Change nameservers to:
  - `ns1.vercel-dns.com`
  - `ns2.vercel-dns.com`

---

## Step 7: Verify Deployment

Check everything works:

```bash
# Test the live site
https://your-vercel-domain.vercel.app

# Test endpoints
curl https://your-vercel-domain.vercel.app/api/health
```

### Checklist

- [ ] Site loads at your Vercel URL
- [ ] Auth/login works
- [ ] Can browse listings
- [ ] Can upload images
- [ ] Messages load and send
- [ ] Payments show M-Pesa prompt
- [ ] Email notifications work (if configured)

---

## Step 8: Monitor & Debug

### View Logs

```bash
vercel logs
```

### Enable Debug Mode

Add to `.env.production`:
```
DEBUG=kodisha:*
```

### Check Performance

1. Vercel Dashboard → Analytics
2. Monitor:
   - Response times
   - Error rates
   - Database queries

---

## Troubleshooting

### Issue: "Module not found"
- Check all imports use correct paths
- Run `npm install` locally and push changes

### Issue: "Supabase connection failed"
- Verify environment variables are set
- Check Supabase project is accessible
- Confirm RLS policies allow connections

### Issue: "Image uploads not working"
- Verify Supabase Storage bucket exists: `listing-images`
- Check bucket has public read policy
- Ensure RLS policies are correct

### Issue: "Realtime not working"
- Enable Realtime in Supabase: Realtime > Policies
- Add `conversations` and `messages` tables
- Restart messaging page

### Issue: "M-Pesa not working"
- Verify credentials are correct
- Check `MPESA_ENVIRONMENT=production` for live
- Test with M-Pesa sandbox first

---

## Production Checklist

Before launching to users:

- [ ] All environment variables configured
- [ ] Supabase backup enabled
- [ ] RLS policies verified
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Error logging set up
- [ ] Monitoring/alerts configured
- [ ] Database indexes created
- [ ] SSL certificate active (automatic on Vercel)
- [ ] Custom domain configured

---

## Scaling Considerations

### Database
- Supabase auto-scales (you pay per usage)
- Consider read replicas for large traffic
- Monitor connection limits

### Storage
- Supabase Storage scales automatically
- Images should be optimized before upload
- Consider CDN for faster delivery

### Serverless Functions
- Vercel functions auto-scale
- Monitor function execution time
- Set timeouts for long operations

---

## Cost Estimation

**Vercel:**
- Free tier: Perfect for starting
- Pro: $20/month
- Enterprise: Custom pricing

**Supabase:**
- Free tier: Good for prototyping
- Pro: $25/month
- Enterprise: Custom pricing

**M-Pesa (if using):**
- No fixed cost (per-transaction fees)
- ~2-3% per successful transaction

**Email (Resend):**
- Free: 100 emails/day
- Pro: $20/month for unlimited

---

## Next Steps After Launch

1. **Monitor Performance**
   - Set up alerts for errors
   - Track user behavior
   - Monitor database performance

2. **Gather Feedback**
   - Add user feedback form
   - Track common issues
   - Monitor support requests

3. **Optimize**
   - Optimize images and assets
   - Improve slow queries
   - Update designs based on feedback

4. **Scale**
   - Add more listings
   - Expand to more cities/regions
   - Add premium features

---

## Useful Vercel Commands

```bash
# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel list

# View logs
vercel logs [project-name]

# Remove project
vercel remove [project-name]

# Set environment variables
vercel env add VARIABLE_NAME

# See environment variables
vercel env list
```

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **M-Pesa Integration**: https://developer.safaricom.co.ke/

---

## Marketing Launch Checklist

Once deployed, before promoting:

- [ ] Create landing page
- [ ] Set up analytics (Google Analytics)
- [ ] Create social media accounts
- [ ] Write first blog post
- [ ] Email existing users
- [ ] Post on social media
- [ ] Ask for user feedback

---

**Your marketplace is ready to go live! 🚀**
