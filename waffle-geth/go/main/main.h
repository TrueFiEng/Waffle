
// Remove
typedef struct _InputStruct {
	int A;
	int B;
} InputStruct;

// Remove
typedef struct _OutputStruct {
	int Sum;
	int Product;
} OutputStruct;

typedef struct _TransactionRequest
{
	// From      common.Address  // the sender of the 'transaction'
	char* From;

	// To        *common.Address // the destination contract (nil for contract creation)
	char* To;

	// Gas       uint64          // if 0, the call executes with near-infinite gas
	unsigned long long Gas;

	// GasPrice  *big.Int        // wei <-> gas exchange ratio
	char* GasPrice;

	// GasFeeCap *big.Int        // EIP-1559 fee cap per gas.
	char* GasFeeCap;
	
	// GasTipCap *big.Int        // EIP-1559 tip per gas.
	char* GasTipCap;

	// Value     *big.Int        // amount of wei sent along with the call
	char* Value;

	// Data      []byte          // input data, usually an ABI-encoded contract method invocation
	char* Data;

	// AccessList types.AccessList // EIP-2930 access list.
	// TODO
} TransactionRequest;

typedef struct _TransactionReceipt
{
	// Consensus fields: These fields are defined by the Yellow Paper
	// Type              uint8  `json:"type,omitempty"`
	unsigned char Type;

	// PostState         []byte `json:"root"`
	// unsigned char* PostState;

	// Status            uint64 `json:"status"`
	unsigned long long Status;

	// CumulativeGasUsed uint64 `json:"cumulativeGasUsed" gencodec:"required"`
	unsigned long long CumulativeGasUsed;

	// Bloom             Bloom  `json:"logsBloom"         gencodec:"required"`
	// TODO

	// Logs              []*Log `json:"logs"              gencodec:"required"`
	// TODO

	// Implementation fields: These fields are added by geth when processing a transaction.
	// They are stored in the chain database.
	// TxHash          common.Hash    `json:"transactionHash" gencodec:"required"`
	char* TxHash;

	// ContractAddress common.Address `json:"contractAddress"`
	char* ContractAddress;

	// GasUsed         uint64         `json:"gasUsed" gencodec:"required"`
	unsigned long long GasUsed;

	// Inclusion information: These fields provide information about the inclusion of the
	// transaction corresponding to this receipt.
	// BlockHash        common.Hash `json:"blockHash,omitempty"`
	char* BlockHash;

	// BlockNumber      *big.Int    `json:"blockNumber,omitempty"`
	char* BlockNumber;

	// TransactionIndex uint        `json:"transactionIndex"`
	unsigned int 	TransactionIndex;
} TransactionReceipt;
