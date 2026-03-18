'use client';

import { useState } from 'react';

// Figma asset URLs — valid for 7 days from generation
const ASSETS = {
	bg: 'https://www.figma.com/api/mcp/asset/2fa917bb-a165-464b-91ef-24bd008b2ecf',
	wave: 'https://www.figma.com/api/mcp/asset/0dd6ceb0-c92b-4f48-ab66-5391b9e33a83',
	pastelCity: 'https://www.figma.com/api/mcp/asset/b406a640-b477-43c3-9e2b-562c63b5f539',
	bottomBar: 'https://www.figma.com/api/mcp/asset/9b9238da-17d2-4aa6-bdd9-9c09fd8060c9',
	temple: 'https://www.figma.com/api/mcp/asset/2b81766f-cb13-4753-8ff7-e2161368a2c9',
	flowers: 'https://www.figma.com/api/mcp/asset/d1c513b6-c235-4f3e-b381-c25e314343cc',
	logo: 'https://www.figma.com/api/mcp/asset/38af35ec-faf3-4981-8597-4b74c8506735',
	mail: 'https://www.figma.com/api/mcp/asset/c9193ab9-8559-4eaa-91ae-456e9e29a8a1',
	lock: 'https://www.figma.com/api/mcp/asset/c36620ee-80c7-4db5-9e2f-5dd8b62a247e',
	facebook: 'https://www.figma.com/api/mcp/asset/41826331-b154-427b-b5a5-600bd9038187',
	google: 'https://www.figma.com/api/mcp/asset/cd0d2554-ae5c-4a63-8110-d816ef9e49ea',
	line: 'https://www.figma.com/api/mcp/asset/5541ab73-dbd7-47d4-baf0-2429e7cdd9f0',
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

			<img
				src={ASSETS.bottomBar}
				alt=""
				className="absolute left-0 w-full pointer-events-none select-none"
				style={{ top: '87.56%' }}
			/>
		</>
	);
}

function LoginForm() {
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

function MobileLayout() {
	return (
		<div className="relative h-screen w-full overflow-hidden bg-sky-200">
			<Artwork />

			<div className="absolute inset-x-0 px-[15.5%]" style={{ top: '49%' }}>
				<LoginForm />
			</div>
		</div>
	);
}

function DesktopLayout() {
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
					<LoginForm />
				</div>
			</div>
		</div>
	);
}

export default function LoginPage() {
	return (
		<>
			<div className="lg:hidden">
				<MobileLayout />
			</div>
			<div className="hidden lg:block">
				<DesktopLayout />
			</div>
		</>
	);
}
