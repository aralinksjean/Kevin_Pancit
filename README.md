# Kevin's Panciteria — Website

A static, multi-page restaurant website celebrating Filipino pancit traditions. Built with **plain HTML5, CSS3, and vanilla JavaScript only** — no frameworks, build tools, or backend required. Ready to publish directly through GitHub Pages.

## Project Structure

```
Kevin-Panciteria/
├── index.html          Homepage (hero, featured dishes, heritage, about & contact previews)
├── menu.html            Full interactive menu (search, filters, dish details)
├── about.html           Restaurant story & pancit heritage
├── contact.html         Contact info, hours, social links, demo contact form
├── css/style.css        All site styling (CSS custom properties for theming)
├── js/config.js         Branding & restaurant configuration (edit this first)
├── js/main.js           Shared navigation, footer, and branding interactions
├── js/menu.js           Menu data loading, rendering, search, filters, and modal
├── js/contact.js        Contact form behavior
├── data/menu.json        Menu data (dish info, prices, categories, etc.)
├── assets/branding/      Logo goes here (optional)
├── assets/images/        Dish photos and placeholder graphics
└── README.md
```

## Previewing the Site Locally

Browsers block `fetch()` requests to local JSON files when a page is opened directly via `file://`. If you open `index.html` by double-clicking it, the menu will still work using a built-in fallback dataset in `js/menu.js`, but to see the real `data/menu.json` in action, serve the folder over HTTP:

```powershell
# From the project folder, using Python (if installed):
python -m http.server 8000

# Or using Node.js (if installed):
npx serve .
```

Then open `http://localhost:8000` in your browser. Publishing through GitHub Pages (below) also serves the site over HTTP, so this limitation does not apply once deployed.

## Deploying to GitHub Pages

1. **Create a GitHub repository.** Sign in to GitHub, click **New repository**, give it a name (e.g. `kevins-panciteria`), and create it.
2. **Upload or push the project files.**
   - Easiest: on the repository page, click **Add file → Upload files** and drag in the entire project folder contents (keeping `index.html` at the repository root).
   - Or via Git:
     ```powershell
     git init
     git add .
     git commit -m "Initial Kevin's Panciteria website"
     git branch -M main
     git remote add origin https://github.com/<your-username>/<your-repo>.git
     git push -u origin main
     ```
3. **Open the repository's Settings tab** on GitHub.
4. **Enable GitHub Pages:** go to **Settings → Pages**, under "Build and deployment" choose **Deploy from a branch**, set the branch to `main` and the folder to `/ (root)`, then click **Save**.
5. **Access the published website:** after a minute or two, GitHub will show the live URL, typically `https://<your-username>.github.io/<your-repo>/`.
6. **Update the site:** commit and push changes (or re-upload edited files) — GitHub Pages automatically republishes the latest `main` branch content.

All internal links, images, and scripts use **relative paths**, so the site works correctly whether it's hosted at the domain root or under a repository subpath like `/kevins-panciteria/`.

## Replacing Placeholder Content

### Branding, contact info & hours
Edit `js/config.js`. Every page reads from this single file:
- `restaurantName`, `tagline`
- `logo.imagePath` — set to e.g. `"assets/branding/logo.png"` to replace the text wordmark with a real logo
- `contact.address`, `contact.phone`, `contact.email`, `contact.mapUrl`
- `hours` — array of `{ day, time }` entries
- `social.facebook`, `social.instagram`, `social.tiktok`

Any field left empty is automatically hidden on the site instead of showing fake information. The restaurant address is currently set to **P.F. Alviar, Vintar, Ilocos Norte**, with `contact.mapUrl` pointing to a Google Maps search for that address — update both if the location changes.

### Colors / theme
Edit the CSS custom properties at the top of `css/style.css`:
```css
:root {
  --color-primary: #1f4e3d;
  --color-secondary: #f6e8c8;
  --color-accent: #d9622b;
  --color-background: #fffaf0;
  --color-text: #2b2118;
  --color-card: #ffffff;
}
```

### Food photographs
`data/menu.json` currently links to real pancit photographs hosted on Wikimedia Commons (Creative Commons licensed, with attribution listed on the About page's "Photo Credits" section). Replace these with your own photography by:
1. Adding your image files to `assets/images/`.
2. Updating the `image` path for each dish in `data/menu.json` (and the matching entry in `js/menu.js`'s `FALLBACK_MENU`).
3. Removing the corresponding credit line from `about.html` once a Commons photo is no longer used.

The original placeholder SVG graphics are still available in `assets/images/` if you want a fully offline fallback.

### Menu data (dishes, prices, categories)
Edit `data/menu.json`. Each dish uses this structure:
```json
{
  "id": "pancit-canton",
  "name": "Pancit Canton",
  "description": "...",
  "region": "Nationwide",
  "category": "Classic Pancit",
  "image": "assets/images/pancit-canton.jpg",
  "price": null,
  "featured": true,
  "available": true,
  "ingredients": [],
  "allergens": [],
  "culturalNote": "..."
}
```
- Use `null` for a price that hasn't been set yet (the site will show "Price coming soon"). Current prices are rough averages gathered from public Philippine panciteria/restaurant menus online — replace with your actual prices once finalized.
- `js/menu.js` contains a small `FALLBACK_MENU` array that mirrors `data/menu.json`, used only if the JSON file can't be fetched (e.g. opened via `file://`). Keep it in sync if you change the dish list.

## Testing Checklist

- [x] Homepage, menu, about, and contact pages all load and link to each other correctly.
- [x] CSS/JS/image paths are relative (no leading slashes), so they work under a GitHub Pages subpath.
- [x] Menu search, category filters, and the featured-only toggle work together.
- [x] Dish detail modal opens, closes (button, Escape, backdrop), and returns focus correctly.
- [x] Mobile hamburger menu opens/closes, supports Escape, and exposes `aria-expanded`.
- [x] Missing prices show "Price coming soon"; missing/broken images fall back to a labeled placeholder.
- [x] No contact details, social links, or prices are shown unless configured in `js/config.js` or `data/menu.json`.
- [x] Layout checked at 375px, 768px, 1024px, and 1440px widths.
- [x] No build step, backend, or external API is required.

## Notes

All branding, menu details, prices, and contact information in this version are **temporary placeholders** meant to be replaced once the real restaurant information is available.
