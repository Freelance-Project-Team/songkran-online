'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMobile } from '@/src/shared/hooks/useMobile';
import { useLangStore } from '@/src/shared/stores/lang-store';
import { SelectCharacter } from './_components/SelectCharacter';
import { SelectLocation } from './_components/SelectLocation';
import { TakePhoto } from './_components/TakePhoto';
import { PhotoPreview } from './_components/PhotoPreview';

type Lang = 'th' | 'en';
type FlowStep = 'character' | 'location' | 'photo' | 'preview';

function SceneFrame({ children }: { children: React.ReactNode }) {
	return (
		<div className="h-dvh w-full flex items-center justify-center overflow-hidden bg-[#b8dff5]">
			<div
				className="relative overflow-hidden w-full sm:h-full sm:w-auto"
				style={{ aspectRatio: '393 / 852' }}
			>
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

const PRELOAD_IMAGES = [
	'/assets/playsongkran/locations/bg.webp',
	'/assets/playsongkran/locations/arun.webp',
	'/assets/playsongkran/locations/phakeaw.webp',
	'/assets/playsongkran/locations/airport.webp',
	'/assets/playsongkran/locations/saochingcha.webp',
	'/assets/playsongkran/locations/arun-text-th.webp',
	'/assets/playsongkran/locations/arun-text-en.webp',
	'/assets/playsongkran/locations/phakeaw-text-th.webp',
	'/assets/playsongkran/locations/phakeaw-text-en.webp',
	'/assets/playsongkran/locations/airport-text-th.webp',
	'/assets/playsongkran/locations/airport-text-en.webp',
	'/assets/playsongkran/locations/saochingcha-text-th.webp',
	'/assets/playsongkran/locations/saochingcha-text-en.webp',
	'/assets/playsongkran/boy-player.webp',
	'/assets/playsongkran/women-player.webp',
];

const SCENE_IMAGES: Record<string, string> = {
	arun: '/assets/playsongkran/scenes/arun-bg.webp',
	phakeaw: '/assets/playsongkran/scenes/phakeaw-bg.webp',
	yaksuwan: '/assets/playsongkran/scenes/yaksuwan-bg.webp',
	saochingcha: '/assets/playsongkran/scenes/saochingcha-bg.webp',
};

export default function WaterPlayPage() {
	const router = useRouter();
	const isMobile = useMobile();
	const { lang, toggleLang } = useLangStore();
	const [flowStep, setFlowStep] = useState<FlowStep>('character');

	useEffect(() => {
		PRELOAD_IMAGES.forEach((src) => { new Image().src = src; });
	}, []);
	const [character, setCharacter] = useState<'boy' | 'girl'>('boy');
	const [faceUrl, setFaceUrl] = useState('');
	const [locationId, setLocationId] = useState('');
	const [photoUrl, setPhotoUrl] = useState('');

	const sharedProps = {
		lang,
		onToggleLang: toggleLang,
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
						const sceneSrc = SCENE_IMAGES[id];
						if (sceneSrc) new Image().src = sceneSrc;
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
				onPhotoTaken={(url) => {
					setPhotoUrl(url);
					setFlowStep('preview');
				}}
			/>
		);
	})();

	if (isMobile) return <SceneFrame>{scene}</SceneFrame>;
	return <DesktopCanvas lang={lang}>{scene}</DesktopCanvas>;
}
