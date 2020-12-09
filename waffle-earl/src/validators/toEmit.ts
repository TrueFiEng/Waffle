import {Expectation, smartEq} from 'earljs/internals';
import {Contract, providers} from 'ethers';
import {LogDescription} from 'ethers/lib/utils';
import {getControl} from '../utils';

export async function toEmit(
  this: Expectation<
  | providers.TransactionResponse
  | providers.TransactionReceipt
  | Promise<providers.TransactionResponse | providers.TransactionReceipt>
  >,
  contract: Contract,
  event: string,
  args?: any[]
): Promise<void> {
  const ctrl = getControl(this);

  let hasEvent = false;
  try {
    contract.interface.getEvent(event);
    hasEvent = true;
  } catch {}
  if (!hasEvent) {
    const message =
      `Event ${event} does not exist on the provided contract!\n` +
      'Make sure you have compiled the latest version.';
    ctrl.assert({
      success: ctrl.isNegated,
      reason: message,
      negatedReason: message
    });
  }

  const tx = await Promise.resolve(ctrl.actual);
  const receipt = isResponse(tx) ? await tx.wait() : tx;

  const events: LogDescription[] = [];
  for (const log of receipt.logs) {
    if (log.address === contract.address) {
      try {
        events.push(contract.interface.parseLog(log));
      } catch {}
    }
  }

  if (!args) {
    ctrl.assert({
      success: events.some((x) => x.name === event),
      reason: `Event ${event} was not emitted by the provided contract.`,
      negatedReason: `Event ${event} was emitted by the provided contract.`
    });
  } else {
    const relevant = events
      .filter((x) => x.name === event)
      .map((x) => [...x.args]);
    const success = relevant.some((x) => smartEq(x, args).result === 'success');
    ctrl.assert({
      success: success,
      reason: `Event ${event} was not emitted by the provided contract TODO: ARGS.`,
      negatedReason: `Event ${event} was emitted by the provided contract TODO: ARGS.`
    });
  }
}

function isResponse(
  value: providers.TransactionResponse | providers.TransactionReceipt
): value is providers.TransactionResponse {
  return 'wait' in value;
}
