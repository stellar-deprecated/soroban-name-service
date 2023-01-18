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
       /* 
    function to check it the invoker is authorzed to act on a record
    fn auth_check(node) -> Boolean {
        check invoker == node.owner
        else tree_check (node.p_hash) 
    }
    function to trace p_hash back to root looking for authorization - Need a special case for p_hash on the root to end loop.
    fn tree_check(node) -> Boolean {
        while node.p_hash != <special case> 
    }
    function to read the owner of a record
    pub fn owner(node) -> address{

    }
    
    function to read the resolver of a record
    pub fn resolver(node) -> address{

    }
    function to create a new record args: parent hash, label hash, owner of record to be created, resolver for record to be created. 
    pub fn createNode(p_hash,leaf_hash,owner,resolver) {
       if auth_check (p_hash) 
       then create new map entry with label appned_hash(p_hash,leaf_hash) and owner = owner and resolver = resolver
    }


    */
}

mod test;
