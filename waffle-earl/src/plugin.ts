import { AMatcher, buildSmartEqResult, Control, Expectation, Matcher, SmartEqRule } from 'earljs/internals'

export class EvenNumberMatcher extends Matcher {
  toString() {
    return '[EvenNumberMatcher]'
  }

  check(value: unknown): boolean {
    const aMatcher = new AMatcher(Number) // use core matcher
    return aMatcher.check(value) && (value as number) % 2 === 0
  }

  static make(): number {
    return new EvenNumberMatcher() as any
  }
}

export function toBeEven(this: Expectation<number>): void {
  // note: we need to cast this here because getControl is private and we are outside of the Expectation class
  const ctrl: Control<number> = (this as any).getControl()

  ctrl.assert({
    success: ctrl.actual % 2 === 0,
    reason: `Number ${ctrl.actual} is not even!`,
    negatedReason: `Number ${ctrl.actual} is even!`,
  })
}

const evilSmartEqRule: SmartEqRule = (actual, expected) => {
  if (actual === 2 && expected === 2) {
    return buildSmartEqResult(false)
  }
}

export const plugin = {
  matchers: { evenNumber: EvenNumberMatcher.make },
  validators: { toBeEven },
  smartEqRules: [evilSmartEqRule],
}

type Matchers = (typeof plugin)['matchers']
type Validators = (typeof plugin)['validators']

declare module 'earljs' {
  interface ExpectInterface extends Matchers {}

  interface Expectation<T> extends Validators {}
}
