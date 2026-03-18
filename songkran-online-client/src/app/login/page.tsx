'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from './loading-screen';

const ASSETS = {
	bg:             '/assets/login/bg.png',
	wave:           '/assets/login/wave.svg',
	pastelCity:     '/assets/login/pastel-city.png',
	childrenLeft:   '/assets/login/children-left.png',
	childrenRight:  '/assets/login/children-right.png',
	kite:           '/assets/login/kite.png',
	bottomBar:      '/assets/login/bottom-bar.png',
	temple:         '/assets/login/temple.png',
	flowers:        '/assets/login/flowers.png',
	logo:           '/assets/login/logo.png',
	mail:           '/assets/login/mail.svg',
	lock:           '/assets/login/lock.svg',
	facebook:       '/assets/login/facebook.jpg',
	google:         '/assets/login/google.jpg',
	line:           '/assets/login/line.png',
};

const poppins = { fontFamily: 'Poppins, sans-serif' };

function Artwork() {
	return (
		<>
			<img
				src={ASSETS.bg}
				alt=""
				className="absolute inset-0 w-full h-full object-cover object-left pointer-events-none select-none"
			/>

			<img
				src={ASSETS.wave}
				alt=""
				className="absolute max-w-none pointer-events-none select-none"
				style={{
					top: 'calc(50% + 69.5px)',
					left: '-6.62%',
					right: '-6.11%',
					width: '112.73%',
					aspectRatio: '355 / 240',
					transform: 'translateY(-50%)',
				}}
			/>

			<img
				src={ASSETS.temple}
				alt=""
				className="absolute left-0 w-full pointer-events-none select-none"
				style={{ top: '-12%' }}
			/>

			<img
				src={ASSETS.flowers}
				alt=""
				className="absolute pointer-events-none select-none"
				style={{ top: '5.92%', left: '-2.17%', width: '33.59%' }}
			/>

			<img
				src={ASSETS.logo}
				alt="Amazing Songkran Festival 2026"
				className="absolute max-w-none pointer-events-none select-none"
				style={{ top: '10.2%', left: '-17.05%', width: '141.17%' }}
			/>

			<img
				src={ASSETS.pastelCity}
				alt=""
				className="absolute left-0 w-full pointer-events-none select-none"
				style={{ top: '71.36%' }}
			/>

			{/* Kite — node 419:1019, right edge */}
			<div className="absolute pointer-events-none select-none"
				style={{ top: '78.62%', left: '87.01%', right: '3.68%', bottom: '14.75%' }}>
				<img src={ASSETS.kite} alt="" className="w-full h-full object-contain" style={{ transform: 'scaleX(-1)' }} />
			</div>

			{/* Sand — node 419:966, container at y=746/852 */}
			<div className="absolute left-0 right-0 bottom-0 overflow-hidden pointer-events-none select-none"
				style={{ top: '87.56%' }}>
				<img
					src={ASSETS.bottomBar}
					alt=""
					className="absolute left-0 w-full max-w-none"
					style={{ height: '371.23%', top: '-271.23%' }}
				/>
			</div>

			{/* 3 children — node 419:971, left group */}
			<div className="absolute pointer-events-none select-none"
				style={{ top: '83.55%', left: '13.74%', right: '40.97%', bottom: '2.95%' }}>
				<img src={ASSETS.childrenLeft} alt="" className="w-full h-full object-contain" />
			</div>

			{/* 1 boy — node 419:983, right group */}
			<div className="absolute pointer-events-none select-none"
				style={{ top: '83.43%', left: '59.28%', right: '15.22%', bottom: '3.25%' }}>
				<img src={ASSETS.childrenRight} alt="" className="w-full h-full object-contain" style={{ transform: 'scaleX(-1)' }} />
			</div>
		</>
	);
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	return (
		<div className="flex flex-col gap-[10px] w-full">
			<div className="bg-white rounded-[15px] h-[45px] flex items-center px-4 gap-3 shadow-sm">
				<img src={ASSETS.mail} alt="" className="w-[18px] h-[18px] shrink-0" />
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="EMAIL"
					style={poppins}
					className="flex-1 bg-transparent outline-none text-[12px] font-semibold text-[#89c6ff] placeholder:text-[#89c6ff] tracking-widest"
				/>
			</div>

			<div className="bg-white rounded-[15px] h-[45px] flex items-center px-4 gap-3 shadow-sm">
				<img src={ASSETS.lock} alt="" className="w-[18px] h-[18px] shrink-0" />
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="PASSWORD"
					style={poppins}
					className="flex-1 bg-transparent outline-none text-[12px] font-semibold text-[#89c6ff] placeholder:text-[#89c6ff] tracking-widest"
				/>
			</div>

			<button
				onClick={onLogin}
				style={poppins}
				className="bg-[#4da8fe] rounded-[15px] h-[45px] w-full flex items-center justify-center text-white text-[16px] font-semibold mt-[10px] hover:bg-[#3a97ed] active:scale-[0.98] transition-all cursor-pointer"
			>
				LOG IN
			</button>

			<div className="flex items-center gap-3 mt-[5px]">
				<div className="flex-1 h-px bg-[#4b4137]/30" />
				<span style={poppins} className="text-[11px] font-semibold text-[#4b4137] whitespace-nowrap">
					SIGN IN WITH
				</span>
				<div className="flex-1 h-px bg-[#4b4137]/30" />
			</div>

			<div className="flex items-center justify-center gap-6 mt-[5px]">
				<button className="rounded-[14px] shadow-md w-[50px] h-[50px] overflow-hidden hover:scale-105 active:scale-95 transition-transform cursor-pointer shrink-0">
					<img src={ASSETS.facebook} alt="Facebook" className="w-full h-full object-cover" />
				</button>
				<button className="rounded-[14px] shadow-md w-[50px] h-[50px] overflow-hidden hover:scale-105 active:scale-95 transition-transform cursor-pointer shrink-0">
					<img src={ASSETS.google} alt="Google" className="w-full h-full object-cover" />
				</button>
				<button className="rounded-[14px] w-[50px] h-[50px] overflow-hidden relative hover:scale-105 active:scale-95 transition-transform cursor-pointer shrink-0">
					<img
						src={ASSETS.line}
						alt="LINE"
						className="absolute max-w-none"
						style={{ height: '144.26%', left: '-26.02%', top: '-22.13%', width: '286.43%' }}
					/>
				</button>
			</div>
		</div>
	);
}

