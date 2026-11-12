import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
vi.mock('./data/portfolioData', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./data/portfolioData')>();
  return {
    ...actual,
    AUDIO_REEL_URL: null,
    portfolioData: {
      ...actual.portfolioData,
      credentials: actual.portfolioData.credentials.map((credential) => ({
        ...credential,
        image: null,
        document: null,
      })),
    },
  };
});
import { Projects } from './sections/Projects';
import { Certificates } from './sections/Certificates';
import { Contact } from './sections/Contact';
import { ExperienceProvider } from './hooks/Experience';
import { AudioControl } from './components/AudioControl';
import { portfolioData as d } from './data/portfolioData';
describe('portfolio interactions', () => {
  it('filters all four outputs without losing the filter', async () => {
    const user = userEvent.setup();
    render(
      <ExperienceProvider>
        <Projects />
      </ExperienceProvider>,
    );
    expect(screen.getAllByRole('article')).toHaveLength(4);
    await user.click(screen.getByRole('button', { name: 'Operations' }));
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Operations' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await user.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getAllByRole('article')).toHaveLength(4);
  });
  it('shows honest credential states and restores trigger focus', async () => {
    const user = userEvent.setup();
    render(<Certificates />);
    const trigger = screen.getByRole('button', {
      name: `${d.vault.view}: ${d.credentials[0]?.title}`,
    });
    await user.click(trigger);
    expect(screen.getByRole('dialog')).toBeVisible();
    expect(screen.getByText(d.vault.missingTitle)).toBeVisible();
    await user.click(screen.getByRole('button', { name: d.vault.close }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(trigger).toHaveFocus();
  });
  it('supports dialog cancel events', async () => {
    const user = userEvent.setup();
    render(<Certificates />);
    await user.click(screen.getAllByRole('button')[0]!);
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  it('synchronizes silent demo controls', async () => {
    const user = userEvent.setup();
    render(
      <ExperienceProvider>
        <AudioControl compact />
        <AudioControl orb />
      </ExperienceProvider>,
    );
    const controls = screen.getAllByRole('button', { name: d.audio.startDemo });
    await user.click(controls[0]!);
    expect(screen.getAllByRole('button', { name: d.audio.pauseDemo })).toHaveLength(2);
    expect(screen.getByText(d.audio.demoNote)).toBeVisible();
  });
  it('validates and focuses the first invalid contact field', async () => {
    const user = userEvent.setup();
    render(<Contact />);
    await user.click(screen.getByRole('button', { name: d.contact.submit }));
    expect(screen.getByLabelText(d.contact.name, { exact: true })).toHaveFocus();
    expect(screen.getByText(d.contact.errors.email)).toBeVisible();
  });
  it('offers a long-message draft without losing form content', async () => {
    const user = userEvent.setup();
    render(<Contact />);
    await user.type(screen.getByLabelText(d.contact.name, { exact: true }), 'Test Person');
    await user.type(screen.getByLabelText(d.contact.email, { exact: true }), 'person@example.com');
    fireEvent.change(screen.getByLabelText(d.contact.message, { exact: true }), {
      target: { value: 'A'.repeat(2400) },
    });
    await user.click(screen.getByRole('button', { name: d.contact.submit }));
    expect(screen.getByText(d.contact.longDraft)).toBeVisible();
    expect((screen.getByLabelText(d.contact.fallbackLabel) as HTMLTextAreaElement).value).toContain(
      'Test Person',
    );
    expect(screen.getByLabelText(d.contact.message, { exact: true })).toHaveValue('A'.repeat(2400));
  });
});
