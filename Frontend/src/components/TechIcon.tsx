import React from 'react';

interface TechIconProps {
  name: string;
  className?: string;
}

export const TechIcon: React.FC<TechIconProps> = ({ name, className = 'w-4 h-4' }) => {
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  switch (key) {
    case 'python':
    case 'py':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path
            d="M11.91 2c-5.4 0-5.06 2.34-5.06 2.34l.01 2.42h5.13v.73H4.95S2 7.15 2 12.58c0 5.43 2.57 5.25 2.57 5.25h1.53v-2.19s-.08-2.57 2.53-2.57h4.34s2.45.04 2.45-2.4V4.4s.37-2.4-3.91-2.4zm-2.78 1.48a.86.86 0 110 1.72.86.86 0 010-1.72z"
            fill="#38bdf8"
          />
          <path
            d="M12.09 22c5.4 0 5.06-2.34 5.06-2.34l-.01-2.42h-5.13v-.73h7.04S22 16.85 22 11.42c0-5.43-2.57-5.25-2.57-5.25h-1.53v2.19s.08 2.57-2.53 2.57h-4.34s-2.45-.04-2.45 2.4v4.27s-.37 2.4 3.91 2.4zm2.78-1.48a.86.86 0 110-1.72.86.86 0 010 1.72z"
            fill="#f59e0b"
          />
        </svg>
      );

    case 'c':
      return (
        <span className="font-mono font-bold text-sky-400 text-[11px] leading-none px-0.5">
          C
        </span>
      );

    case 'cplusplus':
    case 'cpp':
      return (
        <span className="font-mono font-bold text-blue-400 text-[10px] leading-none px-0.5">
          C++
        </span>
      );

    case 'java':
    case 'jv':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#ea580c">
          <path d="M8.8 19.3c3.4.3 6.6-.7 8.2-1.3-.8.6-2.8 1.5-6.5 1.5-2.9 0-4.5-.6-4.5-.6s1 0 2.8.4zm-.9-2.2c2.8.2 5.5-.5 7.1-1-.7.4-2.4 1.1-5.6 1.1-2.4 0-3.9-.4-3.9-.4s.9 0 2.4.3zm6.6-4.9c1 .9 1.4 1.9.9 2.9-1.2 2.3-5.2 2.7-8.8 2.7-.8 0-1.6 0-2.3-.1 0 0 1.5.5 3.7.5 5.5 0 8.8-1.7 8.8-4.2 0-.7-.4-1.3-1.1-1.8-.4-.3-.8-.7-1.2-1zM11.6 2C9.4 3.9 9.8 6.5 11 8c-1.3-.9-1.9-2.4-1.2-3.8.4-.9 1-1.6 1.8-2.2zm3.7 4.5c.8.9 1 2.1.4 3.2-.8 1.4-2.3 2.1-3.6 2.6 1-.5 2.1-1.3 2.5-2.4.5-1.1.2-2.3-.5-3.1 0 0 .7-.3 1.2-.3z" />
        </svg>
      );

    case 'javascript':
    case 'js':
      return (
        <span className="bg-amber-400 text-black font-extrabold text-[9px] px-1 py-0.5 rounded-xs leading-none">
          JS
        </span>
      );

    case 'typescript':
    case 'ts':
      return (
        <span className="bg-blue-600 text-white font-extrabold text-[9px] px-1 py-0.5 rounded-xs leading-none">
          TS
        </span>
      );

    case 'react':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="#38bdf8" strokeWidth="1.8">
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(0 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.8" fill="#38bdf8" />
        </svg>
      );

    case 'nextjs':
    case 'next':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <circle cx="12" cy="12" r="10" fill="#000" stroke="#475569" strokeWidth="1.5" />
          <path d="M15.5 8.5v7l-5.8-7H8v7h1.5v-5.2l5.5 6.7h1.5v-8.5h-1z" fill="#fff" />
        </svg>
      );

    case 'html':
    case 'html5':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#f97316">
          <path d="M3 2l1.8 17.5L12 22l7.2-2.5L21 2H3zm14.8 6.5h-8.2l.2 2.3h7.8l-.6 6.3-4.9 1.4-4.9-1.4-.3-3.6h2.2l.2 1.8 2.8.8 2.8-.8.3-2.6H6.9l-.7-6.9h11.8l-.2 2.7z" />
        </svg>
      );

    case 'css':
    case 'css3':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#38bdf8">
          <path d="M3 2l1.8 17.5L12 22l7.2-2.5L21 2H3zm14.8 4.2H6.3l.2 2.3h10.9l-.3 3.1H7l.2 2.3h8.3l-.5 4.8-3 .8-3-.8-.2-2.3H6.6l.3 4.2 5.1 1.4 5.1-1.4 1-10.7z" />
        </svg>
      );

    case 'tailwind':
    case 'tailwindcss':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#06b6d4">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
        </svg>
      );

    case 'nodejs':
    case 'node':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#22c55e">
          <path d="M12 2L3.5 6.9v9.8L12 21.6l8.5-4.9V6.9L12 2zm0 2.3l6.5 3.8v7.5L12 19.3 5.5 15.6V8.1L12 4.3z" />
        </svg>
      );

    case 'fastapi':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#10b981">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-4H9l4-6v4h2l-4 6z" />
        </svg>
      );

    case 'mongodb':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#16a34a">
          <path d="M12 2C11.5 3.2 7 9.8 7 14.2c0 3.3 2.2 5.8 5 5.8 2.8 0 5-2.5 5-5.8 0-4.4-4.5-11-5-12zm0 17.5c-2.3 0-4-1.9-4-4.5 0-3.4 3.3-8.6 4-9.8.7 1.2 4 6.4 4 9.8 0 2.6-1.7 4.5-4 4.5z" />
        </svg>
      );

    case 'postgresql':
    case 'postgres':
    case 'sql':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#38bdf8">
          <path d="M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm0 2c3.87 0 6 1.43 6 2s-2.13 2-6 2-6-1.43-6-2 2.13-2 6-2zm0 14c-3.87 0-6-1.43-6-2v-2.3c1.61.85 3.8 1.3 6 1.3s4.39-.45 6-1.3V17c0 .57-2.13 2-6 2zm0-5c-3.87 0-6-1.43-6-2V9.7c1.61.85 3.8 1.3 6 1.3s4.39-.45 6-1.3V12c0 .57-2.13 2-6 2z" />
        </svg>
      );

    case 'git':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#f97316">
          <path d="M21.6 10.9L13.1 2.4c-.6-.6-1.5-.6-2.1 0L8.8 4.6l2.8 2.8c.6-.2 1.3 0 1.7.4.4.4.6 1.1.4 1.7l2.7 2.7c.6-.2 1.3 0 1.7.4.6.6.6 1.5 0 2.1-.6.6-1.5.6-2.1 0-.5-.5-.6-1.2-.4-1.8L12.9 10v4.7c.2.1.4.3.5.5.6.6.6 1.5 0 2.1-.6.6-1.5.6-2.1 0-.6-.6-.6-1.5 0-2.1.2-.2.4-.4.6-.5v-4.9c-.2-.1-.4-.3-.6-.5-.5-.5-.6-1.2-.4-1.8L8.1 4.7 2.4 10.4c-.6.6-.6 1.5 0 2.1l8.5 8.5c.6.6 1.5.6 2.1 0l8.6-8.6c.6-.5.6-1.5 0-2.1z" />
        </svg>
      );

    case 'github':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
        </svg>
      );

    case 'linux':
      return (
        <span className="material-symbols-outlined text-[15px] text-amber-300">terminal</span>
      );

    case 'docker':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#38bdf8">
          <path d="M13.9 11.2h2v2h-2zm-2.5 0h2v2h-2zm-2.5 0h2v2h-2zm-2.5 0h2v2h-2zm5-2.5h2v2h-2zm-2.5 0h2v2h-2zm-2.5 0h2v2h-2zm5-2.5h2v2h-2zm-2.5 0h2v2h-2zm12 7.7c-.5-.4-1.6-.7-2.7-.3-.2-.7-.7-1.3-1.4-1.7l-.6-.3-.3.6c-.4.8-.4 1.8 0 2.6-.4.2-1.2.3-2.3.3H2.8C2.3 18.2 5.5 21 12 21c7.2 0 10.7-3.6 11.4-6.2l.1-.6-.6-.3z" />
        </svg>
      );

    case 'machinelearning':
    case 'ml':
    case 'deeplearning':
      return (
        <span className="material-symbols-outlined text-[15px] text-purple-400">psychology</span>
      );

    case 'scikitlearn':
    case 'sklearn':
      return (
        <span className="material-symbols-outlined text-[15px] text-orange-400">science</span>
      );

    case 'pandas':
      return (
        <span className="material-symbols-outlined text-[15px] text-blue-400">table_chart</span>
      );

    case 'numpy':
      return (
        <span className="material-symbols-outlined text-[15px] text-sky-400">grid_view</span>
      );

    case 'datascience':
      return (
        <span className="material-symbols-outlined text-[15px] text-emerald-400">insights</span>
      );

    case 'nlp':
      return (
        <span className="material-symbols-outlined text-[15px] text-cyan-400">chat_bubble</span>
      );

    case 'computervision':
    case 'cv':
      return (
        <span className="material-symbols-outlined text-[15px] text-sky-400">visibility</span>
      );

    case 'yolov8':
    case 'yolo':
      return (
        <span className="material-symbols-outlined text-[15px] text-yellow-400">crop_free</span>
      );

    case 'easyocr':
    case 'tesseract':
    case 'ocr':
      return (
        <span className="material-symbols-outlined text-[15px] text-red-400">document_scanner</span>
      );

    case 'llms':
    case 'llm':
      return (
        <span className="material-symbols-outlined text-[15px] text-violet-400">smart_toy</span>
      );

    case 'groqapi':
    case 'groq':
      return (
        <span className="material-symbols-outlined text-[15px] text-orange-400">bolt</span>
      );

    case 'websockets':
    case 'socket':
      return (
        <span className="material-symbols-outlined text-[15px] text-teal-400">sync_alt</span>
      );

    case 'postman':
      return (
        <span className="material-symbols-outlined text-[15px] text-orange-400">send</span>
      );

    case 'datastructures':
    case 'dsa':
      return (
        <span className="material-symbols-outlined text-[15px] text-emerald-400">account_tree</span>
      );

    case 'oop':
      return (
        <span className="material-symbols-outlined text-[15px] text-amber-400">shapes</span>
      );

    default:
      return (
        <span className="material-symbols-outlined text-[14px] text-secondary">code</span>
      );
  }
};
