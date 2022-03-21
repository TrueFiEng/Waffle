package main

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"math/big"
	"math/rand"
	"strconv"
	"strings"
	"time"

	"C"

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
	return C.CString(bn.String())
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
func call(simID C.int, msgJson *C.char) *C.char {
	sim := getSimulator(simID)
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
func sendTransaction(simID C.int, txData *C.char) *C.char {
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

	receiptJson, err := json.Marshal(receipt)
	if err != nil {
		log.Fatal(err)
	}

	return C.CString(string(receiptJson))
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
