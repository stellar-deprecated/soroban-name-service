import * as SorobanClient from 'soroban-client';

interface HashedDomain {
  label?: string;
  labelHash?: string;
  parentHash?: string;
}

function createLookupDomainTx(domain: string) {
  const {parentHash, labelHash} = computeHashedDomain(domain);
}

export function computeHashedDomain(domain: string): HashedDomain {
  const fragments = domain.split(".");

  if (fragments.length == 0) {
     return {};
  }
  const label: string = fragments.shift() || '';
  const labelHash = hash(label);

  return {
    label,
    labelHash,
    parentHash: computeHash(fragments),
  }
}

export function computeHash(fragments: Array<string>): string {
  // Accepts a list of domain fragments and computes the
  // SHA256 hash.
  //
  // For example, the domain: alex.stellar.xlm should be passed
  // as ['alex', 'stellar', 'xlm']
  //
  // So computeHash(['alex', 'stellar', 'xlm'])
  // Will compute:
  // SHA256(
  //     SHA256('alex') + SHA256(
  //         SHA256('stellar') + SHA256(
  //             SHA256('xlm') + SHA256(
  //                 SHA256('0')))))
  if (fragments.length == 1) {
    return hash(hash(fragments[0]) + zeroHash());
  }

  const node = fragments.shift() || '';
  return hash(hash(node) + computeHash(fragments));
}

function zeroHash(): string {
  return hash('0');
}
function hash(data: string): string {
  const buffer = Buffer.from(data, 'utf-8');
  return SorobanClient.StrKey.encodeSha256Hash(buffer);
}

function createRegisterDomainTx() {

}
