package main

import "C"
import (
  "context"
  "encoding/hex"
  "encoding/json"
  "fmt"
  simulator2 "github.com/Ethworks/Waffle/simulator"
  "github.com/ethereum/go-ethereum"
  "github.com/ethereum/go-ethereum/common"
  "github.com/ethereum/go-ethereum/core/types"
  "log"
  "math/rand"
  "time"
)

type TransactionRequest struct {
  to *string
  from *string
  nonce *string

  gasLimit *string
  gasPrice *string

  data *string
  value *string
  chainId *uint64

  txType *uint64
}

func main() {}

var simulator, _ = simulator2.NewSimulator()

//export getBlockNumber
func getBlockNumber() *C.char {
	bn := simulator.GetLatestBlockNumber()
	return C.CString(bn.String())
}

//export getBalance
func getBalance(account *C.char) *C.char {
	bal, err := simulator.Backend.BalanceAt(context.Background(), common.HexToAddress(C.GoString(account)), nil)
  if err != nil {
    log.Fatal(err)
  }

	return C.CString(bal.String())
}

//export call
func call(msgJson *C.char) *C.char {
  var msg ethereum.CallMsg
  err := json.Unmarshal([]byte(C.GoString(msgJson)), &msg)
  if err != nil {
    log.Fatal(err)
  }

  res, err := simulator.Backend.CallContract(context.Background(), msg, nil)
  if err != nil {
    log.Fatal(err)
  }

  return C.CString(hex.EncodeToString(res))
}

//export sendTransaction
func sendTransaction(txData *C.char) {

  bytes, err := hex.DecodeString(C.GoString(txData)[2:])
  if err != nil {
    log.Fatal(err)
  }

  tx := &types.Transaction{}
  err = tx.UnmarshalBinary(bytes)
  if err != nil {
    log.Fatal(err)
  }

	err = simulator.Backend.SimulatedBackend.SendTransaction(context.Background(), tx)
  if err != nil {
    log.Fatal(err)
  }

  simulator.Backend.Commit()

  receipt, err := simulator.Backend.SimulatedBackend.TransactionReceipt(context.Background(), tx.Hash())
  if err != nil {
    log.Fatal(err)
  }
  fmt.Println(tx.Hash().String())
  fmt.Println(receipt.ContractAddress.String())
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
