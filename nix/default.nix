with import <nixpkgs> {};
mkShell {
    name = "noitaseed-dev";
    buildInputs = [ nodejs yarn ];
}
