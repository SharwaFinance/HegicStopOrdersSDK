import { Contract, Provider, Signer, EventLog, Log, ZeroAddress } from "ethers";
import { Address } from "cluster";
import conf from "./config.json";
import abi_take_profit from "./abi/abi_take_profit.json";
import abi_positions_manager from "./abi/abi_positions_manager.json";
import abi_operational_treasury from "./abi/abi_operational_treasury.json"

type TakeProfitData = {
    tokenId: bigint
    upperStopPrice: number
    lowerStopPrice: number
    blockNumber: bigint
}

export class TakeProfitSharwaFinance {
    signer: Signer
    provider: Provider
    take_profit: Contract
    positions_manager: Contract
    operational_treasury: Contract

    constructor(provider: Provider, signer: Signer) {
        this.provider = provider
        this.signer = signer
        this.take_profit = new Contract(conf.take_profit_address, abi_take_profit, signer)
        this.positions_manager = new Contract(conf.positions_manager_address, abi_positions_manager, signer)
        this.operational_treasury = new Contract(conf.operational_treasury_address, abi_operational_treasury, signer)
    }

    // STATE CHANGE FUNCTIONS //

    async setTakeProfit(tokenId: BigInt, upperStopPrice: BigInt, lowerStopPrice: BigInt) {
        await this.take_profit.setTakeProfit(tokenId, {upperStopPrice, lowerStopPrice})
    }

    async deleteTakeProfit(tokenId: BigInt) {
        await this.take_profit.deleteTakeProfit(tokenId)
    }

    async enableAutoExecutionForAllOptions() {
        await this.positions_manager.setApprovalForAll(conf.take_profit_address, true)
    }

    async disableAutoExecutionForAllOptions() {
        await this.positions_manager.setApprovalForAll(conf.take_profit_address, false)
    }

    async enableAutoExecutionForOption(tokenId: BigInt) {
        await this.positions_manager.approve(conf.take_profit_address, tokenId)
    }

    async disableAutoExecutionForOption(tokenId: BigInt) {
        await this.positions_manager.approve(ZeroAddress, tokenId)
    }

    // FILTER_OPTIONS FUNCTIONS //

    async filterOptionsWithAutoExecutionEnabled(user: Address, arrAcivaOptions: bigint[]): Promise<bigint[]> {
        const ApprovalFilter = this.positions_manager.filters.Approval(user, conf.take_profit_address, null)
        const arrApproval = await this.positions_manager.queryFilter(ApprovalFilter)
        const uniqApprovalLogs = this.uniqTransferData(arrApproval)

        const DisableApprovalFilter = this.positions_manager.filters.Approval(user, ZeroAddress, null)
        const arrDisableApproval = await this.positions_manager.queryFilter(DisableApprovalFilter)
        const uniqDisableApprovalLogs = this.uniqTransferData(arrDisableApproval)

        const ApprovalForAllFilter = this.positions_manager.filters.ApprovalForAll(user, conf.take_profit_address, null)
        const arrApprovalForAll = await this.positions_manager.queryFilter(ApprovalForAllFilter)
        const isApprovalForAll = this.isApprovalForAllData(arrApprovalForAll)

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

    async filterOptionsWithTakeProfits(user: Address, arrAcivaOptions: bigint[]): Promise<Map<bigint,TakeProfitData>> {
        let activeTakeProfits = new Map()

        const TakeProfitSetFilter = this.take_profit.filters.TakeProfitSet(null, user)
        const arrLogsTakeProfitSet = await this.take_profit.queryFilter(TakeProfitSetFilter)
        const uniqSetLogs = this.uniqTakeProfitData(arrLogsTakeProfitSet) 

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

    async getAutoExecutedOptions(user: Address, arrAcivaOptions: bigint[]): Promise<bigint[]> {
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

    async isAutoExecutionEnabledForOption(tokenId: BigInt): Promise<boolean> {
        return await this.positions_manager.isApprovedOrOwner(conf.take_profit_address, tokenId)
    }

    async isAutoExecutionEnabledForAllOptions(user: Address): Promise<boolean> {
        const ApprovalForAllFilter = this.positions_manager.filters.ApprovalForAll(user, conf.take_profit_address, null)
        const arrApprovalForAll = await this.positions_manager.queryFilter(ApprovalForAllFilter)
        return this.isApprovalForAllData(arrApprovalForAll)
    }

    async getActiveTakeProfits(user: Address): Promise<Map<bigint,TakeProfitData>> {
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

    async getAllTakeProfits(user: Address): Promise<Map<bigint,TakeProfitData>> {
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

    async getExecuteTakeProfits(user: Address): Promise<bigint[]> {
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

    async getUserSetLogs(user: Address): Promise<TakeProfitData[]> {
        const TransferInFilter = this.positions_manager.filters.Transfer(null, user, null)
        const arrLogsTransferIn = await this.positions_manager.queryFilter(TransferInFilter)
        const uniqTransfersIn = this.uniqTransferData(arrLogsTransferIn)

        const TransferOutFilter = this.positions_manager.filters.Transfer(user, null, null)
        const arrLogsTransferOut = await this.positions_manager.queryFilter(TransferOutFilter)
        const uniqTransfersOut = this.uniqTransferData(arrLogsTransferOut)

        const TakeProfitSetFilter = this.take_profit.filters.TakeProfitSet(null, user)
        const arrLogsTakeProfitSet = await this.take_profit.queryFilter(TakeProfitSetFilter)
        const uniqSetLogs = this.uniqTakeProfitData(arrLogsTakeProfitSet) 

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

    // ASSISTANT FUNCTIONS //

    isApprovalForAllData(array: (EventLog | Log)[]): boolean {
        if (array.length == 0) {
            return false
        }
        const map = new Map();
        array.forEach(item => {
            if (item instanceof EventLog) {
                map.set(
                    item.blockNumber, item.args.approved);
                }
          })
        const returnArr = Array.from(map.values())
        return returnArr[returnArr.length-1];
    }

    uniqArrayData(array: (EventLog | Log)[]): bigint[] {
        const arr: bigint[] = []
        array.forEach(item => {
            if (item instanceof EventLog) {
                arr.push(item.args[0])
            }
        })
        return arr
    }

    uniqTransferData(array: (EventLog | Log)[]): {tokenId:bigint, blockNumber:bigint}[] {
        const map = new Map();
        array.forEach(item => {
            if (item instanceof EventLog) {
                map.set(
                    item.args.tokenId, {
                        tokenId: item.args.tokenId,
                        blockNumber: item.blockNumber
                    });
                }
          })
        return Array.from(map.values());
    }

    uniqTakeProfitData(array: (EventLog | Log)[]): TakeProfitData[] {
        const map = new Map();
        array.forEach(item => {
            if (item instanceof EventLog) {
              map.set(
                item.args.tokenId, {
                tokenId: item.args.tokenId, 
                upperStopPrice: item.args.upperStopPrice, 
                lowerStopPrice: item.args.lowerStopPrice,
                blockNumber: item.blockNumber
                });
            }
          })
        return Array.from(map.values());
    }
}