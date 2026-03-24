import { Metadata } from 'next';
import Image from 'next/image';

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/public/shares/${id}.png`;

	return {
		title: 'Songkran Festival 2026',
		description: 'ท่าอากาศยานสุวรรณภูมิขอเชิญทุกท่านร่วมสนุกเทศกาลสงกรานต์ สาดสุขแบบไทยสไตล์ร่วมสมัย',
		openGraph: {
			title: 'Songkran Festival 2026',
			description: 'มาร่วมเล่นน้ำสงกรานต์ออนไลน์กับท่าอากาศยานสุวรรณภูมิ',
			images: [
				{
					url: imageUrl,
					width: 393,
					height: 677,
					alt: 'Songkran 2026 Splash',
				},
			],
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			title: 'Songkran Festival 2026',
			description: 'มาร่วมเล่นน้ำสงกรานต์ออนไลน์กับท่าอากาศยานสุวรรณภูมิ',
			images: [imageUrl],
		},
	};
}

export default async function SharePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/public/shares/${id}.png`;

	return (
		<main className="w-full h-[100dvh] flex flex-col items-center justify-center bg-[#0055A5] relative overflow-hidden font-sarabun">
			{/* Auto-redirect to the water play page so users don't get stuck here */}
			<meta httpEquiv="refresh" content="2;url=/water-play" />
			
			<div className="flex flex-col items-center justify-center z-10 px-6 max-w-sm mx-auto w-full">
				<h1 className="text-white text-2xl font-bold mb-6 text-center shadow-sm">
					Songkran Festival 2026
				</h1>
				
				<div className="w-[60%] aspect-[393/677] relative rounded-2xl overflow-hidden shadow-2xl mb-8 border-4 border-white/20 bg-black/10">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img 
						src={imageUrl} 
						alt="Shared Photo" 
						className="w-full h-full object-contain"
					/>
				</div>

				<div className="text-white text-center">
					<p className="text-lg font-medium mb-2 opacity-90">กำลังพาคุณไปหน้าสาดน้ำ...</p>
					<div className="animate-spin w-8 h-8 border-4 border-white/30 border-t-white rounded-full mx-auto my-4 text-transparent shadow-sm"></div>
					<a 
						href="/water-play" 
						className="inline-block mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full font-bold transition-colors"
					>
						คลิกหากระบบไม่เปลี่ยนหน้าอัตโนมัติ
					</a>
				</div>
			</div>

			{/* Background styling elements */}
			<div className="absolute inset-0 opacity-20 pointer-events-none" style={{
				backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 70%)'
			}}></div>
		</main>
	);
}
