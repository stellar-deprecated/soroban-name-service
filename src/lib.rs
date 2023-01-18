#![no_std]

use soroban_sdk::{contractimpl, contracttype, Env, map, Map, BytesN, Address, Bytes};

pub struct Contract;

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    RMap
}

#[contracttype]
pub struct Node {
    pub owner: Address,
    pub p_hash: BytesN<32>,
    pub res_addr: Address
}

#[contractimpl]
impl Contract {

    fn append_hash(env: &Env, parent_hash: &BytesN<32>, leaf_hash: &BytesN<32>) -> BytesN<32> {
        let mut bytes = Bytes::new(env);
        bytes.append(&leaf_hash.clone().into());
        bytes.append(&parent_hash.clone().into());
        env.crypto().sha256(&bytes)
    }

    pub fn init(env: Env) {
        if env.storage().has(DataKey::RMap) {
            panic!("Contract already initialized")
        }

        let map: Map<BytesN<32>, Node> = map![&env];

        env.storage().set(DataKey::RMap, map)
    }

    pub fn get_map(env: Env) -> Map<BytesN<32>, Node> {
        return env.storage().get_unchecked(DataKey::RMap).unwrap()
    }
}

mod test;