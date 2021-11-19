package chain

import (
	"context"
	"math/big"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
)

type ReceiptProvider interface {
	TransactionReceipt(ctx context.Context, txHash common.Hash) (*types.Receipt, error)

	// Commit force a block creation if running on a simulator. Noop otherwise.
	Commit()
}

type Backend interface {
	bind.ContractBackend
	ReceiptProvider
	TransactionByHash(ctx context.Context, hash common.Hash) (tx *types.Transaction, isPending bool, err error)
	HeaderByNumber(ctx context.Context, number *big.Int) (*types.Header, error)
}
