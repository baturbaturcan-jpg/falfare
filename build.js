const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, 'content');
const templatesDir = path.join(__dirname, 'templates');
const distDir = path.join(__dirname, 'dist');

const settings = JSON.parse(fs.readFileSync(path.join(contentDir, 'settings.json'), 'utf8'));
const cards = JSON.parse(fs.readFileSync(path.join(contentDir, 'cards.json'), 'utf8'));
const ui = JSON.parse(fs.readFileSync(path.join(contentDir, 'ui.json'), 'utf8'));
const layout = fs.readFileSync(path.join(templatesDir, 'layout.html'), 'utf8');

['tr', 'en'].forEach(lang => {
    const langDist = path.join(distDir, lang);
    if (!fs.existsSync(langDist)) {
        fs.mkdirSync(langDist, { recursive: true });
    }

    let cardsHtml = cards.map(c => `
        <div class="card-item">
            <h3>${c.name[lang]}</h3>
            <div class="tags">
                ${c.keywords[lang].map(k => `<span class="tag">${k}</span>`).join('')}
            </div>
            <p>${c.description[lang]}</p>
        </div>
    `).join('');

    let indexBody = lang === 'tr' ? `
        <div class="hero">
            <h2>${settings.tagline.tr}</h2>
            <p>Modern, hızlı ve bağımsız Falfare Tarot platformu.</p>
        </div>
        <div class="card-grid">${cardsHtml}</div>
    ` : `
        <div class="hero">
            <h2>${settings.tagline.en}</h2>
            <p>Modern, fast, and independent Falfare Tarot platform.</p>
        </div>
        <div class="card-grid">${cardsHtml}</div>
    `;

    let pageHtml = layout
        .replace('{{lang}}', lang)
        .replace('{{site_title}}', settings.site_title[lang])
        .replace('{{nav_home}}', settings.nav.home[lang])
        .replace('{{nav_reading}}', settings.nav.reading[lang])
        .replace('{{content}}', indexBody);

    fs.writeFileSync(path.join(langDist, 'index.html'), pageHtml);
    console.log(`Generated: dist/${lang}/index.html`);
});