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

test('toGregorian converts hijri date to gregorian', async () => {
  const { toGregorian } = await import('../frontend/src/composables/dateHelpers.js');
  const result = toGregorian('1445-01-01');
  expect(result).toBe('2023-07-19');
});

test('addYear handles hijri dates', async () => {
  const { addYear } = await import('../frontend/src/composables/dateHelpers.js');
  const result = addYear('1445-01-01');
  expect(result).toBe('2024-07-19');
});
