# Kei Designs

A static portfolio with a homepage and eight directly accessible project pages. All eight projects, About text, project paragraphs and captions were preserved from the supplied website. The updated identity is “Keira Haugh — Graphic Designer” and the headline is “Ideas into form.”

## Preview

Open index.html directly, or run the following from the folder containing index.html:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

On Windows you can use `py` instead of `python`. Open http://127.0.0.1:8000/ and stop the server with Ctrl+C.

## Edit and rebuild

All reusable content is in **portfolio.json**. Change `brand` once to update the wordmark, footer, titles and sharing metadata. The `identity`, `headline`, `headlineEmphasis`, `intro`, `about`, `skills`, `opportunities` and `interests` fields control their corresponding text.

Set `email` to a public address and `linkedin` to the complete public profile URL. Optional `behance` and `instagram` links appear when populated. Add a portrait or CV to assets/ and set `portrait`, `portraitAlt` or `cv` to its relative path. Only configure paths to real files.

After an edit, run this command from this folder:

```sh
node tools/build.mjs
```

Node.js is required for rebuilding, with no package installation. The generated HTML is included and ready to upload. Upload the regenerated pages together with the changed source or images. GitHub Pages serves these static files.

The palette, responsive layout and entrance animation are in **assets/styles/site.css**. **assets/motion.js** adds optional reveals and the header transition. Essential content is visible without JavaScript. Reduced-motion preferences disable the animations.

## Images and projects

Put images in assets/projects/ using lowercase hyphenated filenames. Preserve original artwork colour and use reasonably sized WebP or JPEG exports.

Each object in the `projects` array has a unique lowercase hyphenated `slug`, title, description, discipline, classification, brief, role, process, design decisions and outcome. `image` is a path relative to the site root and `alt` describes the artwork. Each `gallery` object has an image path, alt text and optional caption.

Duplicate a project object to add a project and reorder the array to change the gallery and next-project sequence. Rebuild. Remove obsolete HTML files if a slug is deleted or renamed. Preserve slugs where you want existing URLs to continue working.

Image dimensions are in assets/image-sizes.json. If adding or replacing an image, update its entry with its actual width and height in pixels, for example:

```json
"assets/projects/my-image.webp": [1600, 1000]
```

The generator uses these dimensions to reserve space while images load. CSS limits image width for each viewport. The homepage crops the first wide feature for composition. Its project page provides the complete artwork and a full-image link.

## Publish free on GitHub Pages

1. Create a public repository. For a user site, use USERNAME.github.io as the repository name. A project repository can have a name such as kei-designs.
2. Upload **the contents of this folder** to the **main** branch. index.html, .nojekyll, assets/ and projects/ should appear at the repository root. Include portfolio.json, tools/ and this README for future editing.
3. Open **Settings → Pages → Deploy from a branch**. Select **main** and **/(root)**, then save.
4. Once GitHub gives you a public URL, put it in `siteUrl`. Include the repository segment for a project site, for example `https://USERNAME.github.io/kei-designs/`. Rebuild, commit and upload the generated pages.
5. Open the live homepage, open a project directly and refresh it.

GitHub instructions are available at https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site.

## Sharing metadata

Every page includes a title, description and Open Graph tags. The preview at assets/share.jpg is a 1200 × 630 Hawksans specimen image. The generator makes canonical, og:url and og:image URLs absolute when `siteUrl` is populated. Before deployment the preview path is relative and canonical URLs are omitted.

To replace the social preview, replace assets/share.jpg and update its alt description in tools/build.mjs. Check the final public URL in LinkedIn's Post Inspector after deployment.

## Verification and remaining content

The completed build passed browser checks at 320, 390, 768, 1024 and 1440 pixels for the homepage and eight project pages at both a site root and a simulated repository prefix. Direct loads, refreshes, local links, asset requests and image decoding passed. Keyboard navigation, reduced-motion behaviour and JavaScript-disabled project navigation passed. Source JSON and rendered paragraphs/captions were compared against the original, allowing only the requested identity and headline changes.

The public GitHub deployment and LinkedIn preview require your repository and final URL. The portrait and CV are optional. Bracketed case-study fields for 18 Grams and Fleeting Moments remain ready for your content.
