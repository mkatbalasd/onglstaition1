test('getExpiration returns next year when current empty', async () => {
  const { getExpiration } = await import('../frontend/src/composables/dateHelpers.js');
  const issue = '2024-01-01';
  const result = getExpiration(issue, '');
  expect(result).toBe('2025-01-01');
});

test('getExpiration keeps existing expiration when provided', async () => {
  const { getExpiration } = await import('../frontend/src/composables/dateHelpers.js');
  const issue = '2024-01-01';
  const result = getExpiration(issue, '2024-12-31');
  expect(result).toBe('2024-12-31');
});
