#![no_std]

use soroban_sdk::{contractimpl, Bytes, BytesN, Env, RawVal, Vec, Symbol, symbol, Address, IntoVal};

pub struct Deployer;

fn deploy(
    env: &Env,
    salt: Bytes,
    wasm_hash: BytesN<32>,
    init_fn: Symbol,
    init_args: Vec<RawVal>,
) -> (BytesN<32>, RawVal) {
    // Deploy the contract using the installed WASM code with given hash.
    let id = env.deployer().with_current_contract(salt).deploy(wasm_hash);
    // Invoke the init function with the given arguments.
    let res: RawVal = env.invoke_contract(&id, &init_fn, init_args);
    // Return the contract ID of the deployed contract and the result of
    // invoking the init result.
    (id, res)
}

// Deploy the contract with the invoker as the admin
#[contractimpl]
impl Deployer {
    pub fn registry(env: Env, salt: Bytes, wasm_hash: BytesN<32>) -> (BytesN<32>, RawVal) {
        let init_fn = symbol!("init");
        let admin: Address = env.invoker();
        let init_fn_args = (admin,).into_val(&env);
        deploy(&env, salt, wasm_hash, init_fn, init_fn_args)
    }

}

mod test;
