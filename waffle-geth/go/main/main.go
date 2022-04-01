package main

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"strconv"
	"strings"
	"time"

	"github.com/Ethworks/Waffle/simulator"
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
)

/*
// C code written here would be compiled together with Go code.

#include "main.h"

*/
import "C"

func main() {}

var (
	simulators      = make(map[int]*simulator.Simulator)
	nextSimulatorID = 0
)

//export newSimulator
func newSimulator() C.int {
	sim, err := simulator.NewSimulator()
	if err != nil {
		log.Fatal(err)
	}
	id := nextSimulatorID
	simulators[id] = sim
	nextSimulatorID++
	return C.int(id)
}

//export getBlockNumber
func getBlockNumber(simID C.int) *C.char {
	sim := getSimulator(simID)
	bn := sim.GetLatestBlockNumber()
	// TODO: Convert to base 16?
	return C.CString(bn.String())
}

//export getBlock
func getBlock(simID C.int, c_hashOrTag *C.char) *C.char {
	sim := getSimulator(simID)
	hashOrTag := C.GoString(c_hashOrTag)

	var blockHeader *types.Header
	if hashOrTag == "latest" {
		blockHeader = sim.Backend.Blockchain().CurrentHeader()
	} else if strings.HasPrefix(hashOrTag, "0x") && len(hashOrTag) == 66 {
		hash := common.HexToHash(hashOrTag)
		blockHeader = sim.Backend.Blockchain().GetHeaderByHash(hash)
	} else {
		blockNumber, err := strconv.ParseInt(hashOrTag, 16, 64)
		if err != nil {
			log.Fatal(err)
		}

		block := sim.Backend.Blockchain().GetBlockByNumber(uint64(blockNumber))
		blockHeader = block.Header()
	}

	logsJson, err := json.Marshal(blockHeader)
	if err != nil {
		log.Fatal(err)
	}

	return C.CString(string(logsJson))
}

//export getCode
func getCode(simID C.int, account *C.char) *C.char {
	sim := getSimulator(simID)
	code, err := sim.Backend.CodeAt(context.Background(), common.HexToAddress(C.GoString(account)), nil)
	if err != nil {
		log.Fatal(err)
	}

	return C.CString(common.Bytes2Hex(code))
}

//export getChainID
func getChainID(simID C.int) *C.char {
	sim := getSimulator(simID)
	bn := sim.GetChainID()
	return C.CString(bn.String())
}

//export getBalance
func getBalance(simID C.int, account *C.char) *C.char {
	sim := getSimulator(simID)
	bal, err := sim.Backend.BalanceAt(context.Background(), common.HexToAddress(C.GoString(account)), nil)
	if err != nil {
		log.Fatal(err)
	}

	return C.CString(bal.String())
}

//export getTransactionCount
func getTransactionCount(simID C.int, account *C.char) C.int {
	sim := getSimulator(simID)
	count, err := sim.Backend.NonceAt(context.Background(), common.HexToAddress(C.GoString(account)), nil)
	if err != nil {
		log.Fatal(err)
	}

	return C.int(count)
}

//export getLogs
func getLogs(simID C.int, queryJson *C.char) *C.char {
	sim := getSimulator(simID)

	var query ethereum.FilterQuery

	err := json.Unmarshal([]byte(C.GoString(queryJson)), &query)
	if err != nil {
		log.Fatal(err)
	}

	logs, err := sim.Backend.FilterLogs(context.Background(), query)

	if err != nil {
		log.Fatal(err)
	}

	logsJson, err := json.Marshal(logs)
	return C.CString(string(logsJson))
}

//export call
func call(simID C.int, msg TransactionRequest) *C.char {
	sim := getSimulator(simID)

	callMsg, err := transactionRequestToCallMsg(&msg)
	if err != nil {
		log.Fatal(err)
	}

	res, err := sim.Backend.CallContract(context.Background(), *callMsg, nil)
	if err != nil {
		log.Fatal(err)
	}

	return C.CString(hex.EncodeToString(res))
}

type txReceipt struct {
	Tx        *types.Transaction
	IsPending bool
}

//export getTransaction
func getTransaction(simID C.int, txHash *C.char) *C.char {
	sim := getSimulator(simID)

	hash := common.HexToHash(C.GoString(txHash))
	tx, isPending, err := sim.Backend.SimulatedBackend.TransactionByHash(context.Background(), hash)
	if err != nil {
		log.Fatal(err)
	}

	stringified, err := json.Marshal(txReceipt{Tx: tx, IsPending: isPending})
	if err != nil {
		log.Fatal(err)
	}

	return C.CString(string(stringified[:]))
}

//export sendTransaction
func sendTransaction(simID C.int, txData *C.char) TransactionReceipt {
	sim := getSimulator(simID)

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

	res, err := createTransactionReceipt(receipt)
	if err != nil {
		log.Fatal(err)
	}

	return *res
}

func getSimulator(simID C.int) *simulator.Simulator {
	id := int(simID)
	sim, ok := simulators[id]
	if !ok {
		log.Fatal(fmt.Errorf("simulator with %d does not exist", id))
	}
	return sim
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

//export countLines
func countLines(str *C.char) int32 {
	go_str := C.GoString(str)
	n := strings.Count(go_str, "\n")
	return int32(n)
}

//export toUpper
func toUpper(str *C.char) *C.char {
	go_str := C.GoString(str)
	upper := strings.ToUpper(go_str)
	return C.CString(upper)
}

//export sumProduct
func sumProduct(intput InputStruct) OutputStruct {
	return OutputStruct{
		Sum:     intput.A + intput.B,
		Product: intput.A * intput.B,
	}
}
