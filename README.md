# TakeProfitSharwa

initialization

``` const tps = new TakeProfitSharwa(provider, signer) ```

set
``` await tps.setTakeProfit(7216n, BigInt(1600e8), 0) ```

update
``` await tps.setTakeProfit(7216n, 0, BigInt(1600e8)) ```

del
``` await tps.deleteTakeProfit(7216n) ```

ActiveTakeProfits
``` await tps.getActiveTakeProfits(deployer.getAddress()) ```

AllTakeProfits
``` await tps.getAllTakeProfits(deployer.getAddress()) ```

ExecuteTakeProfits
``` await tps.getExecuteTakeProfits(deployer.getAddress()) ```