import axios from 'axios';

export interface OAuthProfile {
	providerId: string;
	email?: string | null;
	name?: string | null;
	avatar?: string | null;
}

export const getGoogleAuthUrl = (state: string): string => {
	const params = new URLSearchParams({
		client_id: process.env.GOOGLE_CLIENT_ID!,
		redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
		response_type: 'code',
		scope: 'openid email profile',
		state,
	});
	return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
};

export const getGoogleProfile = async (code: string): Promise<OAuthProfile> => {
	const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
		code,
		client_id: process.env.GOOGLE_CLIENT_ID,
		client_secret: process.env.GOOGLE_CLIENT_SECRET,
		redirect_uri: process.env.GOOGLE_REDIRECT_URI,
		grant_type: 'authorization_code',
	});

	const { access_token } = tokenRes.data;
	const userRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
		headers: { Authorization: `Bearer ${access_token}` },
	});

	return {
		providerId: userRes.data.id,
		email: userRes.data.email,
		name: userRes.data.name,
		avatar: userRes.data.picture,
	};
};

export const getLineAuthUrl = (state: string): string => {
	const params = new URLSearchParams({
		response_type: 'code',
		client_id: process.env.LINE_CLIENT_ID!,
		redirect_uri: process.env.LINE_REDIRECT_URI!,
		state,
		scope: 'profile openid email',
	});
	return `https://access.line.me/oauth2/v2.1/authorize?${params}`;
};

export const getLineProfile = async (code: string): Promise<OAuthProfile> => {
	const tokenRes = await axios.post(
		'https://api.line.me/oauth2/v2.1/token',
		new URLSearchParams({
			code,
			client_id: process.env.LINE_CLIENT_ID!,
			client_secret: process.env.LINE_CLIENT_SECRET!,
			redirect_uri: process.env.LINE_REDIRECT_URI!,
			grant_type: 'authorization_code',
		}),
		{ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
	);

	const { access_token } = tokenRes.data;
	const userRes = await axios.get('https://api.line.me/v2/profile', {
		headers: { Authorization: `Bearer ${access_token}` },
	});

	let email: string | null = null;
	if (tokenRes.data.id_token) {
		try {
			const payload = JSON.parse(
				Buffer.from(tokenRes.data.id_token.split('.')[1], 'base64').toString()
			);
			email = payload.email ?? null;
		} catch {
			// noop
		}
	}

	return {
		providerId: userRes.data.userId,
		email,
		name: userRes.data.displayName,
		avatar: userRes.data.pictureUrl,
	};
};

export const getFacebookAuthUrl = (state: string): string => {
	const params = new URLSearchParams({
		client_id: process.env.FACEBOOK_CLIENT_ID!,
		redirect_uri: process.env.FACEBOOK_REDIRECT_URI!,
		state,
		scope: 'email,public_profile',
	});
	return `https://www.facebook.com/v19.0/dialog/oauth?${params}`;
};

export const getFacebookProfile = async (code: string): Promise<OAuthProfile> => {
	const tokenRes = await axios.get('https://graph.facebook.com/v19.0/oauth/access_token', {
		params: {
			client_id: process.env.FACEBOOK_CLIENT_ID,
			client_secret: process.env.FACEBOOK_CLIENT_SECRET,
			redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
			code,
		},
	});

	const { access_token } = tokenRes.data;
	const userRes = await axios.get('https://graph.facebook.com/me', {
		params: {
			fields: 'id,name,email,picture.type(large)',
			access_token,
		},
	});

	return {
		providerId: userRes.data.id,
		email: userRes.data.email ?? null,
		name: userRes.data.name,
		avatar: userRes.data.picture?.data?.url ?? null,
	};
};
