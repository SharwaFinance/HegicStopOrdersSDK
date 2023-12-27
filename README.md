# HegicStopOrders SDK Documentation

HegicStopOrdersSDK is a specialized SDK package designed to facilitate interaction with HegicStopOrders contracts. It enables the automatic execution of options based on time and price triggers.

## Features

The SDK facilitates:

1. Enabling Auto-Execution for a specified option.
2. Enabling Auto-Execution for all options.
3. Disabling Auto-Execution for all options.
4. Setting up stop orders that will automatically close the position when a price trigger is met.
5. Updating the trigger price for existing stop orders.
6. Deleting (cancelling) stop orders.
7. Retrieving options for which auto-execution is enabled.
8. Retrieving options for which take profit is enabled.
9. Obtaining the list of auto-executed options.

## Support

If you have questions about how to use the SDK, please reach out in the `#dev-chat` channel in our Discord.

## Initialization:

``` const tps = new TakeProfitSharwa(provider, signer) ```

## Enable Auto-Execution for option:

``` tx = await tps.enableAutoExecutionForOption(7216n) ```

## Enable Auto-Execution for all options:

``` tx = await tps.enableAutoExecutionForAllOptions() ```

## Disable Auto-Execution for all options:

``` tx = await tps.disableAutoExecutionForAllOptions() ```

## Set take profits:

``` tx = await tps.setTakeProfit(7216n, BigInt(1600e8), 0) ```

## Update take profits:

``` tx = await tps.setTakeProfit(7216n, 0, BigInt(1600e8)) ```

## Delete take profits:

``` tx = await tps.deleteTakeProfit(7216n) ```

## Identify options with auto-execution enabled

```const optionsWithAutoExecutionEnabled = await tps.filterOptionsWithAutoExecutionEnabled(deployer.getAddress(), arrAcivaOptions)```

## Identify options with set take profits

```const optionsWithTakeProfits = await tps.filterOptionsWithTakeProfits(arrAcivaOptions)```

## Determine auto-executed options

```const autoExecutedOptions = await tps.getAutoExecutedOptions(arrAcivaOptions)```