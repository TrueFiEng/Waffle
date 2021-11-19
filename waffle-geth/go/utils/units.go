package utils

import (
	"math/big"

	"github.com/ethereum/go-ethereum/params"
)

func ParseUnits(value string, unit int64) *big.Int {
	base, _ := new(big.Int).SetString(value, 10)
	multiplier := big.NewInt(unit)
	return new(big.Int).Mul(base, multiplier)
}

func ParseEther(value string) *big.Int {
	return ParseUnits(value, params.Ether)
}
