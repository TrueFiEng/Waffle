package main

// #cgo darwin LDFLAGS: -Wl,-undefined,dynamic_lookup
// #include "node_api.h"
import "C"
import "unsafe"

type napi_module = C.napi_module

type napi_env = C.napi_env

type napi_value = C.napi_value

func main() {
}

//export _register_wafflegeth
func _register_wafflegeth() {
	var module = napi_module{
		// C.NAPI_MODULE_VERSION,
		// 0,
		// C.CString("waffle-geth/go/main.go"),
		// register,
		// C.CString("waffle-geth"),
		// nil,
	}

	C.napi_module_register((*C.napi_module)(unsafe.Pointer(&module)))
}

func register(env napi_env, exports napi_value) napi_value {
	return nil
}
