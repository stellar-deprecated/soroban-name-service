*** This is an experimental project. It may contains bugs or security issues ***

## How to run
Rust is not required to be installed in the system. You will need [nix](https://nixos.org/download.html) installed.  
To run development shell simply run `nix develop`. Cargo and rust are available inside this shell.  
To make a build run `nix build`. It will create a release wasm file in `result/lib`.  
### Using soroban-cli
Currently, soroban-cli is not accessible in dev shell by default. You will need to install it manually via running in dev shell
`cargo install --locked --version 0.4.0 soroban-cli`. 
Note, that it won't be managed by nix (i.e. it's installed into ~/.cargo/bin/soroban). Adding soroban-cli into your home directory. 
### Using IDE
When using IDE, it's recommended to run it from dev shell. Rust and cargo are in $PATH, so your IDE should be able to pick it up
and work normally. If it doesn't, you can get location of rustc via `which rustc` command inside devshell.
