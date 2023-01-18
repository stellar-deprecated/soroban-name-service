#![no_std]

use soroban_sdk::{
    contracterror, contractimpl, contracttype, map, Address, Bytes, BytesN, Env, Map,
};

pub struct Contract;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    // Resolution errors
    InvalidHashInput = 1,
    NotFound = 2,
    // Registration errors
    ParentNotFound = 3,
    NotAuthorized = 4,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    RMap,
}

#[contracttype]
pub struct Node {
    pub owner: Address,
    pub p_hash: BytesN<32>,
    pub res_addr: Address,
}

fn get_map(env: &Env) -> Map<BytesN<32>, Node> {
    return env.storage().get_unchecked(DataKey::RMap).unwrap();
}

// Checks if caller owns node or any of node's parents
fn auth_check(env: &Env, node: &Node) -> bool {
    if node.owner == env.invoker() {
        return true;
    }

    // If parent hash is empty, current node mut be root node
    let parent_hash = node.p_hash.clone();
    if parent_hash.is_empty() {
        return false;
    }

    let map = get_map(env);
    let parent_node = map.get(parent_hash).unwrap().unwrap();
    auth_check(env, &parent_node)
}

fn append_hash(env: &Env, parent_hash: &BytesN<32>, leaf_hash: &BytesN<32>) -> BytesN<32> {
    let mut bytes = Bytes::new(env);
    bytes.append(&leaf_hash.clone().into());
    bytes.append(&parent_hash.clone().into());
    env.crypto().sha256(&bytes)
}

#[contractimpl]
impl Contract {
    pub fn init(env: Env) {
        if env.storage().has(DataKey::RMap) {
            panic!("Contract already initialized")
        }

        let mut map: Map<BytesN<32>, Node> = map![&env];

        // Root node is empty hash, owned by contract initializer
        map.set(
            BytesN::from_array(&env, &[0; 32]),
            Node {
                owner: env.invoker(),
                p_hash: BytesN::from_array(&env, &[0; 32]),
                res_addr: env.invoker(), // This should be empty but I don't know how to default init Address
            },
        );

        env.storage().set(DataKey::RMap, map)
    }

    // Given a nameHash, returns the associated address
    pub fn resolve(env: Env, hash: BytesN<32>) -> Result<Address, Error> {
        // Should not support empty queries, even if "technically" possible with initial root node
        if hash.is_empty() {
            return Err(Error::InvalidHashInput);
        }

        let map = get_map(&env);
        match map.get(hash) {
            Some(node) => Ok(node.unwrap().res_addr),
            None => Err(Error::NotFound),
        }
    }

    pub fn map_test(env: Env) -> Map<BytesN<32>, Node> {
        get_map(&env)
    }

    // Registers subdomain under parent node
    pub fn register(
        env: Env,
        parent_hash: BytesN<32>,
        leaf_hash: BytesN<32>,
        owner: Address,
        res_addr: Address,
    ) -> Result<BytesN<32>, Error> {
        let mut map = get_map(&env);

        // Check if parent hash exists
        let parent_node = match map.get(parent_hash.clone()) {
            Some(node) => node.unwrap(),
            None => return Err(Error::ParentNotFound),
        };

        // Check if invoker is authorized to create subdomain
        if !auth_check(&env, &parent_node) {
            return Err(Error::NotAuthorized);
        }

        // Insert new node
        let key = append_hash(&env, &parent_hash, &leaf_hash);
        map.set(
            key.clone(),
            Node {
                owner: owner,
                p_hash: parent_hash,
                res_addr,
            },
        );

        Ok(key)
    }

    pub fn set_owner(env: Env, hash: BytesN<32>, new_owner: Address) -> Result<BytesN<32>, Error> {
        let mut map = get_map(&env);

        // Check if hash exists
        let node = match map.get(hash.clone()) {
            Some(res) => res.unwrap(),
            None => return Err(Error::InvalidHashInput),
        };

        // Check if invoker is authorized to edit the owner
        if !auth_check(&env, &node) {
            return Err(Error::NotAuthorized);
        }

        map.set(
            hash.clone(),
            Node {
                owner: new_owner,
                p_hash: node.p_hash,
                res_addr: node.res_addr,
            },
        );

        Ok(hash.clone())
    }

    pub fn set_res(env: Env, hash: BytesN<32>, new_resolv: Address) -> Result<BytesN<32>, Error> {
        let mut map = get_map(&env);

        // Check if hash exists
        let node = match map.get(hash.clone()) {
            Some(res) => res.unwrap(),
            None => return Err(Error::InvalidHashInput),
        };

        // Check if invoker is authorized to edit the resolver
        if !auth_check(&env, &node) {
            return Err(Error::NotAuthorized);
        }

        map.set(
            hash.clone(),
            Node {
                owner: node.owner,
                p_hash: node.p_hash,
                res_addr: new_resolv,
            },
        );

        Ok(hash.clone())
    }
}

mod test;
