package main

/*
// C code written here would be compiled together with Go code.

#include "main.h"

*/
import "C"

// Remove
type InputStruct = C.InputStruct
type OutputStruct = C.OutputStruct

type TransactionRequest = C.TransactionRequest
type TransactionReceipt = C.TransactionReceipt
