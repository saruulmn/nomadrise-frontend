# Privacy Policy Implementation Guide

## Overview

This document outlines the bilingual privacy policy structure implemented for NomadRise, designed to meet GDPR requirements and Google OAuth verification standards.

## 📁 File Structure

```
frontend/
├── app/
│   ├── privacy-policy/
│   │   └── page.tsx                 # Redirect to /en/policy
│   ├── [lang]/
│   │   └── policy/
│   │       ├── page.tsx             # Server-side policy page with metadata
│   │       └── PrivacyPolicyContent.tsx  # Bilingual content component
│   ├── components/
│   │   └── LanguageSwitcher.tsx    # Language toggle button
│   │   └── Footer.tsx               # Updated with policy links
│   └── sitemap.ts                   # Already includes /policy routes
├── public/
│   └── robots.txt                   # SEO-optimized crawling rules
└── i18n/
    └── dictionaries/
        ├── en.json                  # English dictionary
        └── mn.json                  # Mongolian dictionary
```

## 🔗 Available Routes

### Primary Routes
- **`/en/policy`** - English Privacy Policy (Full legal document)
- **`/mn/policy`** - Mongolian Privacy Policy (Full legal document)

### Alias Route
- **`/privacy-policy`** - Redirects to `/en/policy` for OAuth verification and root-level SEO

### Footer Links (Static HTML)
- Language-specific links in `<Footer />` component
- Direct links to both language versions: `https://nomadrise.mn/en/policy` and `https://nomadrise.mn/mn/policy`

## ✨ Key Features

### 1. **Server-Side Rendering**
All privacy policy pages are server-side rendered using Next.js App Router to ensure:
- Static HTML crawlable by Google bots
- Proper SEO metadata (Open Graph, canonical URLs)
- Optimal performance for search engines

### 2. **Bilingual Support**
- **English**: Full comprehensive privacy policy with all legal sections
- **Mongolian**: Complete Mongolian translation with matching structure

### 3. **Google OAuth Compliance**
The English privacy policy includes all required sections:
- ✅ Data collection methods
- ✅ How data is used
- ✅ Third-party services (Google OAuth, Apple, Meta)
- ✅ User data deletion instructions
- ✅ Contact email (`privacy@nomadrise.mn`)
- ✅ Data security measures
- ✅ GDPR compliance information

### 4. **Language Switcher**
- Inline language switcher in policy page header
- Allows users to toggle between English and Mongolian
- Smooth transitions with hover effects

### 5. **SEO Optimization**
- ✅ Robots.txt configured for proper crawling
- ✅ Sitemap includes all policy routes
- ✅ Canonical URLs for each language version
- ✅ Open Graph metadata for social sharing
- ✅ Hreflang alternate language links

## 📝 Content Sections

### English Privacy Policy
1. Introduction
2. Information Collection and Use
   - Information You Provide
   - Automatically Collected Information
   - Third-Party Authentication
3. Use of Data
4. Third-Party Services
5. Data Retention
6. User Rights and Data Deletion
7. Security
8. International Data Transfers
9. Children's Privacy
10. GDPR and Data Protection Laws
11. Changes to This Privacy Policy
12. Contact Us

### Mongolian Privacy Policy
Complete Mongolian translation of all English sections.

## 🔐 Data Security

The privacy policy documents include:
- HTTPS encryption for data in transit
- Database encryption at rest
- Regular security audits
- Restricted access controls
- Two-factor authentication options

## 📧 Contact Information

Users can reach out via:
- **Privacy Email**: `privacy@nomadrise.mn`
- **Support Email**: `nomadriseworld@gmail.com`

## 🌐 Accessibility & UX

### Mobile-Responsive
- Optimized styles for small screens
- Touch-friendly language switcher
- Clear typography hierarchy

### Dark Mode Support
- Automatically adapts to system theme preferences
- Maintains readability in both modes

### Semantic HTML
- Proper heading hierarchy (H1, H2, H3)
- List structures for data collections
- Anchor links for third-party policies

## 🚀 Deployment

### Build Process
```bash
npm run build
```

### Verification Steps
1. Deploy to production
2. Test Google crawling: `curl https://nomadrise.mn/en/policy`
3. Verify in Google Search Console:
   - Check coverage for `/policy` routes
   - Test Rich Results for structured data
   - Verify canonical URLs
4. Test privacy policy link in Google OAuth settings

### Google OAuth Verification
1. Go to Google Cloud Console
2. Navigate to OAuth 2.0 Client Settings
3. Add `https://nomadrise.mn/privacy-policy` to Privacy Policy URL
4. Add `https://nomadrise.mn/terms` to Terms of Service URL (if applicable)

## ⚙️ Configuration

### Dictionary Keys
The following keys must remain in `en.json` and `mn.json`:

```json
{
  "footer": {
    "terms": "Terms of Service",        // EN: "Terms of Service" / MN: "Үйлчилгээний нөхцөл"
    "policy": "Privacy Policy"           // EN: "Privacy Policy" / MN: "Нууцлалын бодлого"
  }
}
```

### Metadata Configuration
Update contact information in [PrivacyPolicyContent.tsx](app/[lang]/policy/PrivacyPolicyContent.tsx):
- Line 179-180: Email addresses
- Line 184-187: Additional contact details

## 📊 Monitoring

### Search Console Checks
1. Monitor coverage for `/*/policy` routes
2. Track clicks from search results
3. Verify mobile usability

### Analytics
- Track page views to `/en/policy` and `/mn/policy`
- Monitor language preference
- Track clicks to third-party policy links

## 🔄 Future Updates

To update privacy policy:
1. Edit relevant sections in [PrivacyPolicyContent.tsx](app/[lang]/policy/PrivacyPolicyContent.tsx)
2. Keep both English and Mongolian sections in sync
3. Update the `Last updated` date at the top of each section
4. Rebuild and redeploy

## ✅ Testing Checklist

- [ ] `/en/policy` loads with English content
- [ ] `/mn/policy` loads with Mongolian content
- [ ] `/privacy-policy` redirects to `/en/policy`
- [ ] Language switcher works on both pages
- [ ] Footer displays both language links
- [ ] All links to external policies work
- [ ] Mobile layout responsive
- [ ] Dark mode displays correctly
- [ ] SEO metadata in page source
- [ ] Robots.txt allows crawling
- [ ] Sitemap includes policy routes
- [ ] Google can crawl the pages

## 📚 Additional Resources

- [GDPR Compliance Guide](https://gdpr-info.eu/)
- [Google Privacy Policy Guidelines](https://policies.google.com/privacy)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
