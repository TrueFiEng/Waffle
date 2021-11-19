package simulator

import (
	"context"
	"math/big"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi/bind/backends"
)

type Backend struct {
	*backends.SimulatedBackend
}

func NewBackend(simulatedBackend *backends.SimulatedBackend) *Backend {
	return &Backend{SimulatedBackend: simulatedBackend}
}

// nolint:gocritic
func (b *Backend) CallContract(ctx context.Context, call ethereum.CallMsg, _ *big.Int) ([]byte, error) {
	return b.SimulatedBackend.CallContract(ctx, call, nil)
}
