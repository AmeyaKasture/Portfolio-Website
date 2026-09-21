/**
 * Sample test suite for the portfolio website.
 * Runs with Node.js built-in modules — no external dependencies required.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function readFile(relativePath) {
    return fs.readFileSync(path.join(ROOT, relativePath), 'utf-8');
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
}

function test(name, fn) {
    try {
        fn();
        console.log(`  PASS: ${name}`);
    } catch (error) {
        console.error(`  FAIL: ${name}`);
        console.error(`    ${error.message}`);
        process.exitCode = 1;
    }
}

console.log('Running portfolio tests...\n');

test('index.html exists and contains key content', () => {
    const html = readFile('index.html');
    assert(html.includes('<title>'), 'title tag missing');
    assert(html.includes('Ameya Kasture'), 'name missing');
    assert(html.includes('Systems Engineer') || html.includes('Software Developer'), 'role missing');
});

test('all external profile links are present', () => {
    const html = readFile('index.html');
    assert(html.includes('https://www.linkedin.com/in/ameya-kasture-417189244/'), 'LinkedIn link missing');
    assert(html.includes('https://github.com/AmeyaKasture'), 'GitHub link missing');
    assert(html.includes('https://www.agent-assists.com/'), 'blog link missing');
});

test('company names appear on the page', () => {
    const html = readFile('index.html');
    assert(html.includes('PayPal'), 'PayPal mention missing');
    assert(html.includes('Arista Networks'), 'Arista Networks mention missing');
    assert(html.includes('Yugabyte'), 'Yugabyte mention missing');
    assert(html.includes('BITS Pilani'), 'BITS Pilani mention missing');
});

test('current role at Yugabyte is highlighted', () => {
    const html = readFile('index.html');
    assert(html.includes('Present'), 'current period missing');
    assert(html.includes('company--current'), 'current company badge missing');
    assert(html.includes('company__badge'), 'company badge element missing');
});

test('experience section is detailed and consolidated', () => {
    const html = readFile('index.html');
    assert(!html.includes("Where I've been"), 'duplicate "Where I\'ve been" section should be removed');
    assert(!html.includes('about__roles'), 'about roles grid should be removed');

    const timelineItems = (html.match(/class="timeline__item/g) || []).length;
    assert(timelineItems >= 4, `expected at least 4 experience entries, found ${timelineItems}`);

    assert(html.includes('database migration team'), 'Yugabyte detail missing');
    assert(html.includes('radsecproxy'), 'Arista detail missing');
    assert(html.includes('ML model interpretability'), 'PayPal detail missing');
    assert(html.includes('Couture.ai'), 'Couture.ai detail missing');
    assert(html.includes('timeline__highlights'), 'highlight tags missing');
});

test('about section contains full bio content', () => {
    const html = readFile('index.html');
    assert(html.includes("Hi, I'm Ameya"), 'intro missing');
    assert(html.includes('create structure out of chaos'), 'manifesto missing');
    assert(html.includes('systems engineer'), 'systems engineer framing missing');
    assert(html.includes('Arista Networks'), 'Arista Networks mention missing');
    assert(html.includes('PayPal'), 'PayPal mention missing');
    assert(html.includes('Couture.ai'), 'Couture.ai mention missing');
    assert(html.includes('BITS Pilani'), 'BITS Pilani mention missing');
    assert(html.includes('9.32 CG'), 'CGPA missing');
    assert(!html.includes('More about me'), '"More about me" link should be removed');
});

test('hero introduction does not mention Yugabyte or Voyager', () => {
    const html = readFile('index.html');
    const heroMatch = html.match(/<div class="hero__content[^"]*">([\s\S]*?)<\/div>/);
    assert(heroMatch, 'hero content not found');
    const heroContent = heroMatch[0];
    assert(!heroContent.includes('Yugabyte'), 'hero should not mention Yugabyte');
    assert(!heroContent.includes('Voyager'), 'hero should not mention Voyager');
});

test('scroll reveal animations are configured', () => {
    const css = readFile('css/styles.css');
    const js = readFile('js/main.js');
    assert(css.includes('.reveal'), 'reveal CSS class missing');
    assert(css.includes('.reveal.is-visible'), 'reveal visible state missing');
    assert(js.includes('initRevealAnimations'), 'reveal initialiser missing');
    assert(js.includes('IntersectionObserver'), 'IntersectionObserver usage missing');
});

test('all required sections exist', () => {
    const html = readFile('index.html');
    const requiredSections = ['home', 'about', 'experience', 'skills', 'blog'];
    requiredSections.forEach((id) => {
        assert(html.includes(`id="${id}"`), `section #${id} missing`);
    });
});

test('stylesheet and script references are correct', () => {
    const html = readFile('index.html');
    assert(html.includes('css/styles.css'), 'stylesheet link missing');
    assert(html.includes('js/main.js'), 'script link missing');
    assert(fs.existsSync(path.join(ROOT, 'css', 'styles.css')), 'styles.css file missing');
    assert(fs.existsSync(path.join(ROOT, 'js', 'main.js')), 'main.js file missing');
});

test('CSS defines expected design tokens', () => {
    const css = readFile('css/styles.css');
    assert(css.includes('--color-bg:'), 'background token missing');
    assert(css.includes('--color-accent:'), 'accent token missing');
    assert(css.includes('@media (max-width: 768px)'), 'mobile breakpoint missing');
});

test('JavaScript contains expected helpers', () => {
    const js = readFile('js/main.js');
    assert(js.includes('updateYear'), 'updateYear helper missing');
    assert(js.includes('initSkillsSlider'), 'skills slider initialiser missing');
    assert(js.includes('animateStats'), 'stats animation helper missing');
    assert(js.includes('renderBlogPosts'), 'blog renderer missing');
});

test('blog data file exists and contains expected posts', () => {
    assert(fs.existsSync(path.join(ROOT, 'js', 'blog-data.js')), 'blog-data.js file missing');
    const blogData = require(path.join(ROOT, 'js', 'blog-data.js'));
    assert(Array.isArray(blogData), 'blog data is not an array');
    assert(blogData.length >= 5, 'expected at least 5 blog posts');

    const expectedTitles = [
        'High-Performance Problem Solving',
        'Making Claude Code Powerful',
        'The Hidden Quirks of PostgreSQL',
        'Beyond pg_dump',
        'PostgreSQL Under the Hood'
    ];

    expectedTitles.forEach((snippet) => {
        const found = blogData.some((post) => post.title && post.title.includes(snippet));
        assert(found, `expected blog post containing "${snippet}"`);
    });

    blogData.forEach((post) => {
        assert(post.title && typeof post.title === 'string', 'post title missing');
        assert(post.date && typeof post.date === 'string', 'post date missing');
        assert(post.url && post.url.startsWith('https://www.agent-assists.com/'), 'post URL invalid');
        assert(post.excerpt && typeof post.excerpt === 'string', 'post excerpt missing');
        assert(post.image && typeof post.image === 'string', 'post image missing');
    });
});

test('profile image placeholder exists', () => {
    assert(fs.existsSync(path.join(ROOT, 'images', 'profile.svg')), 'profile placeholder missing');
});

test('favicon exists and is referenced', () => {
    const html = readFile('index.html');
    assert(fs.existsSync(path.join(ROOT, 'favicon.svg')), 'favicon.svg missing');
    assert(html.includes('favicon.svg'), 'favicon link missing');
});

test('SEO metadata is present', () => {
    const html = readFile('index.html');
    assert(html.includes('<title>'), 'title tag missing');
    assert(html.includes('name="description"'), 'meta description missing');
    assert(html.includes('name="keywords"'), 'meta keywords missing');
    assert(html.includes('name="author"'), 'meta author missing');
    assert(html.includes('name="robots"'), 'meta robots missing');
    assert(html.includes('rel="canonical"'), 'canonical link missing');
    assert(html.includes('property="og:title"'), 'Open Graph title missing');
    assert(html.includes('property="og:description"'), 'Open Graph description missing');
    assert(html.includes('name="twitter:card"'), 'Twitter card missing');
    assert(html.includes('application/ld+json'), 'JSON-LD structured data missing');
});

test('sitemap.xml and robots.txt exist', () => {
    assert(fs.existsSync(path.join(ROOT, 'sitemap.xml')), 'sitemap.xml missing');
    assert(fs.existsSync(path.join(ROOT, 'robots.txt')), 'robots.txt missing');

    const sitemap = readFile('sitemap.xml');
    assert(sitemap.includes('<loc>https://ameyakasture.github.io/Portfolio-Website/</loc>'), 'sitemap URL missing');

    const robots = readFile('robots.txt');
    assert(robots.includes('Sitemap:'), 'robots sitemap reference missing');
    assert(robots.includes('Allow: /'), 'robots allow rule missing');
});

console.log('\nTest run complete.');
