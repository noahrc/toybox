/* global describe, it, before, expect, context */

import { expect } from 'chai';
import parseVariables from '../build/index.js';

describe('parse variables', () => {
  it('should parse a string with a variable and return a function', (done) => {
    const testData = '%{testVar}';
    const result = parseVariables(testData);
    expect(typeof result).to.equal('function');
    done();
  });

  it('should pass matching key values from an object into a parsed variable', (done) => {
    const testData = {
      testVar: 'foo',
      string: '%{testVar}',
    };
    const result = parseVariables(testData);
    expect(result.string()).to.equal('foo');
    done();
  });

  it('should render multiple interpolated variables in a string', (done) => {
    const testData = {
      testVar: 'foo',
      baz: 'biz',
      string: 'testVar is %{testVar} and baz is %{baz}.',
    };
    const result = parseVariables(testData);
    expect(result.string).to.equal('testVar is foo and baz is biz.');
    done();
  });

  it('should pass the closest matching key values in an object to a parsed variable', (done) => {
    const testData = {
      testVar: 'foo',
      baz: [
        {
          testVar: 'baz',
          string: '%{testVar}',
        },
      ],
      string: '%{testVar}',
    };
    const result = parseVariables(testData);
    expect(result.string()).to.equal('foo');
    expect(result.baz[0].string()).to.equal('baz');
    done();
  });
});
