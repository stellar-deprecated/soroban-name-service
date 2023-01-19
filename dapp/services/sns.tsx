const { subtle } = require('crypto').webcrypto;
interface HashedDomain {
  label?: string;
  labelHash?: string;
  parentHash?: string;
}

async function createLookupDomainTx(domain: string) {
  const {parentHash, labelHash} = await computeHashedDomain(domain);
}

export async function computeHashedDomain(domain: string): Promise<HashedDomain> {
  const fragments = domain.split(".");

  if (fragments.length == 0) {
     return {};
  }
  const label: string = fragments.shift() || '';
  const labelHash = await hash(label);

  return {
    label,
    labelHash,
    parentHash: await computeHash(fragments),
  }
}

export async function computeHash(fragments: Array<string>): Promise<string> {
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
    return await hash(await hash(fragments[0]) + zeroHash());
  }

  const node = fragments.shift() || '';
  return await hash(await hash(node) + computeHash(fragments));
}

function zeroHash(): string {
  return "0000000000000000000000000000000000000000000000000000000000000000";
}

async function hash(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

function createRegisterDomainTx() {

}
