import {waffleJest} from '@ethereum-waffle/jest';

jest.setTimeout(10000);
expect.extend(waffleJest);
