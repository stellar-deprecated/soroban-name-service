import * as sns from './sns';

test('computing hashes for lists of fragments', async () => {
  const hash1 = await sns.computeHash([]);
  const hash2 = await sns.computeHash(['xlm']);
  const hash3 = await sns.computeHash(['garand', 'xlm']);
  expect(hash1).toBe("0000000000000000000000000000000000000000000000000000000000000000");
  expect(hash2).toBe("f36a874cf293751cd8147729af3cd46c13608be7296ea99cb2cbfd6ee86ade14");
  expect(hash3).toBe("6dc2c0c2fabc7feeaff4be61fd8c52933f8aedd0e33858b8c89989b927e1057a");
});

test('computing hashes for domains', async () => {
  const result = await sns.computeDomainHash("garand.xlm");
  expect(result.label).toBe("garand");
  expect(result.labelHash).toBe("240fe5f59e22a9b370585429970a2ed3e20166d2c19142cc2557ef00439bb59a");
  expect(result.parentHash).toBe("f36a874cf293751cd8147729af3cd46c13608be7296ea99cb2cbfd6ee86ade14");
})

export {};
