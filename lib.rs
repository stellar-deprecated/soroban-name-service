#![no_std]

use soroban_sdk::{contractimpl, symbol, Env, Symbol, Address, BytesN};

pub struct Contract;  
  
const OWNER: Symbol = symbol!("owner");
const RESOLVER: Symbol = symbol!("resolver");
const URL: Symbol = symbol!("url");
  
#[contractimpl]  
impl Contract {  
	pub fn init(env: Env, owner: Address, resolver: Address, url:BytesN<32>) {  
		env.storage().set(OWNER, owner); 
		env.storage().set(RESOLVER, resolver);
		env.storage().set(URL, url);
		}  
pub fn owner(env: Env) -> Address{  
env.storage().get_unchecked(OWNER).unwrap()  
}  
pub fn resolver(env: Env) -> Address {  
env.storage().get_unchecked(RESOLVER).unwrap()  
}  
pub fn url(env: Env) -> BytesN<32> {  
env.storage().get_unchecked(URL).unwrap()  
}  

pub fn update (env: Env, owner: Address, resolver: Address, url:BytesN<32>) { 
		if auth_check(&env) {
			env.storage().set(OWNER, owner); 
			env.storage().set(RESOLVER, resolver);
			env.storage().set(URL, url);
         }
		 
fn auth_check (env: &Env) -> bool {
	let caller: Address = env.storage().get_unchecked(OWNER).unwrap();
	if caller == env.invoker() {
		true; 
	}
	return false;	

}		

}
	
		}
