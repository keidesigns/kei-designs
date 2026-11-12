import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const settings = JSON.parse(fs.readFileSync(path.join(root, 'portfolio.json'), 'utf8'));
const sizes = JSON.parse(fs.readFileSync(path.join(root, 'assets/image-sizes.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));
const brand = escape(settings.brand);
const intro = settings.intro.replaceAll('{brand}', settings.brand);
const base = settings.siteUrl ? new URL(settings.siteUrl.replace(/\/+$/, '') + '/') : null;
const arrow = '<span class="arrow" aria-hidden="true">↗</span>';
const wordmark = `<span class="brand-name">${brand}</span><span class="brand-dot" aria-hidden="true">.</span>`;
const social = (label, href) => href ? `<a class="line-link" href="${escape(href)}">${label} ${arrow}</a>` : '';
const linkedin = social('LinkedIn', settings.linkedin);
const email = settings.email ? `<a class="button" href="mailto:${escape(settings.email)}">Email me ${arrow}</a>` : '<span>[PUBLIC CONTACT EMAIL]</span>';
function image(src, alt, eager = false) {
  const dimensions = sizes[src.replace(/^\.\.\//, '')];
  return `<img src="${escape(src)}" alt="${escape(alt)}" ${dimensions ? `width="${dimensions[0]}" height="${dimensions[1]}"` : ''} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}
const projectLink = project => 'projects/' + project.slug + '.html';
function page(file, title, description, content) {
  const prefix = file.includes('/') ? '../' : '';
  const home = prefix + 'index.html';
  const nav = [['Work','work'],['About','about'],['Contact','contact']]
    .map(([label,id]) => `<a href="${home}#${id}">${label}</a>`).join('');
  const canonical = base ? new URL(file === 'index.html' ? '' : file, base).href : '';
  const share = base ? new URL('assets/share.jpg', base).href : prefix + 'assets/share.jpg';
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(title)} | ${brand}</title><meta name="description" content="${escape(description)}">
<meta name="color-scheme" content="dark">
<meta property="og:type" content="website"><meta property="og:site_name" content="${brand}">
<meta property="og:title" content="${escape(title)} | ${brand}"><meta property="og:description" content="${escape(description)}">
<meta property="og:image" content="${escape(share)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Hawksans modular type specimen in black, burgundy and white">
${canonical ? `<link rel="canonical" href="${escape(canonical)}"><meta property="og:url" content="${escape(canonical)}">` : ''}
<link rel="icon" href="${prefix}assets/favicon.svg">
<link rel="stylesheet" href="${prefix}assets/styles/site.css?v=dark-20261111">
<script src="${prefix}assets/motion.js" defer></script>
</head><body>
<a class="skip" href="#main">Skip to content</a>
<header class="mast"><div class="shell mast-inner"><a class="brand" href="${home}">${wordmark}</a><nav aria-label="Main navigation">${nav}</nav></div></header>
<main id="main" tabindex="-1">${content}</main>
<footer class="footer"><div class="shell footer-top"><div><a class="brand" href="${home}">${wordmark}</a><p class="muted">${escape(settings.identity)}</p></div>
<nav aria-label="Footer navigation">${nav}</nav><div class="footer-contact">${settings.email ? `<a href="mailto:${escape(settings.email)}">${escape(settings.email)}</a>` : ''}${linkedin}</div></div>
<div class="shell footer-bottom"><small>© ${new Date().getFullYear()} ${brand}</small><a href="#main">Back to top ↑</a></div></footer>
</body></html>`;
}
function card(project, index) {
  return `<article class="project project-${project.slug} reveal"><a class="project-link" href="${projectLink(project)}">
<div class="project-image">${image(project.image, project.alt, index === 0)}</div>
<div class="project-heading"><div><p class="eyebrow">${escape(project.discipline)} · ${escape(project.type)}</p><h3>${escape(project.title)}</h3></div>${arrow}</div></a>
<p class="project-description">${escape(project.description)}</p></article>`;
}
const homepage = `
<section class="shell hero"><p class="eyebrow identity">${escape(settings.identity)}</p>
<h1>${escape(settings.headline)} <em>${escape(settings.headlineEmphasis)}</em></h1>
<div class="hero-bottom"><a class="work-link" href="#work">View my work <span aria-hidden="true">↓</span></a><div class="hero-intro"><p>${escape(intro)}</p><a class="line-link" href="#contact">Get in touch ${arrow}</a></div></div></section>
<section class="shell work" id="work"><div class="section-heading"><h2>Selected <em>work</em></h2><span class="eyebrow">${String(settings.projects.length).padStart(2,'0')} projects</span></div>
<div class="project-grid">${settings.projects.map(card).join('')}</div></section>
<section class="about-section" id="about"><div class="shell about">
<div class="portrait reveal">${settings.portrait ? image(settings.portrait,settings.portraitAlt) : '<span class="initials" aria-hidden="true">Kh</span><span class="eyebrow">[PORTRAIT]</span>'}</div>
<div class="about-copy reveal"><p class="eyebrow">About me</p><h2>Keira <em>Haugh</em></h2><p class="focus">${escape(settings.identity)}</p><p>${escape(settings.about)}</p>
<div class="about-details"><div><h3>Skills &amp; tools</h3><p>${escape(settings.skills)}</p></div><div><h3>Opportunities</h3><p>${escape(settings.opportunities)}</p></div></div>
<div class="social-links">${linkedin}${settings.cv ? `<a class="line-link" href="${escape(settings.cv)}" download>Download CV ↓</a>` : ''}</div></div></div></section>
<section class="shell inspiration reveal" id="inspiration"><div><p class="eyebrow">Inspiration</p><h2>Outside the <em>studio</em></h2></div><div><h3>Interests &amp; influences</h3><p>${escape(settings.interests)}</p></div></section>
<section class="contact" id="contact"><div class="shell contact-inner"><div><p class="eyebrow">Contact</p><h2>Get in <em>touch.</em></h2></div><div><p>Have a project in mind, an opportunity to share, or an idea for a collaboration? I’d love to hear from you.</p>
${settings.email ? `<a class="address" href="mailto:${escape(settings.email)}">${escape(settings.email)}</a>` : ''}<div class="social-links">${email}${linkedin}${social('Behance',settings.behance)}${social('Instagram',settings.instagram)}</div></div></div></section>`;
fs.writeFileSync(path.join(root, 'index.html'), page('index.html',settings.identity,intro,homepage));
for (const [index, project] of settings.projects.entries()) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) throw new Error('Invalid project slug');
  const next = settings.projects[(index + 1) % settings.projects.length];
  const detail = (heading, value) => `<section class="study-detail reveal"><h2>${heading}</h2><p>${escape(value)}</p></section>`;
  const gallery = project.gallery.map((item, i) => `<figure class="gallery-item reveal">
<a href="../${escape(item.image)}" aria-label="View full image: ${escape(item.alt)}">${image('../'+item.image,item.alt)}</a><figcaption>${escape(item.caption || item.alt)}</figcaption></figure>`).join('');
  const content = `<article class="shell study"><a class="line-link back" href="../index.html#work">← Selected work</a>
<header class="study-heading"><p class="eyebrow">${escape(project.type)} · ${escape(project.discipline)}</p><h1>${escape(project.title)}</h1><p class="lead">${escape(project.description)}</p></header>
<figure class="study-cover"><a href="../${escape(project.image)}" aria-label="View full artwork: ${escape(project.alt)}">${image('../'+project.image,project.alt,true)}</a><figcaption>Final design · ${escape(project.discipline)}</figcaption></figure>
<div class="study-details">${detail('Project brief',project.brief)}${detail('My role',project.role)}${detail('Process &amp; sketches',project.process)}${detail('Design decisions',project.decisions)}${detail('Outcome',project.outcome)}</div>
${gallery ? `<section class="gallery"><h2>Design details</h2><div class="gallery-grid">${gallery}</div></section>` : ''}
<nav class="next" aria-label="Project navigation"><a href="../index.html#work">← All work</a><a href="${next.slug}.html">Next project · ${escape(next.title)} →</a></nav></article>`;
  fs.writeFileSync(path.join(root,projectLink(project)), page(projectLink(project),project.title,project.description,content));
}