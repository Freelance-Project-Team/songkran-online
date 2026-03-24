import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Lang = 'th' | 'en';

interface LangStore {
	lang: Lang;
	toggleLang: () => void;
}

export const useLangStore = create<LangStore>()(
	persist(
		(set) => ({
			lang: 'th',
			toggleLang: () => set((s) => ({ lang: s.lang === 'th' ? 'en' : 'th' })),
		}),
		{ name: 'lang-storage' },
	),
);
