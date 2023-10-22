import { Contract, Provider, Signer, EventLog, Log } from "ethers";
import { AbiTakeProfit, AddressTakeProfit } from "./abi/AbiTakeProfit"
import { Address } from "cluster";

export class TakeProfitSharwa {
    signer: Signer
    provider: Provider
    takeProfit: Contract

    constructor(_provider: Provider, _signer: Signer) {
        this.provider = _provider
        this.signer = _signer
        this.takeProfit = new Contract(AddressTakeProfit, AbiTakeProfit, _signer)
    }

    async setTakeProfit(tokenId: BigInt, upperStopPrice: BigInt, lowerStopPrice: BigInt) {
        await this.takeProfit.setTakeProfit(tokenId, {upperStopPrice, lowerStopPrice})
    }

    async updateTakeProfit(tokenId: BigInt, upperStopPrice: BigInt, lowerStopPrice: BigInt) {
        await this.takeProfit.updateTakeProfit(tokenId, {upperStopPrice, lowerStopPrice})
    }

    async deleteTakeProfit(tokenId: BigInt) {
        await this.takeProfit.deleteTakeProfit(tokenId)
    }

    uniqByMap<T>(array: T[]): T[] {
        const map = new Map();
        for (const item of array) {
            map.set(
                item.args.tokenId, {
                tokenId: item.args.tokenId, 
                upperStopPrice: item.args.upperStopPrice, 
                lowerStopPrice: item.args.lowerStopPrice,
                blockNumber: item.blockNumber
            });
        }
        return Array.from(map.values());
    }

    async getActiveTakeProfits(user: Address) {
        const TakeProfitSetFilter = this.takeProfit.filters.TakeProfitSet(null, user)
        const arrLogsTakeProfitSet = (await this.takeProfit.queryFilter(TakeProfitSetFilter)).reverse()

        let activeTakeProfits = new Map()
        const uniqSetLogs = this.uniqByMap(arrLogsTakeProfitSet) 

        for (const i in uniqSetLogs) {
            const TakeProfitDeletedFilter = this.takeProfit.filters.TakeProfitDeleted(uniqSetLogs[i].tokenId)
            const logTakeProfitDeleted = await this.takeProfit.queryFilter(TakeProfitDeletedFilter)
    
            const TakeProfitExecutedFilter = this.takeProfit.filters.TakeProfitExecuted(uniqSetLogs[i].tokenId)
            const logTakeProfitExecuted = await this.takeProfit.queryFilter(TakeProfitExecutedFilter)

            const lastDeleteBlockNumber = logTakeProfitDeleted.length == 0 ? 
                0 : 
                logTakeProfitDeleted[logTakeProfitDeleted.length-1].blockNumber

            if (lastDeleteBlockNumber < arrLogsTakeProfitSet[i].blockNumber && logTakeProfitExecuted.length == 0) {
                if ((uniqSetLogs[i].upperStopPrice == 0 && uniqSetLogs[i].lowerStopPrice == 0) == false) {
                    activeTakeProfits.set(
                        uniqSetLogs[i].tokenId, {
                        upperStopPrice: uniqSetLogs[i].upperStopPrice,
                        lowerStopPrice: uniqSetLogs[i].lowerStopPrice
                    })
                }
            }
        }

        return activeTakeProfits
    }

    async getAllTakeProfits(user: Address) {
        const TakeProfitSetFilter = this.takeProfit.filters.TakeProfitSet(null, user)
        const arrLogsTakeProfitSet = (await this.takeProfit.queryFilter(TakeProfitSetFilter)).reverse()

        let allTakeProfits = new Map()
        const uniqSetLogs = this.uniqByMap(arrLogsTakeProfitSet) 

        for (const i in uniqSetLogs) {
            const TakeProfitDeletedFilter = this.takeProfit.filters.TakeProfitDeleted(uniqSetLogs[i].tokenId)
            const logTakeProfitDeleted = await this.takeProfit.queryFilter(TakeProfitDeletedFilter)

            const lastDeleteBlockNumber = logTakeProfitDeleted.length == 0 ? 
                0 : 
                logTakeProfitDeleted[logTakeProfitDeleted.length-1].blockNumber

            if (lastDeleteBlockNumber < arrLogsTakeProfitSet[i].blockNumber) {
                allTakeProfits.set(
                    uniqSetLogs[i].tokenId, {
                    upperStopPrice: uniqSetLogs[i].upperStopPrice,
                    lowerStopPrice: uniqSetLogs[i].lowerStopPrice
                })
            }
        }

        return allTakeProfits
    }

    async getExecuteTakeProfits(user: Address) {
        const TakeProfitExecutedFilter = this.takeProfit.filters.TakeProfitExecuted(user)
        const arrLogsTakeProfitExecuted = (await this.takeProfit.queryFilter(TakeProfitExecutedFilter)).reverse()

        let executeTakeProfits = []

        for (const i in arrLogsTakeProfitExecuted) {
            const arg = arrLogsTakeProfitExecuted.args
            executeTakeProfits.push(arg.tokenId)
        }

        return executeTakeProfits
    }

}