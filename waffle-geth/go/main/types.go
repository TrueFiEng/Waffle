package main

import (
	"encoding/hex"
	"math/big"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
)

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

func transactionRequestToCallMsg(msg *TransactionRequest) (*ethereum.CallMsg, error) {
	var callMsg ethereum.CallMsg

	if msg.From != nil {
		callMsg.From = common.HexToAddress(C.GoString(msg.From))
	}
	if msg.To != nil {
		temp := common.HexToAddress(C.GoString(msg.To))
		callMsg.To = &temp
	}
	callMsg.Gas = uint64(msg.Gas)

	gasPrice := C.GoString(msg.GasPrice)
	if gasPrice != "" {
		callMsg.GasPrice = big.NewInt(0)
		callMsg.GasPrice.SetString(gasPrice, 16)
	}

	gasFeeCap := C.GoString(msg.GasFeeCap)
	if gasFeeCap != "" {
		callMsg.GasFeeCap = big.NewInt(0)
		callMsg.GasFeeCap.SetString(gasFeeCap, 16)
	}

	gasTipCap := C.GoString(msg.GasTipCap)
	if gasTipCap != "" {
		callMsg.GasTipCap = big.NewInt(0)
		callMsg.GasTipCap.SetString(gasTipCap, 16)
	}

	if msg.Data != nil {
		data, err := hex.DecodeString(C.GoString(msg.Data)[2:])
		if err != nil {
			return nil, err
		}

		callMsg.Data = data
	}

	return &callMsg, nil
}
