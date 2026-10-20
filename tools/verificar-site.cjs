/* QA local: npm.cmd install --no-save --package-lock=false --prefix .qa playwright @axe-core/playwright
 * Sirva a raiz do projeto e execute: node tools/verificar-site.cjs
 * SITE_URL e BROWSER_PATH podem ajustar URL e executável do navegador. */
const { chromium } = require('../.qa/node_modules/playwright');
const { AxeBuilder } = require('../.qa/node_modules/@axe-core/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const base = process.env.SITE_URL || 'http://127.0.0.1:8000';
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const launch = { headless: true };
if (process.env.BROWSER_PATH) launch.executablePath = process.env.BROWSER_PATH;
else if (fs.existsSync(edge)) launch.executablePath = edge;

(async () => {
  const browser = await chromium.launch(launch);
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const broken = [];
  page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) broken.push(response.url()); });
  try {
    await page.goto(base, { waitUntil: 'networkidle' });
    // When available, compare the redesign against the original local snapshot.
    if (fs.existsSync(path.join(root, '.qa/original.html'))) {
      const original = await context.newPage();
      await original.goto(base + '/.qa/original.html');
      for (const selector of ['.svc h3', '.svc p', '.svc li', '.dl h3', '.dl p', '.steps h3', '.steps p', '.info h3', '.info p', '#sobre p', 'details summary', 'details p', '#especiais .list li', '#especiais .sp p']) {
        assert.deepEqual(await page.locator(selector).allTextContents(), await original.locator(selector).allTextContents(), `Preservação de ${selector}`);
      }
      const oldPartnership = await original.locator('section[aria-labelledby="emp-t"]').innerText();
      const newPartnership = await page.locator('#parcerias').innerText();
      assert.ok(newPartnership.includes(oldPartnership), 'Texto de parcerias preservado');
      assert.equal(await page.locator('script[type="application/ld+json"]').textContent(), await original.locator('script[type="application/ld+json"]').textContent());
      for (const selector of ['title', 'meta[name="description"]', 'meta[name="google-site-verification"]', 'link[rel="canonical"]', 'meta[property^="og:"]', 'meta[name^="twitter:"]']) {
        assert.deepEqual(await page.locator(selector).evaluateAll(nodes => nodes.map(n => n.outerHTML)), await original.locator(selector).evaluateAll(nodes => nodes.map(n => n.outerHTML)), `SEO preservado: ${selector}`);
      }
      assert.deepEqual(await page.locator('.pf').evaluateAll(nodes => nodes.map(n => ({ label: n.getAttribute('aria-label'), caption: n.querySelector('.pf-tag').textContent, image: n.querySelector('img').getAttribute('src') }))), await original.locator('.pf').evaluateAll(nodes => nodes.map(n => ({ label: n.getAttribute('aria-label'), caption: n.querySelector('.pf-tag').textContent, image: n.querySelector('img').getAttribute('src') }))), 'Todas as fotos, descrições e legendas originais');
      await original.close();
      console.log('PASS: comparação com original — serviços, diferenciais, etapas, condições, apresentação, FAQs, parcerias, galeria e SEO');
    }
    assert.equal(await page.locator('.svc').count(), 8, 'Oito serviços disponíveis');
    assert.equal(await page.locator('details').count(), 9, 'Nove FAQs disponíveis');
    assert.equal(await page.locator('.gallery .pf').count(), 10, 'Dez fotos originais disponíveis');
    assert.match(await page.locator('#gallery-count').innerText(), /10/, 'Leitor de tela recebe quantidade de fotos');
    for (const [filter, count] of [['Sancas e forros', 6], ['Drywall e estruturas', 4], ['Todos', 10]]) {
      await page.getByRole('button', { name: filter, exact: true }).click();
      assert.equal(await page.locator('.gallery .pf').count(), count);
      assert.equal(await page.getByRole('button', { name: filter, exact: true }).getAttribute('aria-pressed'), 'true');
      assert.match(await page.locator('#gallery-count').innerText(), new RegExp(String(count)));
    }
    const first = page.locator('.pf').first();
    await first.click();
    assert.equal(await page.locator('#lb').evaluate(el => el.open), true);
    assert.equal(await page.locator('#lb-n').innerText(), '1 de 10');
    for (let i = 0; i < 7; i++) {
      await page.keyboard.press('Tab');
      assert.equal(await page.locator('#lb').evaluate(el => el.contains(document.activeElement)), true, 'Foco permanece no diálogo');
    }
    await page.locator('.lb-x').focus();
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.locator('.lb-next').evaluate(el => el === document.activeElement), true, 'Shift+Tab volta ao último controle');
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#lb-n').innerText(), '2 de 10');
    await page.getByRole('button', { name: 'Foto anterior', exact: true }).click();
    assert.equal(await page.locator('#lb-n').innerText(), '1 de 10');
    await page.keyboard.press('ArrowLeft');
    assert.equal(await page.locator('#lb-n').innerText(), '10 de 10');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#lb').evaluate(el => el.open), false);
    assert.equal(await first.evaluate(el => el === document.activeElement), true, 'Foco retorna à foto');
    await page.getByRole('button', { name: 'Drywall e estruturas', exact: true }).click();
    await page.locator('.pf').first().click();
    assert.equal(await page.locator('#lb-n').innerText(), '1 de 4');
    await page.locator('.lb-next').click();
    assert.equal(await page.locator('#lb-n').innerText(), '2 de 4');
    await page.locator('.lb-x').click();
    await page.getByRole('button', { name: 'Todos', exact: true }).click();
    for (const detail of await page.locator('details').all()) {
      await detail.locator('summary').click();
      assert.equal(await detail.evaluate(el => el.open), true);
      assert.equal(await detail.locator('p').isVisible(), true);
      await detail.locator('summary').click();
    }
    // Intercept only the external opening. Exercise the real form and URL builder.
    await page.evaluate(() => { window.open = (...args) => { window.__opened = args; }; });
    await page.locator('#orc button').click();
    assert.equal(await page.locator('[aria-invalid=true]').count(), 5);
    assert.equal(await page.locator('[name=nome]').evaluate(el => el === document.activeElement), true);
    await page.locator('[name=nome]').fill('Ana & João');
    await page.locator('[name=tel]').fill('123');
    await page.locator('[name=local]').fill('São Paulo — Vila Mariana');
    await page.locator('[name=servico]').selectOption({ label: 'Sanca' });
    await page.locator('[name=desc]').fill('Sanca curva com iluminação\nReferência: 4 × 5 m');
    await page.locator('#orc button').click();
    assert.equal(await page.locator('[aria-invalid=true]').count(), 1);
    assert.match(await page.locator('#err').innerText(), /DDD/);
    assert.equal(await page.evaluate(() => window.__opened), undefined);
    await page.locator('[name=tel]').fill('(11) 91234-5678');
    await page.locator('[name=med]').fill('4 m × 5 m');
    await page.locator('#orc button').click();
    const args = await page.evaluate(() => window.__opened);
    const url = new URL(args[0]);
    assert.equal(url.origin + url.pathname, 'https://wa.me/5511915136969');
    assert.equal(args[2], 'noopener');
    assert.equal(url.searchParams.get('text'), 'Olá, Edilson! Meu nome é Ana & João. Gostaria de um orçamento.\nServiço: Sanca\nLocal da obra: São Paulo — Vila Mariana\nDescrição: Sanca curva com iluminação\nReferência: 4 × 5 m\nMedidas: 4 m × 5 m\nMeu contato: (11) 91234-5678\nVou enviar as fotos do local nesta conversa.');
    await page.locator('[name=med]').fill('');
    await page.locator('#orc button').click();
    assert.equal(await page.evaluate(() => new URL(window.__opened[0]).searchParams.get('text').includes('Medidas:')), false);
    for (const link of await page.locator('a.wa').all()) {
      const target = new URL(await link.getAttribute('href'));
      assert.equal(target.pathname, '/5511915136969');
      assert.ok(target.searchParams.get('text').length > 20);
    }
    assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll(links => links.filter(a => !document.getElementById(a.hash.slice(1))).map(a => a.hash)), [], 'Âncoras resolvidas');
    console.log('PASS: filtros, galeria, teclado, FAQs, validação, mensagem WhatsApp e navegação');
    fs.mkdirSync(path.join(root, '.qa'), { recursive: true });
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); }
        window.scrollTo(0, 0);
        await document.fonts.ready;
      });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Sem overflow em ${width}px`);
      assert.equal(await page.locator('.rv').first().evaluate(el => getComputedStyle(el).animationName), 'none', 'Movimento reduzido respeitado');
      assert.deepEqual(await page.locator('img[src]').evaluateAll(images => images.filter(img => !img.complete || !img.naturalWidth).map(img => img.src)), [], 'Imagens carregadas');
      if (width <= 980) {
        await page.locator('.burger').click();
        assert.equal(await page.locator('.burger').getAttribute('aria-label'), 'Fechar menu');
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('.burger').getAttribute('aria-expanded'), 'false');
        await page.locator('.burger').click();
        await page.locator('#menu a[href="#servicos"]').click();
        assert.equal(await page.locator('.burger').getAttribute('aria-expanded'), 'false');
        assert.equal(await page.evaluate(() => location.hash), '#servicos');
      }
      const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      assert.deepEqual(accessibility.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), [], `Acessibilidade em ${width}px`);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: path.join(root, `.qa/desktop-${width}.png`), fullPage: true });
      console.log(`PASS: ${width}px, imagens, menu, ausência de overflow, axe WCAG A/AA`);
    }
    assert.deepEqual(errors, [], 'Sem erros JavaScript');
    assert.deepEqual(broken, [], 'Sem recursos locais ausentes');
    await context.close();
    const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
    const fallback = await nojs.newPage();
    await fallback.goto(base);
    assert.equal(await fallback.locator('#menu').isVisible(), true);
    assert.equal(await fallback.locator('#servicos').isVisible(), true);
    assert.equal(await fallback.locator('noscript a').count(), 2);
    await nojs.close();
    console.log('PASS: conteúdo e navegação sem JavaScript; nenhum erro ou recurso local ausente');
    const touchContext = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
    const touchPage = await touchContext.newPage();
    await touchPage.goto(base, { waitUntil: 'networkidle' });
    await touchPage.waitForFunction(() => document.querySelector('#cnt').textContent === '25');
    await touchPage.locator('.pf').first().tap();
    const cdp = await touchContext.newCDPSession(touchPage);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 290, y: 350 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 160, y: 350 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    assert.equal(await touchPage.locator('#lb-n').innerText(), '2 de 10', 'Deslize avança foto');
    await touchPage.locator('.lb-x').tap();
    await touchPage.locator('.burger').tap();
    await touchPage.locator('#hero-title').tap();
    assert.equal(await touchPage.locator('.burger').getAttribute('aria-expanded'), 'false', 'Toque fora fecha menu');
    await touchPage.locator('.burger').tap();
    await touchPage.setViewportSize({ width: 1440, height: 900 });
    await touchPage.waitForFunction(() => document.querySelector('.burger').getAttribute('aria-expanded') === 'false');
    await touchContext.close();
    console.log('PASS: toque, deslize, contador, fechar menu ao tocar fora e ao mudar para desktop');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
