import * as sns from './sns';

test('computing hashes for domains', () => {
  const hash = sns.computeHash(['alex', 'stellar', 'xlm']);
  expect(hash).toBe('lalala');
});

export {};
