import { PrismaClient, OAuthProvider } from '@prisma/client';
import jwt from 'jsonwebtoken';
import fs from 'fs';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const TOTAL_USERS = 1000;

async function main() {
	console.log(`Seeding ${TOTAL_USERS} users...`);

	const users = Array.from({ length: TOTAL_USERS }, (_, i) => ({
		email: `testuser${i + 1}@songkran.test`,
		name: `Test User ${i + 1}`,
		avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 1}`,
		provider: OAuthProvider.GOOGLE,
		providerId: `google_seed_${i + 1}`,
	}));

	await prisma.user.createMany({ data: users, skipDuplicates: true });

	const createdUsers = await prisma.user.findMany({
		where: { providerId: { startsWith: 'google_seed_' } },
		select: { id: true, email: true, name: true },
	});

	// Generate JWT tokens for JMeter
	const tokens = createdUsers.map((user) => ({
		userId: user.id,
		email: user.email,
		name: user.name,
		token: jwt.sign({ userId: user.id, email: user.email, name: user.name }, JWT_SECRET, {
			expiresIn: '7d',
		}),
	}));

	fs.writeFileSync('seed-tokens.json', JSON.stringify(tokens, null, 2));

	// CSV สำหรับ JMeter
	const csv = ['token', ...tokens.map((t) => t.token)].join('\n');
	fs.writeFileSync('seed-tokens.csv', csv);

	console.log(`✅ Created ${createdUsers.length} users`);
	console.log('✅ Tokens saved to seed-tokens.json and seed-tokens.csv');
}

main()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
