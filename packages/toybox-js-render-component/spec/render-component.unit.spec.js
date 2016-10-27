/* global describe, it */
/* prefer-arrow-callback: ["error", { "allowNamedFunctions": true }] */

import { expect } from 'chai';
import renderComponent from './../build/index.js';

// Import local templates for testing
// The mustache loader turns the mustache templates into functions
import pTemplate from '!mustache!./p.mustache';

describe('Render component', () => {

  it('should render a "p" component with a modifier and some content.', (done) => {
    const testData = {
      __render: 'p/p',
      p__modifiers: ['test'],
      p__content: 'Test paragraph.',
    };
    const expectedResult = '<p class="p p--test  "  >Test paragraph.</p>\n';
    const result = renderComponent(testData, pTemplate);
    expect(result).to.equal(expectedResult);
    done();
  });

  it('should merge an array in data with a matching array in default data.', (done) => {
    const testData = {
      __render: 'p/p',
      p__content: 'Test paragraph.',
      p__classes: ['testClass'],
    };
    const defaultData = {
      p__classes: ['defaultClass'],
    };
    const expectedResult = '<p class="p  defaultClass testClass "  >Test paragraph.</p>\n';
    const result = renderComponent(testData, pTemplate, defaultData);
    expect(result).to.equal(expectedResult);
    done();
  });

});
