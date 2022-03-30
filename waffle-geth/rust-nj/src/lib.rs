#![allow(non_upper_case_globals)]
#![allow(non_camel_case_types)]
#![allow(non_snake_case)]


mod sys {
    include!(concat!(env!("OUT_DIR"), "/bindings.rs"));
}

use node_bindgen::derive::node_bindgen;
use node_bindgen::core::val::JsEnv;
use node_bindgen::core::val::JsObject;
use node_bindgen::core::NjError;
use node_bindgen::core::JSValue;
use node_bindgen::sys::napi_value;
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

#[node_bindgen]
struct InputStruct {
    pub a: i32,
    pub b: i32,
}

#[node_bindgen]
struct OutputStruct {
    pub sum: i32,
    pub product: i32
}

macro_rules! impl_js_struct {
    ($name:ident, { $($field:ident),+ }) => {
        impl<'a> JSValue<'a> for $name {
            fn convert_to_rust(env: &JsEnv,js_value: napi_value) -> Result<Self,NjError> {
                let obj = JsObject::new(*env, js_value);
                Ok($name {
                    $(
                        $field: obj
                            .get_property(stringify!($field))?
                            .ok_or(NjError::Other(format!("Expected property `{}` on type `{}`", stringify!($field), stringify!($name))))?
                            .as_value()?,
                    )+
                })
            }
        }
    }
}

impl_js_struct!(InputStruct, { a, b });

#[node_bindgen]
#[cfg(feature = "napi")]
fn sumProduct(input: InputStruct) -> OutputStruct {
    unsafe {
        let res = sys::sumProduct(sys::InputStruct {
            A: input.a,
            B: input.b
        });

        OutputStruct {
            sum: res.Sum,
            product: res.Product
        }
    }
}

#[node_bindgen]
#[cfg(feature = "napi")]
fn new_simulator() -> i32 {
    unsafe { sys::newSimulator() }
}

#[node_bindgen]
#[cfg(feature = "napi")]
fn get_block_number(simulator: i32) -> String {
    let res = unsafe { CString::from_raw(sys::getBlockNumber(simulator)) };

    res.into_string().unwrap()
}

#[node_bindgen]
struct TransactionReceipt {
    pub Type: i32,
    pub Status: i64,
    pub CumulativeGasUsed: i64,
    pub TxHash: String,
    pub ContractAddress: String,
    pub GasUsed: i64,
    pub BlockHash: String,
    pub BlockNumber: String,
    pub TransactionIndex: i32,
}

#[node_bindgen]
#[cfg(feature = "napi")]
fn send_transaction(simulator: i32, tx_json: String) -> TransactionReceipt {
    let receipt = unsafe { sys::sendTransaction(simulator, CString::new(tx_json).unwrap().as_ptr() as *mut i8) };
    // TODO: free returned pointer

    TransactionReceipt {
        Type: receipt.Type as i32,
        Status: receipt.Status as i64,
        CumulativeGasUsed: receipt.CumulativeGasUsed as i64,
        TxHash: c_str_to_string(receipt.TxHash),
        ContractAddress: c_str_to_string(receipt.ContractAddress),
        GasUsed: receipt.GasUsed as i64,
        BlockHash: c_str_to_string(receipt.BlockHash),
        BlockNumber: c_str_to_string(receipt.BlockNumber),
        TransactionIndex: receipt.TransactionIndex as i32,
    }
}

fn c_str_to_string(string: *mut ::std::os::raw::c_char) -> String {
    // This is very unsafe and will lead to allocator corruption.
    // https://doc.rust-lang.org/std/ffi/struct.CString.html#method.from_raw
    unsafe { CString::from_raw(string).into_string().unwrap() }
}