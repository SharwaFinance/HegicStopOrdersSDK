import { Contract, Provider, Signer, EventLog, Log, Interface, ZeroAddress } from "ethers";
import conf from "./config.json";
import abi_take_profit from "./abi/abi_take_profit.json";
import abi_positions_manager from "./abi/abi_positions_manager.json";
import abi_operational_treasury from "./abi/abi_operational_treasury.json"

type TakeProfitData = {
    tokenId: bigint
    upperStopPrice: number
    lowerStopPrice: number
    blockNumber: number
}

type TransferData = {
    tokenId: bigint,
    blockNumber: number
}

export class TakeProfitSharwaFinance {
    signer: Signer
    provider: Provider
    take_profit: Contract
    positions_manager: Contract
    operational_treasury: Contract
    iface: Interface

    constructor(provider: Provider, signer: Signer) {
        this.provider = provider
        this.signer = signer
        this.take_profit = new Contract(conf.take_profit_address, abi_take_profit, signer)
        this.positions_manager = new Contract(conf.positions_manager_address, abi_positions_manager, signer)
        this.operational_treasury = new Contract(conf.operational_treasury_address, abi_operational_treasury, signer)
        this.iface = new Interface(abi_take_profit)
    }

    // STATE CHANGE FUNCTIONS //

    async setTakeProfit(tokenId: bigint, upperStopPrice: bigint, lowerStopPrice: bigint) {
        await this.take_profit.setTakeProfit(tokenId, {upperStopPrice, lowerStopPrice})
    }

    async deleteTakeProfit(tokenId: bigint) {
        await this.take_profit.deleteTakeProfit(tokenId)
    }

    async enableAutoExecutionForAllOptions() {
        await this.positions_manager.setApprovalForAll(conf.take_profit_address, true)
    }

    async disableAutoExecutionForAllOptions() {
        await this.positions_manager.setApprovalForAll(conf.take_profit_address, false)
    }

    async enableAutoExecutionForOption(tokenId: bigint) {
        await this.positions_manager.approve(conf.take_profit_address, tokenId)
    }

    async disableAutoExecutionForOption(tokenId: bigint) {
        await this.positions_manager.approve(ZeroAddress, tokenId)
    }

    // FILTER_OPTIONS FUNCTIONS //

    async filterOptionsWithAutoExecutionEnabled(user: string, arrAcivaOptions: bigint[]): Promise<bigint[]> {
        const ApprovalFilter = this.positions_manager.filters.Approval(user, conf.take_profit_address, null)
        const arrApproval = await this.positions_manager.queryFilter(ApprovalFilter)
        const uniqApprovalLogs = this._uniqTransferData(arrApproval)

        const DisableApprovalFilter = this.positions_manager.filters.Approval(user, ZeroAddress, null)
        const arrDisableApproval = await this.positions_manager.queryFilter(DisableApprovalFilter)
        const uniqDisableApprovalLogs = this._uniqTransferData(arrDisableApproval)

        const ApprovalForAllFilter = this.positions_manager.filters.ApprovalForAll(user, conf.take_profit_address, null)
        const arrApprovalForAll = await this.positions_manager.queryFilter(ApprovalForAllFilter)
        const isApprovalForAll = this._isApprovalForAllData(arrApprovalForAll)

        const autoExecutionOptions: bigint[] = []

        for (const i in arrAcivaOptions) {
            const logApproval = uniqApprovalLogs.find(elem=> elem.tokenId === arrAcivaOptions[i]);
            const logDisableApproval = uniqDisableApprovalLogs.find(elem=> elem.tokenId === arrAcivaOptions[i]);

            let isApproved: boolean = true

            if (logDisableApproval != undefined && logApproval != undefined) {
                if (logDisableApproval.blockNumber > logApproval.blockNumber) {
                    isApproved = false
                }
            } 

            if (isApprovalForAll) {
                autoExecutionOptions.push(arrAcivaOptions[i])
            } else {
                if (logApproval != undefined && isApproved) {
                    autoExecutionOptions.push(arrAcivaOptions[i])
                }
            }
        }

        return autoExecutionOptions
    }

