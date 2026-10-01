import { test, expect } from '../../src/fixtures/customFixtures';

interface UserDto {
  id: string;
  name: string;
  email: string;
  role: string;
}

test.describe('Enterprise Users REST API Automation Suite', () => {
  let createdUserId: string;

  test('POST /users - Create new automation user', async ({ apiClient }) => {
    const payload = {
      name: 'Alex Mercer',
      email: `alex.qa.${Date.now()}@enterprise.io`,
      role: 'lead_engineer',
    };

    const response = await apiClient.post<typeof payload, UserDto>('/api/v1/users', payload);
    expect(response.status).toBe(201);
    expect(response.data.id).toBeDefined();
    expect(response.data.name).toBe(payload.name);

    createdUserId = response.data.id;
  });

  test('GET /users/:id - Fetch user by ID and validate schema contract', async ({ apiClient }) => {
    const response = await apiClient.get<UserDto>(`/api/v1/users/${createdUserId}`);
    expect(response.status).toBe(200);
    expect(response.data.id).toBe(createdUserId);
  });

  test('DELETE /users/:id - Clean up user', async ({ apiClient }) => {
    const response = await apiClient.delete(`/api/v1/users/${createdUserId}`);
    expect(response.status()).toBe(204);
  });
});
