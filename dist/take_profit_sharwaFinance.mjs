var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/take_profit_sharwaFinance.ts
import { Contract, EventLog, Log, Interface, ZeroAddress } from "ethers";

// src/config.json
var config_default = {
  take_profit_address: "0xb87b9D84E7BeF23341a53D3c721a4C15D40F66A8",
  positions_manager_address: "0x5Fe380D68fEe022d8acd42dc4D36FbfB249a76d5",
  operational_treasury_address: "0xec096ea6eB9aa5ea689b0CF00882366E92377371"
};

// src/abi/abi_take_profit.json
var abi_take_profit_default = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_positionManager",
        type: "address"
      },
      {
        internalType: "address",
        name: "_operationalTreasury",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "TakeProfitDeleted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address"
      }
    ],
    name: "TakeProfitExecuted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "upperStopPrice",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "lowerStopPrice",
        type: "uint256"
      }
    ],
    name: "TakeProfitSet",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "checkTakeProfit",
    outputs: [
      {
        internalType: "bool",
        name: "takeProfitTriggered",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "deleteTakeProfit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "executeTakeProfit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "getCurrentPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "getExpirationTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "getPayOffAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "globalTimeToExecution",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "isOptionActive",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "operationalTreasury",
    outputs: [
      {
        internalType: "contract IOperationalTreasury",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "positionManager",
    outputs: [
      {
        internalType: "contract IPositionsManager",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newGlobalTimeToExecution",
        type: "uint256"
      }
    ],
    name: "setGlobalTimeToExecution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "upperStopPrice",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "lowerStopPrice",
            type: "uint256"
          }
        ],
        internalType: "struct ITakeProfit.TakeInfo",
        name: "takeProfitParams",
        type: "tuple"
      }
    ],
    name: "setTakeProfit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "tokenIdToTakeInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "upperStopPrice",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "lowerStopPrice",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

// src/abi/abi_positions_manager.json
var abi_positions_manager_default = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address"
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool"
      }
    ],
    name: "ApprovalForAll",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "operator",
        type: "address"
      }
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "isApprovedOrOwner",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "nextTokenId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address"
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool"
      }
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4"
      }
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