    async filterOptionsWithTakeProfits(user: string, arrAcivaOptions: bigint[]): Promise<Map<bigint,TakeProfitData>> {
        let activeTakeProfits = new Map()

        const TakeProfitSetFilter = this.take_profit.filters.TakeProfitSet(null, user)
        const arrLogsTakeProfitSet = await this.take_profit.queryFilter(TakeProfitSetFilter)
        const uniqSetLogs = this._uniqTakeProfitData(arrLogsTakeProfitSet) 

        for (const i in arrAcivaOptions) {
            const logSet = uniqSetLogs.find(elem=> elem.tokenId === arrAcivaOptions[i]);

            const TakeProfitDeletedFilter = this.take_profit.filters.TakeProfitDeleted(arrAcivaOptions[i])
            const logTakeProfitDeleted = await this.take_profit.queryFilter(TakeProfitDeletedFilter)
    
            const TakeProfitExecutedFilter = this.take_profit.filters.TakeProfitExecuted(arrAcivaOptions[i], null)
            const logTakeProfitExecuted = await this.take_profit.queryFilter(TakeProfitExecutedFilter)

            const lastDeleteBlockNumber = logTakeProfitDeleted.length == 0 ? 
                0 : 
                logTakeProfitDeleted[logTakeProfitDeleted.length-1].blockNumber

            if (logSet != undefined) {
                if (lastDeleteBlockNumber < logSet.blockNumber && logTakeProfitExecuted.length == 0) {
                    if ((logSet.upperStopPrice == 0 && logSet.lowerStopPrice == 0) == false) {
                        activeTakeProfits.set(
                            logSet.tokenId, {
                            upperStopPrice: logSet.upperStopPrice,
                            lowerStopPrice: logSet.lowerStopPrice
                        })
                    }
                }
            }

        }

        return activeTakeProfits
    }

    async getAutoExecutedOptions(user: string, arrAcivaOptions: bigint[]): Promise<bigint[]> {
        let executeTakeProfits: bigint[] = []

        for (const i in arrAcivaOptions) {
            const TakeProfitExecutedFilter = this.take_profit.filters.TakeProfitExecuted(arrAcivaOptions[i], null)
            const logTakeProfitExecuted = await this.take_profit.queryFilter(TakeProfitExecutedFilter)

            if (logTakeProfitExecuted.length != 0) {
                executeTakeProfits.push(arrAcivaOptions[i])
            }
        }

        return executeTakeProfits
    }

    // DATA QUERY FUNCTIONS //

    async isAutoExecutionEnabledForOption(tokenId: bigint): Promise<boolean> {
        return await this.positions_manager.isApprovedOrOwner(conf.take_profit_address, tokenId)
    }

    async isAutoExecutionEnabledForAllOptions(user: string): Promise<boolean> {
        const ApprovalForAllFilter = this.positions_manager.filters.ApprovalForAll(user, conf.take_profit_address, null)
        const arrApprovalForAll = await this.positions_manager.queryFilter(ApprovalForAllFilter)
        return this._isApprovalForAllData(arrApprovalForAll)
    }

    async getActiveTakeProfits(user: string): Promise<Map<bigint,TakeProfitData>> {
        let activeTakeProfits = new Map()
        const userSetLogs = await this.getUserSetLogs(user)

        for (const i in userSetLogs) {
            const TakeProfitDeletedFilter = this.take_profit.filters.TakeProfitDeleted(userSetLogs[i].tokenId)
            const logTakeProfitDeleted = await this.take_profit.queryFilter(TakeProfitDeletedFilter)
    
            const TakeProfitExecutedFilter = this.take_profit.filters.TakeProfitExecuted(userSetLogs[i].tokenId, null)
            const logTakeProfitExecuted = await this.take_profit.queryFilter(TakeProfitExecutedFilter)

            const lastDeleteBlockNumber = logTakeProfitDeleted.length == 0 ? 
                0 : 
                logTakeProfitDeleted[logTakeProfitDeleted.length-1].blockNumber

            if (lastDeleteBlockNumber < userSetLogs[i].blockNumber && logTakeProfitExecuted.length == 0) {
                if ((userSetLogs[i].upperStopPrice == 0 && userSetLogs[i].lowerStopPrice == 0) == false) {
                    activeTakeProfits.set(
                        userSetLogs[i].tokenId, {
                        upperStopPrice: userSetLogs[i].upperStopPrice,
                        lowerStopPrice: userSetLogs[i].lowerStopPrice
                    })
                }
            }
        }

        return activeTakeProfits
    }

    async getAllTakeProfits(user: string): Promise<Map<bigint,TakeProfitData>> {
        let allTakeProfits = new Map()
        const userSetLogs = await this.getUserSetLogs(user)

        for (const i in userSetLogs) {
            const TakeProfitDeletedFilter = this.take_profit.filters.TakeProfitDeleted(userSetLogs[i].tokenId)
            const logTakeProfitDeleted = await this.take_profit.queryFilter(TakeProfitDeletedFilter)

            const lastDeleteBlockNumber = logTakeProfitDeleted.length == 0 ? 
                0 : 
                logTakeProfitDeleted[logTakeProfitDeleted.length-1].blockNumber

            if (lastDeleteBlockNumber < userSetLogs[i].blockNumber) {
                allTakeProfits.set(
                    userSetLogs[i].tokenId, {
                    upperStopPrice: userSetLogs[i].upperStopPrice,
                    lowerStopPrice: userSetLogs[i].lowerStopPrice
                })
            }
        }

        return allTakeProfits
    }

