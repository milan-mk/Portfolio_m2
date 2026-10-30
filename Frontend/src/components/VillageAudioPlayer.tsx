import React, { useEffect, useState } from 'react';
import { villageAudio } from '../utils/soundEffects';

export const VillageAudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.35);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [sfxOn, setSfxOn] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = villageAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return () => unsubscribe();
  }, []);

  const handleToggle = () => {
    villageAudio.toggleMusic();
    villageAudio.playTap();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    villageAudio.setVolume(val);
  };

  const handleSfxToggle = () => {
    const next = villageAudio.toggleSfx();
    setSfxOn(next);
    if (next) villageAudio.playGold();
  };

  return (
    <div className="relative inline-flex items-center shrink-0">
      {/* Audio Button */}
      <button
        type="button"
        onClick={handleToggle}
        className={`relative inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg border font-label text-[11px] uppercase tracking-wider font-bold transition-all cursor-pointer select-none active:scale-95 ${
          isPlaying
            ? 'bg-gradient-to-b from-primary-container/25 to-secondary/20 border-primary-container text-primary shadow-[0_0_12px_rgba(234,88,12,0.4)]'
            : 'bg-surface-container hover:bg-surface-container-high border-surface-container-highest text-on-surface-variant hover:text-on-surface'
        }`}
        title={isPlaying ? 'Pause Village Ambience' : 'Play Village Ambience'}
        aria-label="Toggle Clash of Clans Village Sound"
      >
        <span
          className={`material-symbols-outlined text-[16px] transition-transform ${
            isPlaying ? 'text-primary-container animate-pulse' : 'text-outline'
          }`}
        >
          {isPlaying ? 'volume_up' : 'volume_off'}
        </span>

        <span className="hidden xl:inline">
          {isPlaying ? 'Village Music' : 'Music Off'}
        </span>

        {/* Animated Sound Wave Bars when Playing */}
        {isPlaying && (
          <span className="flex items-end gap-0.5 h-3 ml-0.5">
            <span className="w-0.5 h-full bg-primary-container rounded-full animate-bounce [animation-delay:0.1s]"></span>
            <span className="w-0.5 h-2 bg-secondary rounded-full animate-bounce [animation-delay:0.3s]"></span>
            <span className="w-0.5 h-3.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
          </span>
        )}
      </button>

      {/* Settings / Volume Gear Icon */}
      <button
        type="button"
        onClick={() => setShowControls(!showControls)}
        className="ml-1 p-1 rounded hover:bg-surface-container text-outline hover:text-on-surface transition-colors cursor-pointer"
        title="Village Audio Settings"
        aria-label="Village Audio Settings"
      >
        <span className="material-symbols-outlined text-[15px]">tune</span>
      </button>

      {/* Popover Settings Dropdown */}
      {showControls && (
        <div className="absolute right-0 top-full mt-2 w-52 p-3 rounded-xl bg-surface-container border border-secondary/40 shadow-[0_12px_28px_rgba(0,0,0,0.85)] z-50 flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center justify-between pb-1.5 border-b border-surface-container-high/60">
            <span className="font-display font-bold text-xs uppercase text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-primary-container">music_note</span>
              Village Acoustics
            </span>
            <button
              onClick={() => setShowControls(false)}
              className="text-outline hover:text-on-surface p-0.5"
              aria-label="Close settings"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>

          {/* Music Volume Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between font-label text-[10px] text-on-surface-variant">
              <span>Ambience Volume</span>
              <span className="font-mono text-primary">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-primary-container cursor-pointer h-1.5 bg-surface-container-highest rounded-lg appearance-none"
            />
          </div>

          {/* SFX Toggle */}
          <div className="flex items-center justify-between pt-1 border-t border-surface-container-high/40">
            <span className="font-label text-[10px] uppercase text-on-surface-variant">
              Tactile SFX (Clicks/Gold)
            </span>
            <button
              type="button"
              onClick={handleSfxToggle}
              className={`font-label text-[9px] px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                sfxOn
                  ? 'bg-primary-container/20 text-primary border border-primary-container/40'
                  : 'bg-surface-container-high text-outline border border-surface-container-highest'
              }`}
            >
              {sfxOn ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
