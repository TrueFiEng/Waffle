package ref

import (
	"time"

	"github.com/ethereum/go-ethereum/common"
)

func Bool(b bool) *bool {
	return &b
}

func Int(i int) *int {
	return &i
}

func Uint8(u uint8) *uint8 {
	return &u
}

func Uint(u uint) *uint {
	return &u
}

func Int32(i int32) *int32 {
	return &i
}

func Uint32(u uint32) *uint32 {
	return &u
}

func Int64(i int64) *int64 {
	return &i
}

func Uint64(u uint64) *uint64 {
	return &u
}

func String(s string) *string {
	return &s
}

func Time(t time.Time) *time.Time {
	return &t
}

func Duration(d time.Duration) *time.Duration {
	return &d
}

func Hash(h common.Hash) *common.Hash {
	return &h
}

func Address(a common.Address) *common.Address {
	return &a
}
