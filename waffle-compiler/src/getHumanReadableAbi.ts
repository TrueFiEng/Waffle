export function getHumanReadableAbi(abi: any[]) {
  return abi
    .filter((entry) => ['function', 'constructor', 'event'].includes(entry.type))
    .map((entry) => {
      switch (entry.type) {
        case 'function': return encodeFunction(entry);
        case 'constructor': return encodeConstructor(entry);
        case 'event': return encodeEvent(entry);
        default: throw new TypeError('Unrecognized entry type');
      }
    });
}

function encodeFunction(entry: any) {
  let declaration = `function ${entry.name}(${encodeInputs(entry.inputs)})`;
  if (entry.stateMutability !== 'nonpayable') {
    declaration += ` ${entry.stateMutability}`;
  }
  return declaration + encodeOutputs(entry.outputs);
}

function encodeConstructor(entry: any) {
  return `constructor(${encodeInputs(entry.inputs)})`;
}

function encodeEvent(entry: any) {
  return `event ${entry.name}(${encodeInputs(entry.inputs)})`;
}

interface SolidityValue {
  type: string;
  name?: string;
  indexed?: boolean;
  components?: SolidityValue[];
}

function encodeInputs(inputs: SolidityValue[] | undefined) {
  if (!inputs || inputs.length === 0) {
    return '';
  }
  return inputs.map(encodeSolidityValue).join(', ');
}

function encodeOutputs(outputs: SolidityValue[] | undefined) {
  if (!outputs || outputs.length === 0) {
    return '';
  }
  const returns = outputs.map(encodeSolidityValue).join(', ');
  return ` returns(${returns})`;
}

export function encodeSolidityValue({type, components, indexed, name}: SolidityValue) {
  let result = type;
  if (result.includes('tuple') && components) {
    const members = components.map(encodeSolidityValue).join(', ');
    result = result.replace('tuple', `tuple(${members})`);
  }
  if (indexed) {
    result += ' indexed';
  }
  if (name) {
    result += ` ${name}`;
  }
  return result;
}
