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

function encodeInputs(inputs: any[] | undefined) {
  if (!inputs || inputs.length === 0) {
    return '';
  }
  return inputs
    .map((input) => {
      if (input.indexed) {
        return `${input.type} indexed ${input.name}`;
      }
      return `${input.type} ${input.name}`;
    })
    .join(', ');
}

function encodeOutputs(outputs: any[] | undefined) {
  if (!outputs || outputs.length === 0) {
    return '';
  }
  const returns = outputs
    .map((output) => {
      if (output.name !== '') {
        return `${output.type} ${output.name}`;
      }
      return output.type;
    })
    .join(', ');
  return ` returns(${returns})`;
}
