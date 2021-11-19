package main

import "C"
import (
  "context"
  "encoding/hex"
  "github.com/ethereum/go-ethereum/core/types"
  "log"
  "math/rand"
	"time"

	simulator2 "github.com/Ethworks/Waffle/simulator"
)

func main() {}

var simulator, _ = simulator2.NewSimulator()

//export getBlockNumber
func getBlockNumber() *C.char {
	bn := simulator.GetLatestBlockNumber()
	return C.CString(bn.String())
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
