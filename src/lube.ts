import {
  Transfer as TransferEvent
} from "../generated/LUBE/LUBE"

import {TokenHolder} from "../generated/schema"
//import the functions defined in utils.ts
import {
  fetchTokenDetails,
  fetchAccount,
} from "./utils"
//import datatype
import { BigDecimal} from "@graphprotocol/graph-ts";

export function handleTransfer(event: TransferEvent): void {
    let token = fetchTokenDetails(event);
    if (!token) {
      return;
    }

    //get account addresses from event
    let fromAddress = event.params.from.toHex();
    let toAddress = event.params.to.toHex();

    //fetch account details
    let fromAccount = fetchAccount(fromAddress);
    let toAccount = fetchAccount(toAddress);

    if (!fromAccount || !toAccount) {
      return;
    }

    let fromId = `${token.id}-${fromAccount.id}`
    let fromTokenHolder = TokenHolder.load(fromId);
    if (!fromTokenHolder) {
      fromTokenHolder = new TokenHolder(fromId);
      fromTokenHolder.token = token.id;
      fromTokenHolder.account = fromAccount.id;

      fromTokenHolder.save();
    }

    let toId = `${token.id}-${toAccount.id}`
    let toTokenHolder = TokenHolder.load(toId);
    if (!toTokenHolder) {
      toTokenHolder = new TokenHolder(toId);
      toTokenHolder.token = token.id;
      toTokenHolder.account = toAccount.id;

      toTokenHolder.save();
    }
}
