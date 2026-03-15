import prisma from '../../shared/prisma/index';

export const UserService = {
	findById: async (id: number) => {
		return prisma.user.findUnique({
			where: { id },
		});
	},

	findByEmail: async (email: string) => {
		return prisma.user.findUnique({
			where: { email },
		});
	},

	create: async (data: any) => {
		return prisma.user.create({
			data,
		});
	},
};
