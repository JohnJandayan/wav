import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { portfolioData as d } from '../src/data/portfolioData';
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
});
test('all seven sections, navigation, metadata and production assets', async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page).toHaveTitle(d.meta.title);
  await expect(page.locator('#home .ethos-pill')).toHaveCount(0);
  for (const section of d.sections) {
    await expect(page.locator(`section#${section.id}`)).toBeAttached();
    await page
      .getByRole('navigation')
      .getByRole('link', { name: section.label, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`#${section.id}$`));
    await expect(
      page.getByRole('navigation').getByRole('link', { name: section.label, exact: true }),
    ).toHaveAttribute('aria-current', 'location');
  }
  expect((await request.get('/_redirects')).status()).toBe(200);
  expect(await (await request.get('/_redirects')).text()).toBe('/* /index.html 200\n');
  await page.goto('/');
  await page.screenshot({ path: 'test-results/desktop.png', fullPage: true });
});
for (const width of [320, 360, 390, 768, 1024, 1440]) {
  test(`layout fits at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    if (width < 961) {
      await page.getByRole('button', { name: d.nav.menu }).click();
      await page
        .getByRole('navigation')
        .getByRole('link', { name: 'Projects', exact: true })
        .click();
      await expect(page.locator('#projects')).toBeFocused();
      await expect(page.getByRole('button', { name: d.nav.menu })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    }
    if (width === 390) {
      await page.goto('/');
      await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
    }
  });
}
test('filters retain focus and illustrative chart has a table', async ({ page }) => {
  await page.locator('#projects').scrollIntoViewIfNeeded();
  const filters = page.locator('.project-filters');
  for (const [filter, count] of [
    ['Marketing & SEO', 2],
    ['Audio & Branding', 1],
    ['Operations', 1],
    ['All', 4],
  ] as const) {
    const button = filters.getByRole('button', { name: filter, exact: true });
    await button.click();
    await expect(page.locator('.project-grid article')).toHaveCount(count);
    await expect(button).toBeFocused();
  }
  const chart = page.locator('.project-marketing .campaign-chart');
  await chart.getByText(d.previews.marketing.table, { exact: true }).click();
  await expect(chart.getByRole('table')).toBeVisible();
  await expect(chart.getByRole('row')).toHaveCount(7);
});
test('credential modal contains focus, closes on Escape, restores trigger', async ({ page }) => {
  for (const credential of d.credentials) {
    const trigger = page.getByRole('button', {
      name: `${d.vault.view}: ${credential.title}`,
      exact: true,
    });
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    if (credential.image) {
      await expect(dialog.getByRole('img')).toBeVisible();
      await expect(dialog.getByRole('link', { name: d.vault.openPdf })).toHaveAttribute(
        'href',
        credential.document!,
      );
    } else {
      await expect(dialog.getByText(d.vault.missingTitle)).toBeVisible();
    }
    await expect(dialog.getByRole('button', { name: d.vault.close })).toBeFocused();
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
});
test('real track playback, motion preference and academic disclosure', async ({ page }) => {
  await page.locator('.audio-orb').click();
  await expect(page.locator('.audio-orb')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.audio-mini')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await expect(page.locator('.horizon').first()).toHaveCSS('animation-name', 'none');
  await page.getByText(d.footer.academicToggle, { exact: true }).click();
  for (const item of d.footer.academic)
    await expect(page.locator('.academic').getByText(item.value, { exact: true })).toBeVisible();
});
test('contact validation and long draft keep input without any submission request', async ({
  page,
}) => {
  const posts: string[] = [];
  page.on('request', (request) => {
    if (request.method() === 'POST') posts.push(request.url());
  });
  await page.getByRole('button', { name: d.contact.submit }).click();
  await expect(page.locator('#inquiry-name')).toBeFocused();
  await page.locator('#inquiry-name').fill('Browser Test');
  await page.locator('#inquiry-email').fill('test@example.com');
  await page.locator('#inquiry-message').fill('A'.repeat(2400));
  await page.getByRole('button', { name: d.contact.submit }).click();
  await expect(page.getByText(d.contact.longDraft)).toBeVisible();
  await expect(page.locator('#inquiry-message')).toHaveValue('A'.repeat(2400));
  await expect(page.locator('#draft-text')).toContainText('Browser Test');
  expect(posts).toEqual([]);
});
test('clipboard success and denial have truthful feedback', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: d.contact.copy, exact: true }).click();
  await expect(page.getByText(d.contact.copied, { exact: true })).toBeInViewport();
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error('Denied');
        },
      },
    }),
  );
  await page.getByRole('button', { name: d.contact.copy, exact: true }).click();
  await expect(page.getByText(d.contact.copyFailed, { exact: true })).toBeVisible();
});
test('keyboard skip link, accessible page and no application console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByText(d.nav.skip, { exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
  expect(errors).toEqual([]);
});
test('font request failure preserves responsive layout', async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
  await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test('motion can be paused and fine-pointer tilts reset', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
  const tilt = page.locator('.dock-audio');
  await tilt.scrollIntoViewIfNeeded();
  const box = await tilt.boundingBox();
  if (!box) throw new Error('Dock card has no bounds');
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.2);
  await expect
    .poll(() => tilt.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe('none');
  await page.mouse.move(0, 0);
  await expect
    .poll(() => tilt.evaluate((element) => getComputedStyle(element).transform))
    .toBe('none');
  await page.getByRole('button', { name: d.ui.pauseMotion, exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await expect(page.locator('.horizon').first()).toHaveCSS('animation-name', 'none');
  await page.getByRole('button', { name: d.ui.resumeMotion, exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
});

test('mobile page and credential modal pass automated accessibility checks', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(result.violations).toEqual([]);
  await page.locator('.credential-card').first().click();
  const dialogResult = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(dialogResult.violations).toEqual([]);
});

test('mobile copy feedback stays in view and dismissing restores focus', async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const trigger = page.getByRole('button', { name: d.contact.copy, exact: true });
  await trigger.click();
  await expect(page.getByText(d.contact.copied, { exact: true })).toBeInViewport();
  await page.getByRole('button', { name: d.ui.close, exact: true }).click();
  await expect(page.getByText(d.contact.copied, { exact: true })).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

for (const width of [390, 768, 1440, 1711]) {
  test(`nav headings land close to the navbar at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => document.fonts.ready);
    for (const section of d.sections.filter((section) => section.id !== 'home')) {
      if (width < 961) await page.getByRole('button', { name: d.nav.menu }).click();
      await page
        .getByRole('navigation')
        .getByRole('link', { name: section.label, exact: true })
        .click();
      await expect(page).toHaveURL(new RegExp(`#${section.id}$`));
      const gap = await page.evaluate((id) => {
        const heading = document.querySelector(`#${id} .section-heading`)!;
        const nav = document.querySelector('.nav-bar')!;
        return heading.getBoundingClientRect().top - nav.getBoundingClientRect().bottom;
      }, section.id);
      expect(gap).toBeGreaterThanOrEqual(14);
      expect(gap).toBeLessThanOrEqual(24);
    }
    if (width === 1711) {
      await page.getByRole('navigation').getByRole('link', { name: 'About', exact: true }).click();
      await page.screenshot({ path: 'test-results/about-nav-desktop.png' });
    }
  });
}

