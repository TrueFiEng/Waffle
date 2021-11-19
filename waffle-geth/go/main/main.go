package main

import "C"
import (
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
