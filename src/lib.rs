#![no_std]

use soroban_sdk::{contractimpl, contracttype, symbol, vec, Env, Symbol, Vec, map, Map, BytesN, Address};

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

#[cfg(test)]
mod test {
    use super::{Contract, ContractClient};
    use soroban_sdk::{symbol, vec, Env};

    #[test]
    fn init_not_throws() {
        let env = Env::default();
        let contract_id = env.register_contract(None, Contract);
        let client = ContractClient::new(&env, &contract_id);

        client.init();

        let map = client.get_map();
    }
}

