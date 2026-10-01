import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
  data?: unknown;
}

/**
 * Enterprise ApiClient
 * Wraps Playwright APIRequestContext with token injection and typed responses
 */
export class ApiClient {
  private authToken: string | null = null;

  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string
  ) {}

  public setToken(token: string): void {
    this.authToken = token;
  }

  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders,
    };
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  public async get<T>(endpoint: string, options?: RequestOptions): Promise<{ status: number; data: T }> {
    const response = await this.request.get(`${this.baseUrl}${endpoint}`, {
      headers: this.buildHeaders(options?.headers),
      params: options?.params,
    });
    expect(response.ok(), `GET ${endpoint} failed with status ${response.status()}`).toBeTruthy();
    return { status: response.status(), data: (await response.json()) as T };
  }

  public async post<TReq, TRes>(endpoint: string, body: TReq, options?: RequestOptions): Promise<{ status: number; data: TRes }> {
    const response = await this.request.post(`${this.baseUrl}${endpoint}`, {
      headers: this.buildHeaders(options?.headers),
      data: body,
    });
    return { status: response.status(), data: (await response.json()) as TRes };
  }

  public async delete(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.delete(`${this.baseUrl}${endpoint}`, {
      headers: this.buildHeaders(options?.headers),
    });
  }
}
