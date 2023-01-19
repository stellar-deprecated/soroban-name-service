#![cfg(test)]
extern crate std;

use super::*;
use crate::Error::*;
use soroban_sdk::{testutils::Accounts, AccountId, Env};
use std::println;

fn setup_test() -> (AccountId, ContractClient) {
    let env = Env::default();
    let contract_id = env.register_contract(None, Contract);
    let client = ContractClient::new(&env, &contract_id);

    let admin = env.accounts().generate();
    client.with_source_account(&admin).init(&(Address::Account(admin.clone())));
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
    assert_eq!(
        root_node.res_addr,
        Address::Contract(empty_hash(&client.env))
    );
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
    assert_eq!(node.res_addr, resolution_addr);

    let resolved_address = client.resolve(&root_hash.clone());
    assert_eq!(resolved_address, resolution_addr);
}

#[test]
fn not_authorized_cant_register() {
    let (_, client) = setup_test();
    let user = client.env.accounts().generate();
    let root_namehash = hash_str(&client.env, "xlm");

    let result = client
        .with_source_account(&user.clone().into())
        .try_register(
            &empty_hash(&client.env),
            &root_namehash,
            &Address::Account(user.clone()),
            &random_address(&client.env),
        );

    assert_eq!(result, Err(Ok(NotAuthorized)))
}

#[test]
fn wrong_root_cant_register() {
    let (_, client) = setup_test();
    let user = client.env.accounts().generate();
    let root_namehash = hash_str(&client.env, "xlm");

    let result = client
        .with_source_account(&user.clone().into())
        .try_register(
            &root_namehash,
            &root_namehash,
            &Address::Account(user.clone()),
            &random_address(&client.env),
        );

    assert_eq!(result, Err(Ok(ParentNotFound)))
}

#[test]
fn create_subdomains() {
    let (admin, client) = setup_test();
    let user = client.env.accounts().generate();
    let root_namehash = hash_str(&client.env, "xlm");
    let resolution_addr = random_address(&client.env);

    let root_hash = client.with_source_account(&admin.clone().into()).register(
        &empty_hash(&client.env),
        &root_namehash,
        &Address::Account(user.clone()),
        &resolution_addr,
    );

    let test_namehash = hash_str(&client.env, "test");
    let foo_namehash = hash_str(&client.env, "foo");

    // Register xlm.foo authorized by xlm owner
    let foo_addr = random_address(&client.env);
    let foo_hash = client.with_source_account(&user.clone().into()).register(
        &root_hash,
        &foo_namehash,
        &Address::Account(user.clone()),
        &foo_addr,
    );

    let expected_foo_namehash = append_hash(&client.env, &root_hash, &foo_namehash);
    assert_eq!(foo_hash, expected_foo_namehash);

    let resolved_foo_address = client.resolve(&expected_foo_namehash);
    assert_eq!(resolved_foo_address, foo_addr);

    // Register xlm.test authorized by contract owner
    let test_addr = random_address(&client.env);
    let test_hash = client.with_source_account(&admin.clone().into()).register(
        &root_hash,
        &test_namehash,
        &Address::Account(user.clone()),
        &test_addr,
    );

    let expected_test_namehash = append_hash(&client.env, &root_hash, &test_namehash);
    assert_eq!(test_hash, expected_test_namehash);

    let resolved_test_address = client.resolve(&expected_test_namehash);
    assert_eq!(resolved_test_address, test_addr);
}

#[test]
fn empty_hash_lookup_fails() {
    let (_, client) = setup_test();
    let result = client.try_resolve(&empty_hash(&client.env));
    assert_eq!(result, Err(Ok(InvalidHashInput)))
}

#[test]
fn wrong_hash_lookup_fails() {
    let (_, client) = setup_test();
    let result = client.try_resolve(&hash_str(&client.env, "xlm"));
    assert_eq!(result, Err(Ok(NotFound)))
}

#[test]
#[should_panic(expected = "Contract already initialized")]
fn panic_if_initialized_twice() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Contract);
    let client = ContractClient::new(&env, &contract_id);

    let admin = env.accounts().generate();
    client.with_source_account(&admin).init();
    client.with_source_account(&admin).init();
}

#[test]
#[should_panic(expected = "Contract not initialized")]
fn panic_if_unitialized_register() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Contract);
    let client = ContractClient::new(&env, &contract_id);

    let admin = env.accounts().generate();
    let _ = client.with_source_account(&admin.clone().into()).register(
        &empty_hash(&client.env),
        &empty_hash(&client.env),
        &Address::Account(admin.clone()),
        &Address::Account(admin.clone()),
    );
}

#[test]
#[should_panic(expected = "Contract not initialized")]
fn panic_if_unitialized_resolve() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Contract);
    let client = ContractClient::new(&env, &contract_id);

    let admin = env.accounts().generate();
    let _ = client
        .with_source_account(&admin.clone().into())
        .resolve(&empty_hash(&client.env));
}

#[test]
fn print_hashes() {
    let (_, client) = setup_test();

    let empty_h = empty_hash(&client.env);
    println!("{:x?}", empty_h.to_array());

    let xlm_hash = hash_str(&client.env, "xlm");
    let xlm_path_hash = append_hash(&client.env, &empty_h, &xlm_hash);
    println!("{:x?}", xlm_path_hash.to_array());

    let garand_hash = hash_str(&client.env, "garand");
    let garand_path_hash = append_hash(&client.env, &xlm_path_hash, &garand_hash);
    println!("{:x?}", garand_path_hash.to_array());
}
