#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Accounts, AccountId, Env};

fn setup_test() -> (AccountId, ContractClient) {
    let env = Env::default();
    let contract_id = env.register_contract(None, Contract);
    let client = ContractClient::new(&env, &contract_id);

    let admin = env.accounts().generate();
    client.with_source_account(&admin).init();
    (admin, client)
}

fn hash_str(env: &Env, s: &str) -> BytesN<32> {
    let bytes = Bytes::from_slice(env, s.as_bytes());
    env.crypto().sha256(&bytes)
}

fn random_address(env: &Env) -> Address {
    let user = env.accounts().generate();
    Address::Account(user)
}

#[test]
fn init_test() {
    let (admin, client) = setup_test();
    let root_node = client.t_get(&empty_hash(&client.env)).unwrap();

    // Check root node defaults
    assert_eq!(root_node.owner, Address::Account(admin));
    assert_eq!(root_node.p_hash, empty_hash(&client.env));
}

#[test]
fn create_root_test() {
    let (admin, client) = setup_test();
    let user = client.env.accounts().generate();
    let root_str = "xlm";
    let root_namehash = hash_str(&client.env, root_str);
    let epxected_root_hash = append_hash(&client.env, &empty_hash(&client.env), &root_namehash);
    let resolution_addr = random_address(&client.env);

    let root_hash = client.with_source_account(&admin.into()).register(
        &empty_hash(&client.env),
        &root_namehash,
        &Address::Account(user.clone()),
        &resolution_addr,
    );

    assert_eq!(root_hash, epxected_root_hash);
    let node = client.t_get(&root_hash).unwrap();

    assert_eq!(node.owner, Address::Account(user.clone()));
    assert_eq!(node.p_hash, empty_hash(&client.env));

    let resolved_address = client.resolve(&root_hash.clone());
    assert_eq!(resolved_address, resolution_addr);
}
