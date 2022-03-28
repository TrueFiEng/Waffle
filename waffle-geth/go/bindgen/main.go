package main

import (
	"fmt"
	"reflect"
)

type TransactionRequest struct {
	To    *string `bind:"to"`
	From  *string `bind:"from"`
	Nonce *string `bind:"nonce"`

	GasLimit *string `bind:"gasLimit"`
	GasPrice *string `bind:"gasPrice"`

	Data    *string `bind:"data"`
	Value   *string `bind:"value"`
	ChainId *uint64 `bind:"chainId"`
}

func main() {
	name := reflect.TypeOf(TransactionRequest{}).Name()
	
	fmt.Println()
}

