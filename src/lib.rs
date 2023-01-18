#![no_std]
use soroban_sdk::{contractimpl, symbol, vec, Env, Symbol, Vec};

pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn hello(env: Env, to: Symbol) -> Vec<Symbol> {
        Vec::from_array(&env, [symbol!("Hello"), to])
    }
}

#[cfg(test)]
mod test {
    use super::{Contract, ContractClient};
    use soroban_sdk::{symbol, vec, Env};

    #[test]
    fn test() {
        let env = Env::default();
        let contract_id = env.register_contract(None, Contract);
        let client = ContractClient::new(&env, &contract_id);

        let words = client.hello(&symbol!("Dev"));
        assert_eq!(
            words,
            vec![&env, symbol!("Hello"), symbol!("Dev"),]
        );
    }
}

