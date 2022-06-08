import { PrismaClient } from '@prisma/client';

// const client = new PrismaClient();

// client.user.create({ data: { email: "eric7213@naver.com", name: "fizzhyun" } });

declare global {
	var client: PrismaClient | undefined;
}

const client = global.client || new PrismaClient();

if (process.env.NODE_ENV === 'development') global.client = client;

export default client;
