'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMobile } from '@/src/shared/hooks/useMobile';
import { SelectCharacter } from './_components/SelectCharacter';
import { SelectLocation } from './_components/SelectLocation';
import { TakePhoto } from './_components/TakePhoto';
import { PhotoPreview } from './_components/PhotoPreview';

type Lang = 'th' | 'en';
type FlowStep = 'character' | 'location' | 'photo' | 'preview';

function SceneFrame({ children }: { children: React.ReactNode }) {
	return (
		<div className="h-dvh w-full flex items-center justify-center overflow-hidden bg-[#b8dff5]">
			<div className="relative h-full overflow-hidden" style={{ aspectRatio: '393 / 852' }}>
				{children}
			</div>
		</div>
	);
}

function DesktopCanvas({ children, lang }: { children: React.ReactNode; lang: Lang }) {
	return (
		<div className="flex h-screen">
			<SceneFrame>{children}</SceneFrame>
			<div className="w-110 shrink-0 flex flex-col items-center justify-center bg-white px-10 py-12 shadow-2xl overflow-y-auto z-10">
				<p
					className="text-[#89c6ff] text-[13px] font-semibold tracking-widest text-center"
					style={{ fontFamily: 'Sarabun, sans-serif' }}
				>
					{lang === 'th' ? 'เลือกตัวละครของคุณ' : 'CHOOSE YOUR CHARACTER'}
				</p>
			</div>
		</div>
	);
}

export default function WaterPlayPage() {
	const router = useRouter();
	const isMobile = useMobile();
	const [lang, setLang] = useState<Lang>('th');
	const [flowStep, setFlowStep] = useState<FlowStep>('character');
	const [character, setCharacter] = useState<'boy' | 'girl'>('boy');
	const [faceUrl, setFaceUrl] = useState('');
	const [locationId, setLocationId] = useState('');
	const [photoUrl, setPhotoUrl] = useState('');

	const sharedProps = {
		lang,
		onToggleLang: () => setLang((l) => (l === 'th' ? 'en' : 'th')),
	};

	const scene = (() => {
		if (flowStep === 'character') {
			return (
				<SelectCharacter
					{...sharedProps}
					onBack={() => router.push('/home')}
					onComplete={(char, url) => {
						setCharacter(char);
						setFaceUrl(url);
						setFlowStep('location');
					}}
				/>
			);
		}
		if (flowStep === 'location') {
			return (
				<SelectLocation
					{...sharedProps}
					character={character}
					onBack={() => setFlowStep('character')}
					onComplete={(id) => {
						setLocationId(id);
						setFlowStep('photo');
					}}
				/>
			);
		}
		if (flowStep === 'preview') {
			return (
				<PhotoPreview
					{...sharedProps}
					character={character}
					faceUrl={faceUrl}
					locationId={locationId}
					photoUrl={photoUrl}
					onBack={() => setFlowStep('photo')}
					onRetake={() => setFlowStep('character')}
				/>
			);
		}
		return (
			<TakePhoto
				{...sharedProps}
				character={character}
				faceUrl={faceUrl}
				locationId={locationId}
				onBack={() => setFlowStep('location')}
				onPhotoTaken={(url) => { setPhotoUrl(url); setFlowStep('preview'); }}
			/>
		);
	})();

	if (isMobile) return <SceneFrame>{scene}</SceneFrame>;
	return <DesktopCanvas lang={lang}>{scene}</DesktopCanvas>;
}
