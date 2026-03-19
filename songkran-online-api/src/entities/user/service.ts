import prisma from '../../shared/prisma/index';
import { OAuthProvider } from '@prisma/client';
import { OAuthProfile } from '../../features/auth/oauth';

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
