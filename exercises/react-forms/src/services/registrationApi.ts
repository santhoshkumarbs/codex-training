import axios, {
  AxiosError,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import { COUNTRY_OPTIONS } from '../constants/countries';
import type {
  CountryOption,
  RegistrationPayload,
  SubmissionReceipt,
  UsernameAvailabilityResult,
} from '../types/registration';

const reservedUsernames = new Set([
  'admin',
  'support',
  'root',
  'stormclaw',
  'emberfang',
]);

const reservedEmails = new Set([
  'existing@example.com',
  'alreadyused@example.com',
  'hello@acme.test',
]);

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function parseBody<T>(body: unknown): T {
  if (typeof body === 'string') {
    return JSON.parse(body) as T;
  }

  return body as T;
}

function createResponse<T>(
  config: InternalAxiosRequestConfig,
  data: T,
  status = 200,
  statusText = 'OK',
): AxiosResponse<T> {
  return {
    data,
    status,
    statusText,
    headers: {},
    config,
  };
}

const adapter: AxiosAdapter = async (config) => {
  const method = config.method?.toLowerCase() ?? 'get';

  if (method === 'get' && config.url === '/api/countries') {
    await wait(150);
    return createResponse(config, COUNTRY_OPTIONS);
  }

  if (method === 'post' && config.url === '/api/check-username') {
    await wait(500);
    const { username } = parseBody<{ username: string }>(config.data);
    const normalized = username.trim().toLowerCase();
    const available = !reservedUsernames.has(normalized);
    const suggestion = available ? undefined : `${normalized}_hq`;

    return createResponse<UsernameAvailabilityResult>(config, {
      available,
      message: available
        ? 'Username is available.'
        : 'That username is already taken.',
      suggestion,
    });
  }

  if (method === 'post' && config.url === '/api/register') {
    await wait(900);
    const payload = parseBody<RegistrationPayload>(config.data);

    if (reservedEmails.has(payload.email.toLowerCase())) {
      return createResponse(
        config,
        { message: 'That email is already in use.' },
        409,
        'Conflict',
      );
    }

    if (reservedUsernames.has(payload.username.toLowerCase())) {
      return createResponse(
        config,
        { message: 'Choose a different username.' },
        409,
        'Conflict',
      );
    }

    const receipt: SubmissionReceipt = {
      reference: `REG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      email: payload.email,
      username: payload.username,
      displayName:
        [payload.firstName, payload.lastName].filter(Boolean).join(' ') ||
        payload.username,
    };

    return createResponse(config, receipt, 201, 'Created');
  }

  return createResponse(config, { message: 'Not found.' }, 404, 'Not Found');
};

const api = axios.create({
  adapter,
});

export async function fetchCountries() {
  const { data } = await api.get<CountryOption[]>('/api/countries');
  return data;
}

export async function checkUsernameAvailability(username: string) {
  const { data } = await api.post<UsernameAvailabilityResult>(
    '/api/check-username',
    {
      username,
    },
  );

  return data;
}

export async function submitRegistration(payload: RegistrationPayload) {
  const response = await api.post<SubmissionReceipt | { message: string }>(
    '/api/register',
    payload,
    {
      validateStatus: () => true,
    },
  );

  if (response.status >= 400) {
    const errorMessage =
      'message' in response.data
        ? response.data.message
        : 'Unable to create the account.';

    throw new AxiosError(
      errorMessage,
      undefined,
      response.config,
      undefined,
      response,
    );
  }

  return response.data as SubmissionReceipt;
}
