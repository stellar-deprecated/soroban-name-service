#![cfg(test)]

use crate::{Deployer, DeployerClient};
use soroban_sdk::{testutils::Accounts, contracterror, symbol, Bytes, BytesN, Env, IntoVal, Address};

// The contract that will be deployed by the deployer contract.
mod contract {
    soroban_sdk::contractimport!(
        file = "../target/wasm32-unknown-unknown/release/soroban_name_service.wasm"
    );
}

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

#[test]
fn test() {
    let env = Env::default();
    let client = DeployerClient::new(&env, &env.register_contract(None, Deployer));

    // Install the WASM code to be deployed from the deployer contract.
    let wasm_hash = env.install_contract_wasm(contract::WASM);

    // Deploy contract using deployer, and include an init function to call.
    let salt = Bytes::from_array(&env, &[0; 32]);
    let init_fn = symbol!("init");
    let admin = Address::Account(env.accounts().generate());
    let c_admin = admin.clone();
    let init_fn_args = (admin,).into_val(&env);
    let (contract_id, init_result) = client.deploy(&salt, &wasm_hash, &init_fn, &init_fn_args);
    assert!(init_result.is_void());

    // Invoke contract to check that it is initialized.
    let client = contract::Client::new(&env, &contract_id);
    let empty_hash = BytesN::from_array(&env, &[0; 32]);
    let resolve = client.resolve(&empty_hash);
    assert!(resolve.eq(&c_admin));
}
