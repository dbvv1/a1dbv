fn main() {
    let source = ".work/ex_game.rs";
    println!("cargo:rerun-if-changed={source}");
    let destination =
        std::path::PathBuf::from(std::env::var("OUT_DIR").unwrap()).join("ex_game.rs");
    std::fs::copy(source, destination)
        .expect("missing official sample: run python3 prepare.py first");
}
