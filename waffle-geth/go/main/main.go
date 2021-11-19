package main

import "C"
import (
	"context"
	"encoding/hex"
	"encoding/json"
	"log"
	"math/big"
	"math/rand"
	"strconv"
	"time"

	"github.com/Ethworks/Waffle/simulator"
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
)

type TransactionRequest struct {
	To    *string `json:"to"`
	From  *string `json:"from"`
	Nonce *string `json:"nonce"`

	GasLimit *string `json:"gasLimit"`
	GasPrice *string `json:"gasPrice"`

	Data    *string `json:"data"`
	Value   *string `json:"value"`
	ChainId *uint64 `json:"chainId"`
}

func main() {}

var sim, _ = simulator.NewSimulator()

//export getBlockNumber
func getBlockNumber() *C.char {
	bn := sim.GetLatestBlockNumber()
	return C.CString(bn.String())
}

//export getChainID
func getChainID() *C.char {
	cid := sim.GetChainID()
	return C.CString(cid.String())
}

//export getCode
func getCode(account *C.char) *C.char {
	code, err := sim.Backend.CodeAt(context.Background(), common.HexToAddress(C.GoString(account)), nil)
  if err != nil {
		log.Fatal(err)
	}

  return C.CString(common.Bytes2Hex(code))
}

//export getBalance
func getBalance(account *C.char) *C.char {
	bal, err := sim.Backend.BalanceAt(context.Background(), common.HexToAddress(C.GoString(account)), nil)
	if err != nil {
		log.Fatal(err)
	}

	return C.CString(bal.String())
}

//export getTransactionCount
func getTransactionCount(account *C.char) C.int {
	count, err := sim.Backend.NonceAt(context.Background(), common.HexToAddress(C.GoString(account)), nil)
	if err != nil {
		log.Fatal(err)
	}

	return C.int(count)
}

//export call
func call(msgJson *C.char) *C.char {
	var msg TransactionRequest

	err := json.Unmarshal([]byte(C.GoString(msgJson)), &msg)
	if err != nil {
		log.Fatal(err)
	}

	var callMsg ethereum.CallMsg

	if msg.From != nil {
		callMsg.From = common.HexToAddress(*msg.From)
	}
	if msg.To != nil {
		temp := common.HexToAddress(*msg.To)
		callMsg.To = &temp
	}
	if msg.GasLimit != nil {
		value, err := strconv.ParseUint(*msg.GasLimit, 16, 64)
		if err != nil {
			log.Fatal(err)
		}

		callMsg.Gas = value
	}
	if msg.GasPrice != nil {
		callMsg.GasPrice = big.NewInt(0)
		callMsg.GasPrice.SetString(*msg.GasPrice, 16)
	}
	if msg.Data != nil {
		data, err := hex.DecodeString((*msg.Data)[2:])
		if err != nil {
			log.Fatal(err)
		}

		callMsg.Data = data
	}

	res, err := sim.Backend.CallContract(context.Background(), callMsg, nil)
	if err != nil {
		log.Fatal(err)
	}

	return C.CString(hex.EncodeToString(res))
}

//export sendTransaction
func sendTransaction(txData *C.char) *C.char {

	bytes, err := hex.DecodeString(C.GoString(txData)[2:])
	if err != nil {
		log.Fatal(err)
	}

	tx := &types.Transaction{}
	err = tx.UnmarshalBinary(bytes)
	if err != nil {
		log.Fatal(err)
	}

	err = sim.Backend.SimulatedBackend.SendTransaction(context.Background(), tx)
	if err != nil {
		log.Fatal(err)
	}

	sim.Backend.Commit()

	receipt, err := sim.Backend.SimulatedBackend.TransactionReceipt(context.Background(), tx.Hash())
	if err != nil {
		log.Fatal(err)
	}

  receiptJson, err := json.Marshal(receipt)
  if err != nil {
    log.Fatal(err)
  }

  return C.CString(string(receiptJson))
}

//export cgoCurrentMillis
func cgoCurrentMillis() C.long {
	return C.long(time.Now().Unix())
}

//export cgoSeed
func cgoSeed(m C.long) {
	rand.Seed(int64(m))
}

//export cgoRandom
func cgoRandom(m C.int) C.int {
	return C.int(rand.Intn(int(m)))
}
