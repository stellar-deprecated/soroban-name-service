#![cfg(test)]

use super::*;
use soroban_sdk::{Env};

    #[test]
    fn init_not_throws() {
        let env = Env::default();
        let contract_id = env.register_contract(None, Contract);
        let client = ContractClient::new(&env, &contract_id);

        client.init();

        let _ = client.get_map();
    }