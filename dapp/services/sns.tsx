const { subtle } = require('crypto').webcrypto;
interface HashedDomain {
  label?: string;
  labelHash?: string;
  parentHash?: string;
}

// async function createLookupDomainTx(domain: string) {
//   const {parentHash, labelHash} = await computeHashedDomain(domain);
// }

// export async function computeHashedDomain(domain: string): Promise<HashedDomain> {
//   const fragments = domain.split(".");

//   const binaryFragments =

//   map((fragment) =>
//     (new TextEncoder().encode(fragment)));

//   if (fragments.length == 0) {
//      return {};
//   }
//   const label: string = fragments.shift() || '';
//   const labelHash = await hash(label);

//   return {
//     label,
//     labelHash,
//     parentHash: await computeHash(fragments),
//   }
// }

export async function computeHash(fragments: Array<string>): Promise<string> {
  const binFragments = fragments.map((f) => (new TextEncoder().encode(f)));
  const binHash = await computeBinaryHash(binFragments);
  const hashHex = binHash.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function computeBinaryHash(binFragments: Array<Uint8Array>): Promise<Array<number>> {
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

  if (binFragments.length == 1) {
    return await hash(
      new Uint8Array(
        [...await hash(binFragments[0]), ...emptyHash()]
      ))
  } else {
    const node = binFragments.shift() || new Uint8Array();
    return await hash(
      new Uint8Array(
        [...await hash(node), ...await computeBinaryHash(binFragments)]
      ));
  }
}

export function emptyHash(): Array<number> {
  return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

async function hash(message: Uint8Array): Promise<Array<number>> {
  const hashBuffer = await subtle.digest('SHA-256', message);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray;
}

function createRegisterDomainTx() {

}
