import ky from 'ky';

const prefixUrl = `${process.env.API_URL ? process.env.API_URL : ''}/`;
const prefixUrlGCP = 'https://us-central1-aiplatform.googleapis.com/v1/';

let authToken = '';

export const setAuthToken = token => {
	authToken = token;
};

export const instance = ky.extend({
	prefixUrl,
	headers: {
		Accept: 'application/json',
	},
});

export const instanceGCP = ky.extend({
	prefixUrl: prefixUrlGCP,
	timeout: 30000,
	headers: {
		Accept: 'application/json',
	},
	hooks: {
		beforeRequest: [
			request => {
				if (authToken) {
					request.headers.set('Authorization', `Bearer ${authToken}`);
				}
			},
		],
	},
});
