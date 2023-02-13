const { subtle } = require('crypto').webcrypto;
interface DomainHash {
  label?: string;
  labelHash?: string;
  parentHash?: string;
}

// Public Functions:

export function createRegisterDomainTx() {
  // TODO
}

export function createLookupDomainTx(domain: string) {
  // TODO
}

export async function computeDomainHash(domain: string): Promise<DomainHash> {
  const fragments = domain.split('.');
  const label = fragments.shift() || '';

  return {
    label,
    labelHash: hexDigestHash(await sha256digest(stringToUint8Array(label))),
    parentHash: await computeHash(fragments)
  }
}


// Internal functions:

export async function computeHash(fragments: Array<string>): Promise<string> {
  const binFragments = fragments.map((f) => (stringToUint8Array(f)));
  const binHash = await computeRecursiveHash(binFragments);
  return hexDigestHash(binHash);
}

async function computeRecursiveHash(binFragments: Array<Uint8Array>): Promise<Array<number>> {
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
  if (binFragments.length == 0) {
    return emptyHash()
  }
  if (binFragments.length == 1) {
    return await sha256digest(
      new Uint8Array(
        [...await sha256digest(binFragments[0]), ...await computeRecursiveHash(new Array)]
      ))
  } else {
    const node = binFragments.shift() || new Uint8Array();
    return await sha256digest(
      new Uint8Array(
        [...await sha256digest(node), ...await computeRecursiveHash(binFragments)]
      ));
  }
}

async function sha256digest(message: Uint8Array): Promise<Array<number>> {
  const hashBuffer = await subtle.digest('SHA-256', message);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray;
}

function emptyHash(): Array<number> {
  return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

function stringToUint8Array(message: string): Uint8Array {
  return new TextEncoder().encode(message);
}

function hexDigestHash(binHash: Array<number>) {
  return binHash.map((b) => b.toString(16).padStart(2, '0')).join('');
}
