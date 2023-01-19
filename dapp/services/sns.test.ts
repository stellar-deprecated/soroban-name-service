import * as sns from './sns';

test('computing hashes for domains', async () => {
  // const hash1 = await sns.computeHash(['alex', 'stellar', 'xlm']);
  const hash2 = await sns.computeHash(['xlm']);

  // expect(hash1.length).toBe(hash2.length);
  // expect(hash1).not.toBe(hash2);

  expect(hash2).toBe("f36a874cf293751cd8147729af3cd46c13608be7296ea99cb2cbfd6ee86ade14");

  // expect(hash1).toBe('lalala');
  // expect(await sns.zeroHash()).toBe('000000000000');
});

export {};
