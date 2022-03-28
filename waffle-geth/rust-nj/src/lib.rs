#![allow(non_upper_case_globals)]
#![allow(non_camel_case_types)]
#![allow(non_snake_case)]

include!(concat!(env!("OUT_DIR"), "/bindings.rs"));

use node_bindgen::derive::node_bindgen;

/// add two integer
#[node_bindgen]
#[cfg(feature = "napi")]
fn sum(first: i32, second: i32) -> i32 {
    first + second
}