function MobileLayout({ onLogin }: { onLogin: () => void }) {
	return (
		<div className="relative h-screen w-full overflow-hidden bg-sky-200">
			<Artwork />

			<div className="absolute inset-x-0 px-[15.5%]" style={{ top: '49%' }}>
				<LoginForm onLogin={onLogin} />
			</div>
		</div>
	);
}

function DesktopLayout({ onLogin }: { onLogin: () => void }) {
	return (
		<div className="flex h-screen">
			<div className="relative flex-1 h-screen overflow-hidden bg-sky-200">
				<Artwork />
			</div>

			<div className="w-[440px] shrink-0 flex flex-col items-center justify-center bg-white px-10 py-12 shadow-2xl overflow-y-auto z-10">
				<img
					src={ASSETS.logo}
					alt="Amazing Songkran Festival 2026"
					className="w-56 object-contain mb-6"
				/>
				<p
					style={poppins}
					className="text-[#89c6ff] text-[11px] font-semibold tracking-widest mb-8"
				>
					SIGN IN TO YOUR ACCOUNT
				</p>
				<div className="w-full max-w-[320px]">
					<LoginForm onLogin={onLogin} />
				</div>
			</div>
		</div>
	);
}

export default function LoginPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleLogin = () => setLoading(true);
	const handleComplete = () => router.push('/home');

	return (
		<>
			{loading && <LoadingScreen onComplete={handleComplete} />}

			<div className="lg:hidden">
				<MobileLayout onLogin={handleLogin} />
			</div>
			<div className="hidden lg:block">
				<DesktopLayout onLogin={handleLogin} />
			</div>
		</>
	);
}
