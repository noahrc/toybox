/* global describe, it */

import { expect } from 'chai';
import xtype from './../index.js';

describe('xtype array_like', () => {
  it('should return false if the typeof argument is not "object"', () => {
    const arg = function () { };
    expect(xtype.is(arg, 'array_like')).to.be.false;
  });

  it('should return false if the argument does not have a forEach method', () => {
    const arg = { forEach: {} };
    expect(xtype.is(arg, 'array_like')).to.be.false;
  });

  it('should return true if the argument is an Array', () => {
    const arg = [];
    expect(xtype.is(arg, 'array_like')).to.be.true;
  });

  it('should return true if the argument has a forEach method', () => {
    const arg = {
      forEach: () => { },
    };
    expect(xtype.is(arg, 'array_like')).to.be.true;
  });
});
