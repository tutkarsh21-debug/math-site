# Math site (Next.js 14, App Router)

    npm install
    npm run dev        # http://localhost:3000
    npm run build && npm start

1. Edit `lib/data.js`: brand name, Telegram/YouTube links, chapters.
2. Add a chapter = add an object to `CLASSES`. Page, SEO title, sitemap and prev/next links are generated.
3. Paste the YouTube video ID in `youtube` to show the video.
4. Set `NEXT_PUBLIC_SITE_URL` to your domain before deploying (Vercel is free and easiest).
5. Replace the TODO text in `app/about/page.js`.

## Deploy to Cloudflare Workers
    npx wrangler login
    npm run preview    # test locally on the Workers runtime
    npm run deploy     # live at https://math-site.<your-subdomain>.workers.dev
Set NEXT_PUBLIC_SITE_URL in Cloudflare (Settings > Variables) AND before building, since it is read at build time.

## Chapter PDFs (short notes, formula bank, DPP sheet)
Each chapter page has three tabs, and each tab shows a PDF from `public/pdf/<class>/<chapter>/`.
The PDFs are made from the text files in `notes-pdf/content/`:

    cd notes-pdf
    npm install        # once
    node build.mjs     # all chapters, or: node build.mjs class-10/real-numbers

This needs Chrome or Edge on the computer. It also rewrites `lib/pdfs.json`, the list the site uses to
know which chapters have PDFs. Commit the new PDFs and `lib/pdfs.json` together.
