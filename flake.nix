{
  inputs = {
    fenix = {
      url = "github:nix-community/fenix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    flake-utils.url = "github:numtide/flake-utils";
    naersk = {
      url = "github:nix-community/naersk";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nixpkgs.url = "nixpkgs/nixos-unstable";
  };

   # Copy of example config from https://github.com/nix-community/naersk/tree/master/examples/multi-target
   outputs = { self, fenix, flake-utils, naersk, nixpkgs }:
     flake-utils.lib.eachDefaultSystem (system:
       let
         pkgs = (import nixpkgs) {
           inherit system;
         };

         toolchain = with fenix.packages.${system};
           combine [
             complete.cargo
             complete.rustc
             complete.rust-src
             targets.x86_64-unknown-linux-musl.latest.rust-std
             targets.wasm32-unknown-unknown.latest.rust-std
           ];

         naersk' = naersk.lib.${system}.override {
           cargo = toolchain;
           rustc = toolchain;
         };

         naerskBuildPackage = target: args:
           naersk'.buildPackage (
             args
               // { CARGO_BUILD_TARGET = target; }
               // cargoConfig
           );

         cargoConfig = {
           CARGO_TARGET_X86_64_UNKNOWN_LINUX_MUSL_RUSTFLAGS = "-C target-feature=+crt-static";
         };

       in rec {
         defaultPackage = packages.wasm32-unknown-unknown;

         # For `nix build .#x86_64-unknown-linux-musl`:
         packages.x86_64-unknown-linux-musl = naerskBuildPackage "x86_64-unknown-linux-musl" {
           src = ./.;
           doCheck = true;
           nativeBuildInputs = with pkgs; [ pkgsStatic.stdenv.cc ];
         };

         packages.wasm32-unknown-unknown = naerskBuildPackage "wasm32-unknown-unknown" {
           src = ./.;
           ## Unable to run tests on wasm32: do not do check
           copyBins = false;
           copyLibs = true;
         };

         devShell = pkgs.mkShell (
           {
             inputsFrom = with packages; [ x86_64-unknown-linux-musl ];
             CARGO_BUILD_TARGET = "x86_64-unknown-linux-musl";
             shellHook = ''
                 export PATH=$PATH:~/.cargo/bin
              '';
           } // cargoConfig
         );
       }
   );
}
