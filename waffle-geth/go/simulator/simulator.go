package simulator

import (
	"context"
	"crypto/ecdsa"
	"math/big"
	"time"

	"github.com/Ethworks/Waffle/chain"
	"github.com/Ethworks/Waffle/models"
	"github.com/Ethworks/Waffle/utils"
	"github.com/Ethworks/Waffle/utils/ref"
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/accounts/abi/bind/backends"
	"github.com/ethereum/go-ethereum/core"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
)

const SimulatorChainID = 1337

type Config struct {
	FirstAccountPrivateKey *string        // default "ee79b5f6e221356af78cf4c36f4f7885a11b67dfcc81c34d80249947330c0f82"
	NumAccounts            *uint64        // default 10
	BlockGasLimit          *uint64        // default 12_500_000
	AutomineEnabled        *bool          // default false
	AutomineInterval       *time.Duration // default 100ms
}

type Simulator struct {
	Backend  *Backend
	Config   *Config
	Account  *bind.TransactOpts
	Accounts []*bind.TransactOpts

	stopAutomine func()
}

func NewSimulator() (*Simulator, error) {
	return NewConfiguredSimulator(Config{})
}

func NewAutominingSimulator() (*Simulator, error) {
	return NewConfiguredSimulator(Config{
		AutomineEnabled: ref.Bool(true),
	})
}

func NewConfiguredSimulator(cfg Config) (sim *Simulator, err error) {
	fillWithDefaults(&cfg)

	genesisAccounts := make(core.GenesisAlloc)
	accounts := make([]*bind.TransactOpts, 0, int(*cfg.NumAccounts))

	for i := uint64(0); i < *cfg.NumAccounts; i++ {
		var key *ecdsa.PrivateKey

		if i == 0 {
			key, err = crypto.HexToECDSA(*cfg.FirstAccountPrivateKey)
		} else {
			key, err = crypto.GenerateKey()
		}
		if err != nil {
			return nil, err
		}

		auth, err := bind.NewKeyedTransactorWithChainID(key, big.NewInt(SimulatorChainID))
		if err != nil {
			return nil, err
		}

		accounts = append(accounts, auth)
		genesisAccounts[auth.From] = core.GenesisAccount{
			Balance:    utils.ParseEther("100"),
			PrivateKey: key.D.Bytes(),
		}
	}

	sim = &Simulator{
		Backend:  NewBackend(backends.NewSimulatedBackend(genesisAccounts, *cfg.BlockGasLimit)),
		Config:   &cfg,
		Account:  accounts[0],
		Accounts: accounts,
	}

	if *cfg.AutomineEnabled {
		sim.StartAutomine()
	}

	return sim, nil
}

func (sim *Simulator) IsAutomineEnabled() bool {
	return sim.stopAutomine != nil
}

func (sim *Simulator) StartAutomine() func() {
	if sim.IsAutomineEnabled() {
		return sim.stopAutomine
	}

	ticker := time.NewTicker(*sim.Config.AutomineInterval)
	quit := make(chan struct{})
	go func() {
		defer ticker.Stop()
		for {
			select {
			case <-quit:
				return
			case <-ticker.C:
				sim.Backend.Commit()
			}
		}
	}()

	sim.stopAutomine = func() {
		close(quit)
		sim.stopAutomine = nil
	}
	return sim.stopAutomine
}

func (sim *Simulator) StopAutomine() {
	if sim.IsAutomineEnabled() {
		sim.stopAutomine()
	}
}

func (sim *Simulator) Close() {
	sim.StopAutomine()
	_ = sim.Backend.Close() // ignore error, it is always nil
}

func (sim *Simulator) GetAccount() *bind.TransactOpts {
	return sim.Account
}

func (sim *Simulator) GetBackend() chain.Backend {
	return sim.Backend
}

func (sim *Simulator) GetChainID() models.Uint256 {
	return models.MakeUint256FromBig(*sim.Backend.Blockchain().Config().ChainID)
}

func (sim *Simulator) GetLatestBlockNumber() (*uint64, error) {
	return ref.Uint64(sim.Backend.Blockchain().CurrentHeader().Number.Uint64()), nil
}

func (sim *Simulator) SubscribeNewHead(ch chan<- *types.Header) (ethereum.Subscription, error) {
	return sim.Backend.SubscribeNewHead(context.Background(), ch)
}

func (sim *Simulator) EstimateGas(ctx context.Context, msg *ethereum.CallMsg) (uint64, error) {
	return sim.Backend.EstimateGas(ctx, *msg)
}

func fillWithDefaults(cfg *Config) {
	if cfg.FirstAccountPrivateKey == nil {
		cfg.FirstAccountPrivateKey = ref.String("ee79b5f6e221356af78cf4c36f4f7885a11b67dfcc81c34d80249947330c0f82")
	}
	if cfg.NumAccounts == nil {
		cfg.NumAccounts = ref.Uint64(10)
	}
	if cfg.BlockGasLimit == nil {
		cfg.BlockGasLimit = ref.Uint64(12_500_000)
	}
	if cfg.AutomineEnabled == nil {
		cfg.AutomineEnabled = ref.Bool(false)
	}
	if cfg.AutomineInterval == nil {
		cfg.AutomineInterval = ref.Duration(100 * time.Millisecond)
	}
}
