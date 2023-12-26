# TakeProfitSharwa

**Initialization:**

``` const tps = new TakeProfitSharwa(provider, signer) ```

**Enable Auto-Execution for option:**

``` tx = await tps.enableAutoExecutionForOption(7216n) ```

**Enable Auto-Execution for all options:**

``` tx = await tps.enableAutoExecutionForAllOptions() ```

**Disable Auto-Execution for all options:**

``` tx = await tps.disableAutoExecutionForAllOptions() ```

**Set take profits:**

``` tx = await tps.setTakeProfit(7216n, BigInt(1600e8), 0) ```

**Update take profits:**

``` tx = await tps.setTakeProfit(7216n, 0, BigInt(1600e8)) ```

**Delete take profits:**

``` tx = await tps.deleteTakeProfit(7216n) ```

**Identify options with auto-execution enabled**

```const optionsWithAutoExecutionEnabled = await tps.filterOptionsWithAutoExecutionEnabled(deployer.getAddress(), arrAcivaOptions)```

**Identify options with set take profits**

```const optionsWithTakeProfits = await tps.filterOptionsWithTakeProfits(arrAcivaOptions)```

**Determine auto-executed options**

```const autoExecutedOptions = await tps.getAutoExecutedOptions(arrAcivaOptions)```