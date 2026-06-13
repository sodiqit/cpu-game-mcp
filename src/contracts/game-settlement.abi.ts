// GameSettlement contract ABI — used to encode the reveal / approve calldata. Must match the deployed
// GameSettlement contract.

export const GAME_SETTLEMENT_ABI = [
    {
        type: 'constructor',
        inputs: [
            {
                name: 'landNft',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'cpu',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'treasury_',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'admin',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'signerAddress_',
                type: 'address',
                internalType: 'address',
            },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'CPU',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'address',
                internalType: 'contract ERC20Burnable',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'DEFAULT_ADMIN_ROLE',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'bytes32',
                internalType: 'bytes32',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'LAND_NFT',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'address',
                internalType: 'contract IERC721',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'REVEAL_TYPEHASH',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'bytes32',
                internalType: 'bytes32',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'SPEND_CPU_TYPEHASH',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'bytes32',
                internalType: 'bytes32',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'TRADE_BUY_TYPEHASH',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'bytes32',
                internalType: 'bytes32',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'TRADE_CANCEL_TYPEHASH',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'bytes32',
                internalType: 'bytes32',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'TRANSPORT_TYPEHASH',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'bytes32',
                internalType: 'bytes32',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'WITHDRAW_CPU_TYPEHASH',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'bytes32',
                internalType: 'bytes32',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'eip712Domain',
        inputs: [],
        outputs: [
            {
                name: 'fields',
                type: 'bytes1',
                internalType: 'bytes1',
            },
            {
                name: 'name',
                type: 'string',
                internalType: 'string',
            },
            {
                name: 'version',
                type: 'string',
                internalType: 'string',
            },
            {
                name: 'chainId',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'verifyingContract',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'salt',
                type: 'bytes32',
                internalType: 'bytes32',
            },
            {
                name: 'extensions',
                type: 'uint256[]',
                internalType: 'uint256[]',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'getRoleAdmin',
        inputs: [
            {
                name: 'role',
                type: 'bytes32',
                internalType: 'bytes32',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'bytes32',
                internalType: 'bytes32',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'grantRole',
        inputs: [
            {
                name: 'role',
                type: 'bytes32',
                internalType: 'bytes32',
            },
            {
                name: 'account',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'hasRole',
        inputs: [
            {
                name: 'role',
                type: 'bytes32',
                internalType: 'bytes32',
            },
            {
                name: 'account',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'bool',
                internalType: 'bool',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'pause',
        inputs: [],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'paused',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'bool',
                internalType: 'bool',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'renounceRole',
        inputs: [
            {
                name: 'role',
                type: 'bytes32',
                internalType: 'bytes32',
            },
            {
                name: 'callerConfirmation',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'reveal',
        inputs: [
            {
                name: 'signId',
                type: 'uint64',
                internalType: 'uint64',
            },
            {
                name: 'tokenId',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'cpuAmount',
                type: 'uint128',
                internalType: 'uint128',
            },
            {
                name: 'deadline',
                type: 'uint64',
                internalType: 'uint64',
            },
            {
                name: 'v',
                type: 'uint8',
                internalType: 'uint8',
            },
            {
                name: 'r',
                type: 'bytes32',
                internalType: 'bytes32',
            },
            {
                name: 's',
                type: 'bytes32',
                internalType: 'bytes32',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'revealCount',
        inputs: [
            {
                name: 'tokenId',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        outputs: [
            {
                name: 'count',
                type: 'uint32',
                internalType: 'uint32',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'revokeRole',
        inputs: [
            {
                name: 'role',
                type: 'bytes32',
                internalType: 'bytes32',
            },
            {
                name: 'account',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'setSignerAddress',
        inputs: [
            {
                name: 'newSigner',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'setTreasury',
        inputs: [
            {
                name: 'newTreasury',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'signerAddress',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'address',
                internalType: 'address',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'spendCpu',
        inputs: [
            {
                name: 'signId',
                type: 'uint64',
                internalType: 'uint64',
            },
            {
                name: 'tokenId',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'cpuAmount',
                type: 'uint128',
                internalType: 'uint128',
            },
            {
                name: 'deadline',
                type: 'uint64',
                internalType: 'uint64',
            },
            {
                name: 'v',
                type: 'uint8',
                internalType: 'uint8',
            },
            {
                name: 'r',
                type: 'bytes32',
                internalType: 'bytes32',
            },
            {
                name: 's',
                type: 'bytes32',
                internalType: 'bytes32',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'supportsInterface',
        inputs: [
            {
                name: 'interfaceId',
                type: 'bytes4',
                internalType: 'bytes4',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'bool',
                internalType: 'bool',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'tradeBuy',
        inputs: [
            {
                name: 'signId',
                type: 'uint64',
                internalType: 'uint64',
            },
            {
                name: 'buyerDestTokenId',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'totalAmount',
                type: 'uint128',
                internalType: 'uint128',
            },
            {
                name: 'burnAmount',
                type: 'uint128',
                internalType: 'uint128',
            },
            {
                name: 'recipients',
                type: 'address[]',
                internalType: 'address[]',
            },
            {
                name: 'payouts',
                type: 'uint128[]',
                internalType: 'uint128[]',
            },
            {
                name: 'deadline',
                type: 'uint64',
                internalType: 'uint64',
            },
            {
                name: 'v',
                type: 'uint8',
                internalType: 'uint8',
            },
            {
                name: 'r',
                type: 'bytes32',
                internalType: 'bytes32',
            },
            {
                name: 's',
                type: 'bytes32',
                internalType: 'bytes32',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'tradeCancel',
        inputs: [
            {
                name: 'signId',
                type: 'uint64',
                internalType: 'uint64',
            },
            {
                name: 'sellerDestTokenId',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'totalAmount',
                type: 'uint128',
                internalType: 'uint128',
            },
            {
                name: 'burnAmount',
                type: 'uint128',
                internalType: 'uint128',
            },
            {
                name: 'recipients',
                type: 'address[]',
                internalType: 'address[]',
            },
            {
                name: 'payouts',
                type: 'uint128[]',
                internalType: 'uint128[]',
            },
            {
                name: 'deadline',
                type: 'uint64',
                internalType: 'uint64',
            },
            {
                name: 'v',
                type: 'uint8',
                internalType: 'uint8',
            },
            {
                name: 'r',
                type: 'bytes32',
                internalType: 'bytes32',
            },
            {
                name: 's',
                type: 'bytes32',
                internalType: 'bytes32',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'transport',
        inputs: [
            {
                name: 'signId',
                type: 'uint64',
                internalType: 'uint64',
            },
            {
                name: 'sourceTokenId',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'totalAmount',
                type: 'uint128',
                internalType: 'uint128',
            },
            {
                name: 'burnAmount',
                type: 'uint128',
                internalType: 'uint128',
            },
            {
                name: 'recipients',
                type: 'address[]',
                internalType: 'address[]',
            },
            {
                name: 'payouts',
                type: 'uint128[]',
                internalType: 'uint128[]',
            },
            {
                name: 'deadline',
                type: 'uint64',
                internalType: 'uint64',
            },
            {
                name: 'v',
                type: 'uint8',
                internalType: 'uint8',
            },
            {
                name: 'r',
                type: 'bytes32',
                internalType: 'bytes32',
            },
            {
                name: 's',
                type: 'bytes32',
                internalType: 'bytes32',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'treasury',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'address',
                internalType: 'address',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'unpause',
        inputs: [],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'usedSignIds',
        inputs: [
            {
                name: 'signId',
                type: 'uint64',
                internalType: 'uint64',
            },
        ],
        outputs: [
            {
                name: 'used',
                type: 'bool',
                internalType: 'bool',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'withdrawCpu',
        inputs: [
            {
                name: 'signId',
                type: 'uint64',
                internalType: 'uint64',
            },
            {
                name: 'targetTokenId',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'amount',
                type: 'uint128',
                internalType: 'uint128',
            },
            {
                name: 'deadline',
                type: 'uint64',
                internalType: 'uint64',
            },
            {
                name: 'v',
                type: 'uint8',
                internalType: 'uint8',
            },
            {
                name: 'r',
                type: 'bytes32',
                internalType: 'bytes32',
            },
            {
                name: 's',
                type: 'bytes32',
                internalType: 'bytes32',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'event',
        name: 'CpuSpent',
        inputs: [
            {
                name: 'signId',
                type: 'uint64',
                indexed: true,
                internalType: 'uint64',
            },
            {
                name: 'player',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'tokenId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'cpuAmount',
                type: 'uint128',
                indexed: false,
                internalType: 'uint128',
            },
            {
                name: 'timestamp',
                type: 'uint64',
                indexed: false,
                internalType: 'uint64',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'CpuWithdrawn',
        inputs: [
            {
                name: 'signId',
                type: 'uint64',
                indexed: true,
                internalType: 'uint64',
            },
            {
                name: 'player',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'targetTokenId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'amount',
                type: 'uint128',
                indexed: false,
                internalType: 'uint128',
            },
            {
                name: 'timestamp',
                type: 'uint64',
                indexed: false,
                internalType: 'uint64',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'EIP712DomainChanged',
        inputs: [],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'LotBought',
        inputs: [
            {
                name: 'signId',
                type: 'uint64',
                indexed: true,
                internalType: 'uint64',
            },
            {
                name: 'buyer',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'buyerDestTokenId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'totalAmount',
                type: 'uint128',
                indexed: false,
                internalType: 'uint128',
            },
            {
                name: 'burnAmount',
                type: 'uint128',
                indexed: false,
                internalType: 'uint128',
            },
            {
                name: 'timestamp',
                type: 'uint64',
                indexed: false,
                internalType: 'uint64',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'LotCancelled',
        inputs: [
            {
                name: 'signId',
                type: 'uint64',
                indexed: true,
                internalType: 'uint64',
            },
            {
                name: 'seller',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'sellerDestTokenId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'totalAmount',
                type: 'uint128',
                indexed: false,
                internalType: 'uint128',
            },
            {
                name: 'burnAmount',
                type: 'uint128',
                indexed: false,
                internalType: 'uint128',
            },
            {
                name: 'timestamp',
                type: 'uint64',
                indexed: false,
                internalType: 'uint64',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'Paused',
        inputs: [
            {
                name: 'account',
                type: 'address',
                indexed: false,
                internalType: 'address',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'Revealed',
        inputs: [
            {
                name: 'signId',
                type: 'uint64',
                indexed: true,
                internalType: 'uint64',
            },
            {
                name: 'tokenId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'player',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'cpuAmount',
                type: 'uint128',
                indexed: false,
                internalType: 'uint128',
            },
            {
                name: 'revealCount',
                type: 'uint32',
                indexed: false,
                internalType: 'uint32',
            },
            {
                name: 'timestamp',
                type: 'uint64',
                indexed: false,
                internalType: 'uint64',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'RoleAdminChanged',
        inputs: [
            {
                name: 'role',
                type: 'bytes32',
                indexed: true,
                internalType: 'bytes32',
            },
            {
                name: 'previousAdminRole',
                type: 'bytes32',
                indexed: true,
                internalType: 'bytes32',
            },
            {
                name: 'newAdminRole',
                type: 'bytes32',
                indexed: true,
                internalType: 'bytes32',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'RoleGranted',
        inputs: [
            {
                name: 'role',
                type: 'bytes32',
                indexed: true,
                internalType: 'bytes32',
            },
            {
                name: 'account',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'sender',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'RoleRevoked',
        inputs: [
            {
                name: 'role',
                type: 'bytes32',
                indexed: true,
                internalType: 'bytes32',
            },
            {
                name: 'account',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'sender',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'TransportPaid',
        inputs: [
            {
                name: 'signId',
                type: 'uint64',
                indexed: true,
                internalType: 'uint64',
            },
            {
                name: 'player',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'sourceTokenId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'totalAmount',
                type: 'uint128',
                indexed: false,
                internalType: 'uint128',
            },
            {
                name: 'burnAmount',
                type: 'uint128',
                indexed: false,
                internalType: 'uint128',
            },
            {
                name: 'timestamp',
                type: 'uint64',
                indexed: false,
                internalType: 'uint64',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'Unpaused',
        inputs: [
            {
                name: 'account',
                type: 'address',
                indexed: false,
                internalType: 'address',
            },
        ],
        anonymous: false,
    },
    {
        type: 'error',
        name: 'AccessControlBadConfirmation',
        inputs: [],
    },
    {
        type: 'error',
        name: 'AccessControlUnauthorizedAccount',
        inputs: [
            {
                name: 'account',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'neededRole',
                type: 'bytes32',
                internalType: 'bytes32',
            },
        ],
    },
    {
        type: 'error',
        name: 'ArrayLengthMismatch',
        inputs: [],
    },
    {
        type: 'error',
        name: 'BadSignature',
        inputs: [],
    },
    {
        type: 'error',
        name: 'DeadlineExpired',
        inputs: [],
    },
    {
        type: 'error',
        name: 'ECDSAInvalidSignature',
        inputs: [],
    },
    {
        type: 'error',
        name: 'ECDSAInvalidSignatureLength',
        inputs: [
            {
                name: 'length',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
    },
    {
        type: 'error',
        name: 'ECDSAInvalidSignatureS',
        inputs: [
            {
                name: 's',
                type: 'bytes32',
                internalType: 'bytes32',
            },
        ],
    },
    {
        type: 'error',
        name: 'EnforcedPause',
        inputs: [],
    },
    {
        type: 'error',
        name: 'ExpectedPause',
        inputs: [],
    },
    {
        type: 'error',
        name: 'InvalidRevealCount',
        inputs: [],
    },
    {
        type: 'error',
        name: 'InvalidShortString',
        inputs: [],
    },
    {
        type: 'error',
        name: 'InvalidSplit',
        inputs: [],
    },
    {
        type: 'error',
        name: 'NotOwner',
        inputs: [],
    },
    {
        type: 'error',
        name: 'ReentrancyGuardReentrantCall',
        inputs: [],
    },
    {
        type: 'error',
        name: 'SafeERC20FailedOperation',
        inputs: [
            {
                name: 'token',
                type: 'address',
                internalType: 'address',
            },
        ],
    },
    {
        type: 'error',
        name: 'SignIdAlreadyUsed',
        inputs: [],
    },
    {
        type: 'error',
        name: 'StringTooLong',
        inputs: [
            {
                name: 'str',
                type: 'string',
                internalType: 'string',
            },
        ],
    },
    {
        type: 'error',
        name: 'ZeroAddress',
        inputs: [],
    },
    {
        type: 'error',
        name: 'ZeroAmount',
        inputs: [],
    },
    {
        type: 'error',
        name: 'ZeroTotalAmount',
        inputs: [],
    },
] as const;
