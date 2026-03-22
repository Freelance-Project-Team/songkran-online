'use client';

import { LangToggleButton } from '@/src/shared/ui/LangToggleButton';
import { GoBackButton } from '@/src/shared/ui/GoBackButton';

type Lang = 'th' | 'en';

export function TakePhoto({
	lang,
	character,
	faceUrl,
	locationId,
	onToggleLang,
	onBack,
}: {
	lang: Lang;
	character: 'boy' | 'girl';
	faceUrl: string;
	locationId: string;
	onToggleLang: () => void;
	onBack: () => void;
}) {
	// TODO: implement photo composite screen
	// Overlay character + faceUrl onto location background
	void character;
	void faceUrl;
	void locationId;

	return (
		<>
			<LangToggleButton lang={lang} onToggle={onToggleLang} />
			<GoBackButton lang={lang} onBack={onBack} />
		</>
	);
}
