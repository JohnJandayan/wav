import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./data/portfolioData', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./data/portfolioData')>();
  return {
    ...actual,
    PROFILE_IMAGE_URL: '/test-profile.webp',
    AUDIO_REEL_URL: '/test-reel.mp3',
    portfolioData: {
      ...actual.portfolioData,
      credentials: actual.portfolioData.credentials.map((credential) => ({
        ...credential,
        image: '/test-certificate.webp',
        document: null,
      })),
    },
  };
});
import { portfolioData as d } from './data/portfolioData';
import { Portrait } from './components/Portrait';
import { Certificates } from './sections/Certificates';
import { AudioControl, AudioTimeline } from './components/AudioControl';
import { ExperienceProvider } from './hooks/Experience';

describe('configured media states', () => {
  it('reserves portrait dimensions and reveals a loaded image', () => {
    render(<Portrait large />);
    const image = screen.getByRole('img', { name: d.identity.portraitAlt });
    expect(image).toHaveAttribute('width', '400');
    expect(image).toHaveStyle({ opacity: 0 });
    fireEvent.load(image);
    expect(image).toHaveStyle({ opacity: 1 });
  });
  it('replaces a failed portrait with the designed monogram', () => {
    render(<Portrait large />);
    fireEvent.error(screen.getByRole('img', { name: d.identity.portraitAlt }));
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByText(d.identity.initials)).toBeVisible();
    expect(screen.getByText(d.identity.portraitError)).toBeVisible();
  });
  it('shows a configured credential image and handles a failed scan', async () => {
    const user = userEvent.setup();
    render(<Certificates />);
    await user.click(screen.getAllByRole('button')[0]!);
    const image = screen.getByRole('img');
    expect(screen.getByText(d.vault.loading)).toBeVisible();
    fireEvent.load(image);
    expect(screen.queryByText(d.vault.loading)).toBeNull();
    fireEvent.error(image);
    expect(screen.getByText(d.vault.failed)).toBeVisible();
    expect(screen.getByText(d.vault.missing)).toBeVisible();
  });
  it('requests playback only on action and follows native media events', async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
    const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
    const user = userEvent.setup();
    render(
      <ExperienceProvider>
        <AudioControl />
      </ExperienceProvider>,
    );
    expect(play).not.toHaveBeenCalled();
    const audio = document.querySelector('audio')!;
    expect(audio).toHaveAttribute('preload', 'none');
    await user.click(screen.getByRole('button', { name: d.audio.play }));
    expect(play).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: d.audio.loading })).toBeDisabled();
    fireEvent.playing(audio);
    expect(screen.getByRole('button', { name: d.audio.pause })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    Object.defineProperty(audio, 'paused', { configurable: true, value: false });
    await user.click(screen.getByRole('button', { name: d.audio.pause }));
    expect(pause).toHaveBeenCalledOnce();
    fireEvent.pause(audio);
    expect(screen.getByRole('button', { name: d.audio.play })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    fireEvent.ended(audio);
    expect(screen.getByText(d.audio.ended)).toBeVisible();
    fireEvent.error(audio);
    expect(screen.getByText(d.audio.failed)).toBeVisible();
  });
  it('reports a rejected audio play request instead of pretending to play', async () => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockRejectedValue(new Error('Unsupported audio'));
    const user = userEvent.setup();
    render(
      <ExperienceProvider>
        <AudioControl />
      </ExperienceProvider>,
    );
    await user.click(screen.getByRole('button', { name: d.audio.play }));
    expect(await screen.findByText(d.audio.failed)).toBeVisible();
    expect(screen.getByRole('button', { name: d.audio.play })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});

describe('shared track timing', () => {
  it('enables seeking after metadata and updates the shared clock', () => {
    render(
      <ExperienceProvider>
        <AudioTimeline />
      </ExperienceProvider>,
    );
    const audio = document.querySelector('audio')!;
    const slider = screen.getByRole('slider', { name: d.audio.seek });
    expect(slider).toBeDisabled();
    Object.defineProperty(audio, 'duration', { configurable: true, value: 84 });
    fireEvent.loadedMetadata(audio);
    expect(slider).toBeEnabled();
    expect(slider).toHaveAttribute('max', '84');
    fireEvent.change(slider, { target: { value: '21' } });
    expect(audio.currentTime).toBe(21);
    expect(screen.getByText('0:21 / 1:24')).toBeVisible();
    audio.currentTime = 36;
    fireEvent.timeUpdate(audio);
    expect(screen.getByText('0:36 / 1:24')).toBeVisible();
    Object.defineProperty(audio, 'duration', { configurable: true, value: Infinity });
    fireEvent.durationChange(audio);
    expect(slider).toBeDisabled();
  });
});
