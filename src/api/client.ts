import { type ApiClientOptions, type ApiResponse, HttpStatus, type IAuthenticator } from './types.js';
import type { ILogger } from '../logger/types.js';
import type { SessionManager } from '../session/manager.js';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
    method: HttpMethod;
    body: unknown | null;
}

export class ApiClient {
    private readonly baseUrl: string;
    private readonly session: SessionManager;
    private readonly logger: ILogger;
    private authenticator: IAuthenticator | null = null;

    constructor(options: ApiClientOptions) {
        this.baseUrl = options.baseUrl;
        this.session = options.session;
        this.logger = options.logger;
    }

    setAuthenticator(authenticator: IAuthenticator): void {
        this.authenticator = authenticator;
    }

    /**
     * Low-level request without auth. Use for public endpoints (SIWE nonce/verify, device flow).
     */
    async request<T>(path: string, options: RequestOptions | null = null): Promise<ApiResponse<T>> {
        return this.send<T>(path, options?.method ?? 'GET', options?.body ?? null, null);
    }

    /**
     * Request with a `Authorization: Bearer <jwt>` header. The token is obtained from the
     * authenticator (which (re-)logs in when missing/expired). On a 401 the authenticator is
     * asked to re-authenticate and the request is retried exactly once.
     */
    async authenticatedRequest<T>(path: string, options: RequestOptions | null = null): Promise<ApiResponse<T>> {
        if (!this.authenticator) {
            throw new Error('ApiClient: no authenticator configured for authenticated requests');
        }

        const method = options?.method ?? 'GET';
        const body = options?.body ?? null;

        const token = await this.authenticator.getAccessToken();
        const first = await this.send<T>(path, method, body, { Authorization: `Bearer ${token}` });

        if (first.status !== HttpStatus.Unauthorized) {
            return first;
        }

        this.logger.warn('authenticated request got 401 — re-authenticating and retrying once', { path });
        const fresh = await this.authenticator.reauthenticate();
        return this.send<T>(path, method, body, { Authorization: `Bearer ${fresh}` });
    }

    private async send<T>(
        path: string,
        method: HttpMethod,
        body: unknown | null,
        extraHeaders: Record<string, string> | null,
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseUrl}${path}`;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(extraHeaders ?? {}),
        };

        const init: RequestInit = { method, headers };

        if (body !== undefined && body !== null) {
            init.body = JSON.stringify(body);
        }

        this.logger.debug('api request', { method, path });

        const response = await fetch(url, init);
        const data = (await response.json()) as T;

        this.logger.debug('api response', { method, path, status: response.status });

        return { status: response.status, data };
    }

    getBaseUrl(): string {
        return this.baseUrl;
    }

    getSession(): SessionManager {
        return this.session;
    }
}
