import { Signer, Provider, Contract, Interface } from 'ethers';

type TakeProfitData = {
    tokenId: bigint;
    upperStopPrice: number;
    lowerStopPrice: number;
    blockNumber: number;
};
declare class TakeProfitSharwaFinance {
    signer: Signer;
    provider: Provider;
    take_profit: Contract;
    positions_manager: Contract;
    operational_treasury: Contract;
    iface: Interface;
    constructor(provider: Provider, signer: Signer);
    setTakeProfit(tokenId: bigint, upperStopPrice: bigint, lowerStopPrice: bigint): Promise<any>;
    deleteTakeProfit(tokenId: bigint): Promise<void>;
    enableAutoExecutionForAllOptions(): Promise<void>;
    disableAutoExecutionForAllOptions(): Promise<void>;
    enableAutoExecutionForOption(tokenId: bigint): Promise<void>;
    disableAutoExecutionForOption(tokenId: bigint): Promise<void>;
    filterOptionsWithAutoExecutionEnabled(user: string, arrAcivaOptions: bigint[]): Promise<bigint[]>;
    filterOptionsWithTakeProfits(user: string, arrAcivaOptions: bigint[]): Promise<Map<bigint, TakeProfitData>>;
    getAutoExecutedOptions(user: string, arrAcivaOptions: bigint[]): Promise<bigint[]>;
    isAutoExecutionEnabledForOption(tokenId: bigint): Promise<boolean>;
    isAutoExecutionEnabledForAllOptions(user: string): Promise<boolean>;
    getActiveTakeProfits(user: string): Promise<Map<bigint, TakeProfitData>>;
    getAllTakeProfits(user: string): Promise<Map<bigint, TakeProfitData>>;
    getExecuteTakeProfits(user: string): Promise<bigint[]>;
    getUserSetLogs(user: string): Promise<TakeProfitData[]>;
    private _isApprovalForAllData;
    private _uniqArrayData;
    private _uniqTransferData;
    private _uniqTakeProfitData;
}

export { TakeProfitSharwaFinance };
