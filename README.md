# TakeProfitSharwa

**Initialization:**

``` const tps = new TakeProfitSharwa(provider, signer) ```

**Enable Auto-Execution for option:**

``` await tps.enableAutoExecutionForOption(7216n) ```

**Enable Auto-Execution for all options:**

``` await tps.enableAutoExecutionForAllOptions() ```

**Disable Auto-Execution for all options:**

``` await tps.disableAutoExecutionForAllOptions() ```

**Set take profits:**

``` await tps.setTakeProfit(7216n, BigInt(1600e8), 0) ```

**Update take profits:**

``` await tps.setTakeProfit(7216n, 0, BigInt(1600e8)) ```

**Delete take profits:**

``` await tps.deleteTakeProfit(7216n) ```

**Identify options with auto-execution enabled**

```const optionsWithAutoExecutionEnabled = await tps.filterOptionsWithAutoExecutionEnabled(deployer.getAddress(), arrAcivaOptions)```

**Identify options with set take profits**

```const optionsWithTakeProfits = await tps.filterOptionsWithTakeProfits(deployer.getAddress(), arrAcivaOptions)```

**Determine auto-executed options**

```const autoExecutedOptions = await tps.getAutoExecutedOptions(deployer.getAddress(), arrAcivaOptions)```

**Get active take profits:**

```const activeTakeProfits = await tps.getActiveTakeProfits(deployer.getAddress()) ```

**Get all take profits:**

``` const allTakeProfits = await tps.getAllTakeProfits(deployer.getAddress()) ```

**Receive executed take profits:**

``` const executeTakeProfits = await tps.getExecuteTakeProfits(deployer.getAddress()) ```