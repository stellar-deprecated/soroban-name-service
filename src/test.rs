#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Accounts, Env};

#[test]
fn init_not_throws() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Contract);
    let client = ContractClient::new(&env, &contract_id);

    let admin = env.accounts().generate();
    client.with_source_account(&admin).init();

    let map = client.map_test();
    let root_node = map
        .get(BytesN::from_array(&env, &[0; 32]))
        .unwrap()
        .unwrap();

    // Check root node defaults
    assert_eq!(root_node.owner, Address::Account(admin));
    assert_eq!(root_node.p_hash, BytesN::from_array(&env, &[0; 32]));
}
