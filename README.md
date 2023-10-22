# TakeProfitSharwa

**Initialization:**

``` const tps = new TakeProfitSharwa(provider, signer) ```

Set:

``` await tps.setTakeProfit(7216n, BigInt(1600e8), 0) ```

Update:

``` await tps.setTakeProfit(7216n, 0, BigInt(1600e8)) ```

Del:

``` await tps.deleteTakeProfit(7216n) ```

ActiveTakeProfits:

``` await tps.getActiveTakeProfits(deployer.getAddress()) ```

AllTakeProfits:

``` await tps.getAllTakeProfits(deployer.getAddress()) ```

ExecuteTakeProfits:

``` await tps.getExecuteTakeProfits(deployer.getAddress()) ```