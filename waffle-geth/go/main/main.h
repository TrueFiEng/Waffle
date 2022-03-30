
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