    async getExecuteTakeProfits(user: string): Promise<bigint[]> {
        const TakeProfitExecutedFilter = this.take_profit.filters.TakeProfitExecuted(null, user)
        const arrLogsTakeProfitExecuted = (await this.take_profit.queryFilter(TakeProfitExecutedFilter)).reverse()

        let executeTakeProfits: bigint[] = []

        for (const i in arrLogsTakeProfitExecuted) {
            const log = arrLogsTakeProfitExecuted[i]
            if (log instanceof EventLog) {
                const arg = log.args
                executeTakeProfits.push(arg.tokenId)
            }
        }

        return executeTakeProfits
    }

    async getUserSetLogs(user: string): Promise<TakeProfitData[]> {
        const TransferInFilter = this.positions_manager.filters.Transfer(null, user, null)
        const arrLogsTransferIn = await this.positions_manager.queryFilter(TransferInFilter)
        const uniqTransfersIn = this._uniqTransferData(arrLogsTransferIn)

        const TransferOutFilter = this.positions_manager.filters.Transfer(user, null, null)
        const arrLogsTransferOut = await this.positions_manager.queryFilter(TransferOutFilter)
        const uniqTransfersOut = this._uniqTransferData(arrLogsTransferOut)

        const TakeProfitSetFilter = this.take_profit.filters.TakeProfitSet(null, user)
        const arrLogsTakeProfitSet = await this.take_profit.queryFilter(TakeProfitSetFilter)
        const uniqSetLogs = this._uniqTakeProfitData(arrLogsTakeProfitSet) 

        const userSetLogs: TakeProfitData[] = []

        for (const i in uniqTransfersIn) {
            const logIn = uniqTransfersIn.find(elem=> elem.tokenId === uniqTransfersIn[i].tokenId);
            const logOut = uniqTransfersOut.find(elem=> elem.tokenId === uniqTransfersIn[i].tokenId);
            const logSet = uniqSetLogs.find(elem=> elem.tokenId === uniqTransfersIn[i].tokenId);
            if (logIn != undefined && logOut != undefined) {
                if (logIn.blockNumber > logOut.blockNumber && logSet != undefined) {
                    userSetLogs.push(logSet)
                }
            } else if (logOut == undefined) {
                if (logIn != undefined && logSet != undefined) {
                    userSetLogs.push(logSet)
                }
            }
        }

        return userSetLogs
    }

    // PRIVATE FUNCTIONS //

    private _isApprovalForAllData(array: (EventLog | Log)[]): boolean {
        if (array.length == 0) {
            return false
        }
        const map = new Map();
        array.forEach(item => {
            if (item instanceof EventLog) {
                map.set(item.blockNumber, item.args.approved);
            } else if (item instanceof Log) {
                const data = item.data
                const topics = [...item.topics]
                const decodeLog = this.iface.parseLog({data, topics})
                if (decodeLog === null) {
                    throw new Error("Failed to decode log");
                }
                map.set(item.blockNumber, decodeLog.args.approved);
            }
          })
        const returnArr = Array.from(map.values())
        return returnArr[returnArr.length-1];
    }

    private _uniqArrayData(array: (EventLog | Log)[]): bigint[] {
        const arr: bigint[] = []
        array.forEach(item => {
            if (item instanceof EventLog) {
                arr.push(item.args[0])
            } else if (item instanceof Log) {
                const data = item.data
                const topics = [...item.topics]
                const decodeLog = this.iface.parseLog({data, topics})
                if (decodeLog === null) {
                    throw new Error("Failed to decode log");
                }
                arr.push(decodeLog.args[0])
            }
        })
        return arr
    }

    private _uniqTransferData(array: (EventLog | Log)[]): TransferData[] {
        const map = new Map<bigint,TransferData>();
        array.forEach(item => {
            let decodeData: TransferData = {} as TransferData;
            if (item instanceof EventLog) {
                decodeData = {
                    tokenId: item.args.tokenId,
                    blockNumber: item.blockNumber
                }
            } else if (item instanceof Log) {
                const data = item.data
                const topics = [...item.topics]
                const decodeLog = this.iface.parseLog({data, topics})
                if (decodeLog === null) {
                    throw new Error("Failed to decode log");
                }
                decodeData = {
                    tokenId: decodeLog.args.tokenId,
                    blockNumber: item.blockNumber
                }
            }
            map.set(decodeData.tokenId, decodeData);
          })
        return Array.from(map.values());
    }

    private _uniqTakeProfitData(array: (EventLog | Log)[]): TakeProfitData[] {
        const map = new Map<bigint, TakeProfitData>();
        array.forEach(item => {
            let decodeData: TakeProfitData = {} as TakeProfitData;
            if (item instanceof EventLog) {
                decodeData = {
                    tokenId: item.args.tokenId, 
                    upperStopPrice: item.args.upperStopPrice, 
                    lowerStopPrice: item.args.lowerStopPrice,
                    blockNumber: item.blockNumber
                }
            } else if (item instanceof Log) {
                const data = item.data
                const topics = [...item.topics]
                const decodeLog = this.iface.parseLog({data, topics})
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
          })
        return Array.from(map.values());
    }
}