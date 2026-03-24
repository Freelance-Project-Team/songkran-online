import prisma from '../../shared/prisma/index';
import { OAuthProvider } from '@prisma/client';
import { OAuthProfile } from '../../features/auth/oauth';
import bcrypt from 'bcryptjs';

const BCRYPT_ROUNDS = 12;

export const UserService = {
	findById: async (id: number) => {
		return prisma.user.findUnique({ where: { id } });
	},

	findByEmail: async (email: string) => {
		return prisma.user.findUnique({ where: { email } });
	},

	create: async (data: any) => {
		return prisma.user.create({ data });
	},

	registerWithEmail: async (name: string, email: string, password: string) => {
		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) {
			throw new Error('EMAIL_ALREADY_IN_USE');
		}
		const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
		return prisma.user.create({
			data: { name, email, password: hashed },
		});
	},

	loginWithEmail: async (email: string, password: string) => {
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user || !user.password) {
			throw new Error('INVALID_CREDENTIALS');
		}
		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			throw new Error('INVALID_CREDENTIALS');
		}
		return user;
	},

	upsertByProvider: async (provider: OAuthProvider, profile: OAuthProfile) => {
		return prisma.user.upsert({
			where: {
				provider_providerId: {
					provider,
					providerId: profile.providerId,
				},
			},
			create: {
				provider,
				providerId: profile.providerId,
				email: profile.email,
				name: profile.name,
				avatar: profile.avatar,
			},
			update: {
				name: profile.name,
				avatar: profile.avatar,
				...(profile.email ? { email: profile.email } : {}),
			},
		});
	},
};