test('supplied portrait, certificate image and original PDF load', async ({ page, request }) => {
  await page.locator('#about').scrollIntoViewIfNeeded();
  const portrait = page.locator('.portrait-large img');
  await expect(portrait).toHaveAttribute('src', '/images/profile.webp');
  await expect
    .poll(() => portrait.evaluate((image) => (image as HTMLImageElement).naturalWidth))
    .toBe(900);
  const trigger = page.locator('.credential-card').first();
  await trigger.click();
  const dialog = page.getByRole('dialog');
  const image = dialog.getByRole('img');
  await expect
    .poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth))
    .toBe(1684);
  await expect(dialog.getByText('November 10, 2026', { exact: true })).toBeVisible();
  await expect(dialog.getByText('8dcee9', { exact: true })).toBeVisible();
  const pdf = await request.get('/certificates/marketing-with-canva.pdf');
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()['content-type']).toContain('application/pdf');
  expect((await pdf.body()).subarray(0, 5).toString()).toBe('%PDF-');
});

test('the real song plays, seeks, and stays synchronized between controls', async ({ page }) => {
  const audio = page.locator('audio');
  await expect(audio).toHaveAttribute('src', '/audio/pr6ve.mp3');
  expect(await audio.evaluate((element) => (element as HTMLAudioElement).paused)).toBe(true);
  await page.locator('.audio-orb').click();
  await expect
    .poll(() => audio.evaluate((element) => (element as HTMLAudioElement).currentTime))
    .toBeGreaterThan(0.1);
  const duration = await audio.evaluate((element) => (element as HTMLAudioElement).duration);
  expect(duration).toBeGreaterThan(83);
  expect(duration).toBeLessThan(85);
  await expect(page.locator('.audio-mini')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.audio-mini').click();
  await expect
    .poll(() => audio.evaluate((element) => (element as HTMLAudioElement).paused))
    .toBe(true);
  const slider = page.locator('.dock-audio').getByRole('slider', { name: d.audio.seek });
  await slider.fill('20');
  expect(await audio.evaluate((element) => (element as HTMLAudioElement).currentTime)).toBeCloseTo(
    20,
    0,
  );
  await expect(
    page.locator('.project-audio').getByRole('slider', { name: d.audio.seek }),
  ).toHaveValue('20');
});