// src/abi/abi_operational_treasury.json
var abi_operational_treasury_default = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256"
      }
    ],
    name: "Expired",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "Paid",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "Replenished",
    type: "event"
  },
  {
    inputs: [],
    name: "benchmark",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract IHegicStrategy",
        name: "strategy",
        type: "address"
      },
      {
        internalType: "address",
        name: "holder",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "period",
        type: "uint256"
      },
      {
        internalType: "bytes[]",
        name: "additional",
        type: "bytes[]"
      }
    ],
    name: "buy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "coverPool",
    outputs: [
      {
        internalType: "contract ICoverPool",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract IHegicStrategy",
        name: "strategy",
        type: "address"
      }
    ],
    name: "lockedByStrategy",
    outputs: [
      {
        internalType: "uint256",
        name: "lockedAmount",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256"
      }
    ],
    name: "lockedLiquidity",
    outputs: [
      {
        internalType: "enum IOperationalTreasury.LockedLiquidityState",
        name: "state",
        type: "uint8"
      },
      {
        internalType: "contract IHegicStrategy",
        name: "strategy",
        type: "address"
      },
      {
        internalType: "uint128",
        name: "negativepnl",
        type: "uint128"
      },
      {
        internalType: "uint128",
        name: "positivepnl",
        type: "uint128"
      },
      {
        internalType: "uint32",
        name: "expiration",
        type: "uint32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "lockedPremium",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "manager",
    outputs: [
      {
        internalType: "contract IPositionsManager",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "positionID",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "payOff",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalLocked",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "lockedLiquidityID",
        type: "uint256"
      }
    ],
    name: "unlock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

// src/take_profit_sharwaFinance.ts
var TakeProfitSharwaFinance = class {
  constructor(provider, signer) {
    this.provider = provider;
    this.signer = signer;
    this.take_profit = new Contract(config_default.take_profit_address, abi_take_profit_default, signer);
    this.positions_manager = new Contract(config_default.positions_manager_address, abi_positions_manager_default, signer);
    this.operational_treasury = new Contract(config_default.operational_treasury_address, abi_operational_treasury_default, signer);
    this.iface = new Interface(abi_take_profit_default);
  }
  // STATE CHANGE FUNCTIONS //
  setTakeProfit(tokenId, upperStopPrice, lowerStopPrice) {
    return __async(this, null, function* () {
      return yield this.take_profit.setTakeProfit(tokenId, { upperStopPrice, lowerStopPrice });
    });
  }
  deleteTakeProfit(tokenId) {
    return __async(this, null, function* () {
      yield this.take_profit.deleteTakeProfit(tokenId);
    });
  }
  enableAutoExecutionForAllOptions() {
    return __async(this, null, function* () {
      yield this.positions_manager.setApprovalForAll(config_default.take_profit_address, true);
    });
  }
  disableAutoExecutionForAllOptions() {
    return __async(this, null, function* () {
      yield this.positions_manager.setApprovalForAll(config_default.take_profit_address, false);
    });
  }
  enableAutoExecutionForOption(tokenId) {
    return __async(this, null, function* () {
      yield this.positions_manager.approve(config_default.take_profit_address, tokenId);
    });
  }
  disableAutoExecutionForOption(tokenId) {
    return __async(this, null, function* () {
      yield this.positions_manager.approve(ZeroAddress, tokenId);
    });
  }
  // FILTER_OPTIONS FUNCTIONS //
  filterOptionsWithAutoExecutionEnabled(user, arrAcivaOptions) {
    return __async(this, null, function* () {
      const ApprovalFilter = this.positions_manager.filters.Approval(user, config_default.take_profit_address, null);
      const arrApproval = yield this.positions_manager.queryFilter(ApprovalFilter);
      const uniqApprovalLogs = this._uniqTransferData(arrApproval);
      const DisableApprovalFilter = this.positions_manager.filters.Approval(user, ZeroAddress, null);
      const arrDisableApproval = yield this.positions_manager.queryFilter(DisableApprovalFilter);
      const uniqDisableApprovalLogs = this._uniqTransferData(arrDisableApproval);
      const ApprovalForAllFilter = this.positions_manager.filters.ApprovalForAll(user, config_default.take_profit_address, null);
      const arrApprovalForAll = yield this.positions_manager.queryFilter(ApprovalForAllFilter);
      const isApprovalForAll = this._isApprovalForAllData(arrApprovalForAll);
      const autoExecutionOptions = [];
      for (const i in arrAcivaOptions) {
        const logApproval = uniqApprovalLogs.find((elem) => elem.tokenId === arrAcivaOptions[i]);
        const logDisableApproval = uniqDisableApprovalLogs.find((elem) => elem.tokenId === arrAcivaOptions[i]);
        let isApproved = true;
        if (logDisableApproval != void 0 && logApproval != void 0) {
          if (logDisableApproval.blockNumber > logApproval.blockNumber) {
            isApproved = false;
          }
        }
        if (isApprovalForAll) {
          autoExecutionOptions.push(arrAcivaOptions[i]);
        } else {
          if (logApproval != void 0 && isApproved) {
            autoExecutionOptions.push(arrAcivaOptions[i]);
          }
        }
      }
      return autoExecutionOptions;
    });
  }
  filterOptionsWithTakeProfits(user, arrAcivaOptions) {
    return __async(this, null, function* () {
      let activeTakeProfits = /* @__PURE__ */ new Map();
      const TakeProfitSetFilter = this.take_profit.filters.TakeProfitSet(null, user);
      const arrLogsTakeProfitSet = yield this.take_profit.queryFilter(TakeProfitSetFilter);
      const uniqSetLogs = this._uniqTakeProfitData(arrLogsTakeProfitSet);
      for (const i in arrAcivaOptions) {
        const logSet = uniqSetLogs.find((elem) => elem.tokenId === arrAcivaOptions[i]);
        const TakeProfitDeletedFilter = this.take_profit.filters.TakeProfitDeleted(arrAcivaOptions[i]);
        const logTakeProfitDeleted = yield this.take_profit.queryFilter(TakeProfitDeletedFilter);
        const TakeProfitExecutedFilter = this.take_profit.filters.TakeProfitExecuted(arrAcivaOptions[i], null);
        const logTakeProfitExecuted = yield this.take_profit.queryFilter(TakeProfitExecutedFilter);
        const lastDeleteBlockNumber = logTakeProfitDeleted.length == 0 ? 0 : logTakeProfitDeleted[logTakeProfitDeleted.length - 1].blockNumber;
        if (logSet != void 0) {
          if (lastDeleteBlockNumber < logSet.blockNumber && logTakeProfitExecuted.length == 0) {
            if ((logSet.upperStopPrice == 0 && logSet.lowerStopPrice == 0) == false) {
              activeTakeProfits.set(
                logSet.tokenId,
                {
                  upperStopPrice: logSet.upperStopPrice,
                  lowerStopPrice: logSet.lowerStopPrice
                }
              );
            }
          }
        }
      }
      return activeTakeProfits;
    });
  }
  getAutoExecutedOptions(user, arrAcivaOptions) {
    return __async(this, null, function* () {
      let executeTakeProfits = [];
      for (const i in arrAcivaOptions) {
        const TakeProfitExecutedFilter = this.take_profit.filters.TakeProfitExecuted(arrAcivaOptions[i], null);
        const logTakeProfitExecuted = yield this.take_profit.queryFilter(TakeProfitExecutedFilter);
        if (logTakeProfitExecuted.length != 0) {
          executeTakeProfits.push(arrAcivaOptions[i]);
        }
      }
      return executeTakeProfits;
    });
  }
  // DATA QUERY FUNCTIONS //
  isAutoExecutionEnabledForOption(tokenId) {
    return __async(this, null, function* () {
      return yield this.positions_manager.isApprovedOrOwner(config_default.take_profit_address, tokenId);
    });
  }
  isAutoExecutionEnabledForAllOptions(user) {
    return __async(this, null, function* () {
      const ApprovalForAllFilter = this.positions_manager.filters.ApprovalForAll(user, config_default.take_profit_address, null);
      const arrApprovalForAll = yield this.positions_manager.queryFilter(ApprovalForAllFilter);
      return this._isApprovalForAllData(arrApprovalForAll);
    });
  }
  getActiveTakeProfits(user) {
    return __async(this, null, function* () {
      let activeTakeProfits = /* @__PURE__ */ new Map();
      const userSetLogs = yield this.getUserSetLogs(user);
      for (const i in userSetLogs) {
        const TakeProfitDeletedFilter = this.take_profit.filters.TakeProfitDeleted(userSetLogs[i].tokenId);
        const logTakeProfitDeleted = yield this.take_profit.queryFilter(TakeProfitDeletedFilter);
        const TakeProfitExecutedFilter = this.take_profit.filters.TakeProfitExecuted(userSetLogs[i].tokenId, null);
        const logTakeProfitExecuted = yield this.take_profit.queryFilter(TakeProfitExecutedFilter);
        const lastDeleteBlockNumber = logTakeProfitDeleted.length == 0 ? 0 : logTakeProfitDeleted[logTakeProfitDeleted.length - 1].blockNumber;
        if (lastDeleteBlockNumber < userSetLogs[i].blockNumber && logTakeProfitExecuted.length == 0) {
          if ((userSetLogs[i].upperStopPrice == 0 && userSetLogs[i].lowerStopPrice == 0) == false) {
            activeTakeProfits.set(
              userSetLogs[i].tokenId,
              {
                upperStopPrice: userSetLogs[i].upperStopPrice,
                lowerStopPrice: userSetLogs[i].lowerStopPrice
              }
            );
          }
        }
      }
      return activeTakeProfits;
    });
  }
  getAllTakeProfits(user) {
    return __async(this, null, function* () {
      let allTakeProfits = /* @__PURE__ */ new Map();
      const userSetLogs = yield this.getUserSetLogs(user);
      for (const i in userSetLogs) {
        const TakeProfitDeletedFilter = this.take_profit.filters.TakeProfitDeleted(userSetLogs[i].tokenId);
        const logTakeProfitDeleted = yield this.take_profit.queryFilter(TakeProfitDeletedFilter);
        const lastDeleteBlockNumber = logTakeProfitDeleted.length == 0 ? 0 : logTakeProfitDeleted[logTakeProfitDeleted.length - 1].blockNumber;
        if (lastDeleteBlockNumber < userSetLogs[i].blockNumber) {
          allTakeProfits.set(
            userSetLogs[i].tokenId,
            {
              upperStopPrice: userSetLogs[i].upperStopPrice,
              lowerStopPrice: userSetLogs[i].lowerStopPrice
            }
          );
        }
      }
      return allTakeProfits;
    });
  }
  getExecuteTakeProfits(user) {
    return __async(this, null, function* () {
      const TakeProfitExecutedFilter = this.take_profit.filters.TakeProfitExecuted(null, user);
      const arrLogsTakeProfitExecuted = (yield this.take_profit.queryFilter(TakeProfitExecutedFilter)).reverse();
      let executeTakeProfits = [];
      for (const i in arrLogsTakeProfitExecuted) {
        const log = arrLogsTakeProfitExecuted[i];
        if (log instanceof EventLog) {
          const arg = log.args;
          executeTakeProfits.push(arg.tokenId);
        }
      }
      return executeTakeProfits;
    });
  }
  getUserSetLogs(user) {
    return __async(this, null, function* () {
      const TransferInFilter = this.positions_manager.filters.Transfer(null, user, null);
      const arrLogsTransferIn = yield this.positions_manager.queryFilter(TransferInFilter);
      const uniqTransfersIn = this._uniqTransferData(arrLogsTransferIn);
      const TransferOutFilter = this.positions_manager.filters.Transfer(user, null, null);
      const arrLogsTransferOut = yield this.positions_manager.queryFilter(TransferOutFilter);
      const uniqTransfersOut = this._uniqTransferData(arrLogsTransferOut);
      const TakeProfitSetFilter = this.take_profit.filters.TakeProfitSet(null, user);
      const arrLogsTakeProfitSet = yield this.take_profit.queryFilter(TakeProfitSetFilter);
      const uniqSetLogs = this._uniqTakeProfitData(arrLogsTakeProfitSet);
      const userSetLogs = [];
      for (const i in uniqTransfersIn) {
        const logIn = uniqTransfersIn.find((elem) => elem.tokenId === uniqTransfersIn[i].tokenId);
        const logOut = uniqTransfersOut.find((elem) => elem.tokenId === uniqTransfersIn[i].tokenId);
        const logSet = uniqSetLogs.find((elem) => elem.tokenId === uniqTransfersIn[i].tokenId);
        if (logIn != void 0 && logOut != void 0) {
          if (logIn.blockNumber > logOut.blockNumber && logSet != void 0) {
            userSetLogs.push(logSet);
          }
        } else if (logOut == void 0) {
          if (logIn != void 0 && logSet != void 0) {
            userSetLogs.push(logSet);
          }
        }
      }
      return userSetLogs;
    });
  }
  // PRIVATE FUNCTIONS //
  _isApprovalForAllData(array) {
    if (array.length == 0) {
      return false;
    }
    const map = /* @__PURE__ */ new Map();
    array.forEach((item) => {
      if (item instanceof EventLog) {
        map.set(item.blockNumber, item.args.approved);
      } else if (item instanceof Log) {
        const data = item.data;
        const topics = [...item.topics];
        const decodeLog = this.iface.parseLog({ data, topics });
        if (decodeLog === null) {
          throw new Error("Failed to decode log");
        }
        map.set(item.blockNumber, decodeLog.args.approved);
      }
    });
    const returnArr = Array.from(map.values());
    return returnArr[returnArr.length - 1];
  }
  _uniqArrayData(array) {
    const arr = [];
    array.forEach((item) => {
      if (item instanceof EventLog) {
        arr.push(item.args[0]);
      } else if (item instanceof Log) {
        const data = item.data;
        const topics = [...item.topics];
        const decodeLog = this.iface.parseLog({ data, topics });
        if (decodeLog === null) {
          throw new Error("Failed to decode log");
        }
        arr.push(decodeLog.args[0]);
      }
    });
    return arr;
  }
  _uniqTransferData(array) {
    const map = /* @__PURE__ */ new Map();
    array.forEach((item) => {
      let decodeData = {};
      if (item instanceof EventLog) {
        decodeData = {
          tokenId: item.args.tokenId,
          blockNumber: item.blockNumber
        };
      } else if (item instanceof Log) {
        const data = item.data;
        const topics = [...item.topics];
        const decodeLog = this.iface.parseLog({ data, topics });
        if (decodeLog === null) {
          throw new Error("Failed to decode log");
        }
        decodeData = {
          tokenId: decodeLog.args.tokenId,
          blockNumber: item.blockNumber
        };
      }
      map.set(decodeData.tokenId, decodeData);
    });
    return Array.from(map.values());
  }
  _uniqTakeProfitData(array) {
    const map = /* @__PURE__ */ new Map();
    array.forEach((item) => {
      let decodeData = {};
      if (item instanceof EventLog) {
        decodeData = {
          tokenId: item.args.tokenId,
          upperStopPrice: item.args.upperStopPrice,
          lowerStopPrice: item.args.lowerStopPrice,
          blockNumber: item.blockNumber
        };
      } else if (item instanceof Log) {
        const data = item.data;
        const topics = [...item.topics];
        const decodeLog = this.iface.parseLog({ data, topics });
        if (decodeLog === null) {
          throw new Error("Failed to decode log");
        }
        decodeData = {
          tokenId: decodeLog.args.tokenId,
          upperStopPrice: decodeLog.args.upperStopPrice,
          lowerStopPrice: decodeLog.args.lowerStopPrice,
          blockNumber: item.blockNumber
        };
      }
      map.set(decodeData.tokenId, decodeData);
    });
    return Array.from(map.values());
  }
};
export {
  TakeProfitSharwaFinance
};
//# sourceMappingURL=take_profit_sharwaFinance.mjs.map