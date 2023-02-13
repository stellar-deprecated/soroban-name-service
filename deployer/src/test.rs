#![cfg(test)]

use crate::{Deployer, DeployerClient};
use soroban_sdk::{testutils::Accounts, Bytes, BytesN, Env, Address};

// The contract that will be deployed by the deployer contract.
mod contract {
    soroban_sdk::contractimport!(
        file = "../target/wasm32-unknown-unknown/release/soroban_name_service.wasm"
    );
}

#[test]
fn test() {
    let env = Env::default();
    let deployer = DeployerClient::new(&env, &env.register_contract(None, Deployer));

    // Install the WASM code to be deployed from the deployer contract.
    let wasm_hash = env.install_contract_wasm(contract::WASM);

    // Deploy contract using deployer, and include an init function to call.
    let salt = Bytes::from_array(&env, &[0; 32]);
    let admin = env.accounts().generate();
    let (contract_id, init_result) = deployer.with_source_account(&admin).registry(&salt, &wasm_hash);
    assert!(init_result.is_void());

    // Invoke contract to check that it is initialized.
    let client = contract::Client::new(&env, &contract_id);
    let empty_hash = BytesN::from_array(&env, &[0; 32]);
    let root_own = client.get_owner(&empty_hash);
    assert!(root_own.eq(&Address::Account(admin)));
}
