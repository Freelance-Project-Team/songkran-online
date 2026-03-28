'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from './loading-screen';
import { useMobile, useIsSmallPhone } from '@/src/shared/hooks/useMobile';

const ASSETS = {
	bg: '/assets/login/bg.webp',
	wave: '/assets/login/wave.svg',
	pastelCity: '/assets/login/pastel-city.webp',
	childrenLeft: '/assets/login/children-left.webp',
	childrenRight: '/assets/login/children-right.webp',
	kite: '/assets/login/kite.webp',
	bottomBar: '/assets/login/bottom-bar.webp',
	temple: '/assets/login/temple.webp',
	flowers: '/assets/login/flowers.webp',
	logo: '/assets/login/logo.webp',
	mail: '/assets/login/mail.svg',
	lock: '/assets/login/lock.svg',
	google: '/assets/login/google.jpg',
	line: '/assets/login/line.webp',
};

const poppins = { fontFamily: 'Poppins, sans-serif' };
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const oauthLogin = (provider: 'google' | 'line' | 'facebook') => {
	window.location.href = `${API_URL}/auth/${provider}`;
};

/* ─── Animated field wrapper (grid-template-rows trick) ────────────────── */
function AnimatedField({
	visible,
	delay = 0,
	children,
}: {
	visible: boolean;
	delay?: number;
	children: React.ReactNode;
}) {
	return (
		<div
			style={{
				display: 'grid',
				gridTemplateRows: visible ? '1fr' : '0fr',
				opacity: visible ? 1 : 0,
				transform: visible ? 'translateY(0)' : 'translateY(-6px)',
				marginBottom: visible ? '10px' : '0px',
				transition: `grid-template-rows 340ms cubic-bezier(0.4,0,0.2,1) ${delay}ms,
					opacity 240ms ease ${delay}ms,
					transform 300ms cubic-bezier(0.4,0,0.2,1) ${delay}ms,
					margin-bottom 340ms cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
			}}
		>
			<div style={{ overflow: 'hidden' }}>{children}</div>
		</div>
	);
}

/* ─── Artwork ───────────────────────────────────────────────────────────── */
function Artwork({ showBg = true, isSmall = false }: { showBg?: boolean; isSmall?: boolean }) {
	return (
		<>
			{showBg && (
				<img
					src={ASSETS.bg}
					alt=""
					className="absolute inset-0 w-full h-full object-cover object-left pointer-events-none select-none"
				/>
			)}
			<img
				src={ASSETS.wave}
				alt=""
				className="absolute max-w-none pointer-events-none select-none"
				style={{
					top: '58.16%',
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
				style={{ top: isSmall ? '-23%' : '-12%' }}
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
				style={{ top: isSmall ? '3%' : '10.2%', left: '-17.05%', width: '141.17%' }}
			/>
			<img
				src={ASSETS.pastelCity}
				alt=""
				className="absolute left-0 w-full pointer-events-none select-none"
				style={{ top: '71.36%' }}
			/>
			<div
				className="absolute pointer-events-none select-none"
				style={{ top: '78.62%', left: '87.01%', right: '3.68%', bottom: '14.75%' }}
			>
				<img src={ASSETS.kite} alt="" className="w-full h-full object-contain" style={{ transform: 'scaleX(-1)' }} />
			</div>
			<div
				className="absolute left-0 right-0 bottom-0 overflow-hidden pointer-events-none select-none"
				style={{ top: '87.56%' }}
			>
				<img
					src={ASSETS.bottomBar}
					alt=""
					className="absolute left-0 w-full max-w-none"
					style={{ height: '371.23%', top: '-271.23%' }}
				/>
			</div>
			<div
				className="absolute pointer-events-none select-none"
				style={{ top: '83.55%', left: '13.74%', right: '40.97%', bottom: '2.95%' }}
			>
				<img src={ASSETS.childrenLeft} alt="" className="w-full h-full object-contain" />
			</div>
			<div
				className="absolute pointer-events-none select-none"
				style={{ top: '83.43%', left: '59.28%', right: '15.22%', bottom: '3.25%' }}
			>
				<img src={ASSETS.childrenRight} alt="" className="w-full h-full object-contain" style={{ transform: 'scaleX(-1)' }} />
			</div>
		</>
	);
}

/* ─── Input field ───────────────────────────────────────────────────────── */
function InputField({
	type,
	value,
	onChange,
	placeholder,
	icon,
}: {
	type: string;
	value: string;
	onChange: (v: string) => void;
	placeholder: string;
	icon: React.ReactNode;
}) {
	return (
		<div className="bg-white rounded-[15px] h-[45px] flex items-center px-4 gap-3 shadow-sm">
			{icon}
			<input
				type={type}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				style={poppins}
				className="flex-1 bg-transparent outline-none text-[12px] font-semibold text-[#89c6ff] placeholder:text-[#89c6ff] tracking-widest"
			/>
		</div>
	);
}

const MailIcon = () => (
	<img src={ASSETS.mail} alt="" className="w-[18px] h-[18px] shrink-0" />
);
const LockIcon = () => (
	<img src={ASSETS.lock} alt="" className="w-[18px] h-[18px] shrink-0" />
);
const PersonIcon = () => (
	<svg className="w-[18px] h-[18px] shrink-0 text-[#89c6ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
	</svg>
);

/* ─── Login Form ────────────────────────────────────────────────────────── */
type Mode = 'signin' | 'signup';

function LoginForm({ onSuccess, onModeChange }: { onSuccess: () => void; onModeChange?: (m: Mode) => void }) {
	const [mode, setMode] = useState<Mode>('signin');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const isSignUp = mode === 'signup';

	const canSubmit = isSignUp
		? name.trim().length >= 2 && email.trim() !== '' && password.length >= 8 && confirmPassword !== ''
		: email.trim() !== '' && password.trim() !== '';

	const switchMode = (next: Mode) => {
		if (next === mode) return;
		setMode(next);
		onModeChange?.(next);
		setError('');
		setName('');
		setEmail('');
		setPassword('');
		setConfirmPassword('');
	};

	const handleSubmit = async () => {
		setError('');
		if (isSignUp && password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}
		setIsSubmitting(true);
		try {
			const endpoint = isSignUp ? '/auth/register' : '/auth/login';
			const body = isSignUp
				? { name: name.trim(), email: email.toLowerCase(), password, confirmPassword }
				: { email: email.toLowerCase(), password };

			const res = await fetch(`${API_URL}${endpoint}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Something went wrong');

			localStorage.setItem('auth_token', data.token);
			if (data.user?.name) localStorage.setItem('user_name', data.user.name);
			if (data.user?.avatar) localStorage.setItem('user_avatar', data.user.avatar ?? '');
			onSuccess();
		} catch (err: any) {
			setError(err.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex flex-col w-full">

			{/* ── Sliding pill toggle ── */}
			<div className="relative flex bg-[#e8f4ff] rounded-[12px] p-[3px] mb-[10px]">
				{/* Moving pill */}
				<div
					style={{
						position: 'absolute',
						top: '3px',
						bottom: '3px',
						borderRadius: '10px',
						background: '#4da8fe',
						boxShadow: '0 1px 4px rgba(77,168,254,0.4)',
						transition: 'left 300ms cubic-bezier(0.4,0,0.2,1), right 300ms cubic-bezier(0.4,0,0.2,1)',
						left: isSignUp ? 'calc(50% + 1.5px)' : '3px',
						right: isSignUp ? '3px' : 'calc(50% + 1.5px)',
					}}
				/>
				{(['signin', 'signup'] as Mode[]).map((m) => (
					<button
						key={m}
						onClick={() => switchMode(m)}
						style={{ ...poppins, position: 'relative', zIndex: 1 }}
						className={`flex-1 h-[34px] rounded-[10px] text-[11px] font-semibold tracking-widest cursor-pointer transition-colors duration-200 ${
							mode === m ? 'text-white' : 'text-[#89c6ff] hover:text-[#4da8fe]'
						}`}
					>
						{m === 'signin' ? 'SIGN IN' : 'SIGN UP'}
					</button>
				))}
			</div>

			{/* ── Name (Sign Up only, stagger 0ms) ── */}
			<AnimatedField visible={isSignUp} delay={0}>
				<InputField
					type="text"
					value={name}
					onChange={setName}
					placeholder="FULL NAME"
					icon={<PersonIcon />}
				/>
			</AnimatedField>

			{/* ── Email (always visible) ── */}
			<div className="mb-[10px]">
				<InputField
					type="email"
					value={email}
					onChange={setEmail}
					placeholder="EMAIL"
					icon={<MailIcon />}
				/>
			</div>

			{/* ── Password (always visible) ── */}
			<div className="mb-[10px]">
				<InputField
					type="password"
					value={password}
					onChange={setPassword}
					placeholder="PASSWORD"
					icon={<LockIcon />}
				/>
			</div>

			{/* ── Confirm Password (Sign Up only, stagger 40ms) ── */}
			<AnimatedField visible={isSignUp} delay={40}>
				<InputField
					type="password"
					value={confirmPassword}
					onChange={setConfirmPassword}
					placeholder="CONFIRM PASSWORD"
					icon={<LockIcon />}
				/>
			</AnimatedField>

			{/* ── Error message ── */}
			<AnimatedField visible={!!error} delay={0}>
				<p style={poppins} className="text-[11px] font-semibold text-red-500 text-center px-2 pb-[2px]">
					{error}
				</p>
			</AnimatedField>

			{/* ── Submit button ── */}
			<button
				onClick={handleSubmit}
				disabled={!canSubmit || isSubmitting}
				style={poppins}
				className="relative rounded-[15px] h-[45px] w-full flex items-center justify-center text-white text-[16px] font-semibold mb-[10px] transition-all bg-[#4da8fe] enabled:hover:bg-[#3a97ed] enabled:active:scale-[0.98] enabled:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden"
			>
				{/* Sign In text */}
				<span
					style={{
						position: 'absolute',
						transition: 'opacity 200ms ease, transform 200ms ease',
						opacity: isSubmitting ? 0 : isSignUp ? 0 : 1,
						transform: isSignUp ? 'translateY(-8px)' : 'translateY(0)',
					}}
				>
					LOG IN
				</span>

				{/* Sign Up text */}
				<span
					style={{
						position: 'absolute',
						transition: 'opacity 200ms ease 80ms, transform 200ms ease 80ms',
						opacity: isSubmitting ? 0 : isSignUp ? 1 : 0,
						transform: isSignUp ? 'translateY(0)' : 'translateY(8px)',
					}}
				>
					CREATE ACCOUNT
				</span>

				{/* Spinner */}
				{isSubmitting && (
					<span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
				)}
			</button>

			{/* ── OAuth section ── */}
			<div className="bg-white/80 backdrop-blur-sm rounded-[18px] px-4 py-3 flex flex-col gap-3 border border-white/60 shadow-sm">
				<div className="flex items-center gap-3">
					<div className="flex-1 h-px bg-[#4b4137]/20" />
					<span style={poppins} className="text-[10px] font-semibold text-[#4b4137]/60 whitespace-nowrap tracking-widest">
						OR CONTINUE WITH
					</span>
					<div className="flex-1 h-px bg-[#4b4137]/20" />
				</div>

				<div className="flex items-center justify-center gap-4">
					<button
						onClick={() => oauthLogin('google')}
						className="flex items-center gap-2 bg-white rounded-[12px] px-4 h-[44px] shadow-md border border-gray-100 hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
					>
						<img src={ASSETS.google} alt="Google" className="w-[22px] h-[22px] object-cover rounded-sm shrink-0" />
						<span style={poppins} className="text-[12px] font-semibold text-gray-600 tracking-wide">Google</span>
					</button>

					<button
						onClick={() => oauthLogin('line')}
						className="flex items-center gap-2 bg-[#06C755] rounded-[12px] px-4 h-[44px] shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
					>
						<div className="w-[22px] h-[22px] rounded-sm overflow-hidden relative shrink-0">
							<img
								src={ASSETS.line}
								alt="LINE"
								className="absolute max-w-none"
								style={{ height: '144.26%', left: '-26.02%', top: '-22.13%', width: '286.43%' }}
							/>
						</div>
						<span style={poppins} className="text-[12px] font-semibold text-white tracking-wide">LINE</span>
					</button>
				</div>
			</div>

		</div>
	);
}

/* ─── Mobile Layout ─────────────────────────────────────────────────────── */
function MobileLayout({ onSuccess }: { onSuccess: () => void }) {
	const isSmall = useIsSmallPhone();
	const [mode, setMode] = useState<Mode>('signin');

	const spacerHeight = mode === 'signup'
		? (isSmall ? '28dvh' : '33dvh')
		: (isSmall ? '38dvh' : '43dvh');

	return (
		<div className="relative w-full" style={{ height: '100dvh' }}>
			{/* Fixed artwork background */}
			<div className="fixed inset-0 pointer-events-none">
				<Artwork isSmall={isSmall} />
			</div>

			{/* Scrollable layer */}
			<div
				className="relative overflow-y-auto overscroll-contain"
				style={{ height: '100dvh' }}
			>
				{/* Spacer shrinks when Sign Up is selected */}
				<div style={{ height: spacerHeight, transition: 'height 380ms cubic-bezier(0.4,0,0.2,1)', flexShrink: 0 }} />

				{/* Form area */}
				<div className="px-[15.5%] pb-8">
					<LoginForm onSuccess={onSuccess} onModeChange={setMode} />
				</div>
			</div>
		</div>
	);
}

/* ─── Desktop Layout ────────────────────────────────────────────────────── */
function DesktopLayout({ onSuccess }: { onSuccess: () => void }) {
	return (
		<div className="flex h-screen">
			<div className="relative flex-1 h-screen overflow-hidden bg-sky-200">
				<Artwork />
			</div>
			<div className="w-[440px] shrink-0 flex flex-col items-center justify-center bg-white px-10 py-12 shadow-2xl overflow-y-auto z-10">
				<img src={ASSETS.logo} alt="Amazing Songkran Festival 2026" className="w-56 object-contain mb-6" />
				<p style={poppins} className="text-[#89c6ff] text-[11px] font-semibold tracking-widest mb-8">
					WELCOME TO SONGKRAN FESTIVAL
				</p>
				<div className="w-full max-w-[320px]">
					<LoginForm onSuccess={onSuccess} />
				</div>
			</div>
		</div>
	);
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function LoginPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const isMobile = useMobile();

	return (
		<>
			{loading && <LoadingScreen onComplete={() => router.push('/home')} />}
			{isMobile ? (
				<MobileLayout onSuccess={() => setLoading(true)} />
			) : (
				<DesktopLayout onSuccess={() => setLoading(true)} />
			)}
		</>
	);
}
