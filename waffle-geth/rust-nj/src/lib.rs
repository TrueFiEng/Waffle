#![allow(non_upper_case_globals)]
#![allow(non_camel_case_types)]
#![allow(non_snake_case)]


mod sys {
    include!(concat!(env!("OUT_DIR"), "/bindings.rs"));
}

use node_bindgen::derive::node_bindgen;
use std::ffi::CString;

/// add two integer
#[node_bindgen]
#[cfg(feature = "napi")]
fn sum(first: i32, second: i32) -> i32 {
    first + second
}

/// cgoCurrentMillis
#[node_bindgen]
#[cfg(feature = "napi")]
fn cgoCurrentMillis() -> i64 {
    unsafe { sys::cgoCurrentMillis() }
}

/// toUpper
#[node_bindgen]
#[cfg(feature = "napi")]
fn toUpper(s: String) -> String {

    // This is very unsafe and will lead to allocator corruption.
    // https://doc.rust-lang.org/std/ffi/struct.CString.html#method.from_raw
    let res = unsafe { CString::from_raw(sys::toUpper(CString::new(s).unwrap().as_ptr() as *mut i8)) };

    res.into_string().unwrap()
}