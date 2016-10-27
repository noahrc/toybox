/* global describe, it */
/* prefer-arrow-callback: ["error", { "allowNamedFunctions": true }] */

import { expect } from 'chai';
import renderNestedComponents from './../build/index.js';

// Import local templates for testing
// The mustache loader turns the mustache templates into functions
import layoutTemplate from '!mustache!./layout.mustache';
import pTemplate from '!mustache!./p.mustache';
import aTemplate from '!mustache!./a.mustache';
import thumbnailTemplate from '!mustache!./thumbnail.mustache';
import imgTemplate from '!mustache!./img.mustache';

const templates = {
  'p/p': pTemplate,
  'a/a': aTemplate,
  'img/img': imgTemplate,
  'layout/layout': layoutTemplate,
  'thumbnail/thumbnail': thumbnailTemplate,
};

describe('Render nested components', () => {
  it('should render an "a" component inside a "p" component.', () => {
    const testData = {
      __render: 'p/p',
      p__content: {
        __render: 'a/a',
        a__content: 'test link',
        a__linkURL: '#linkURL1',
      },
    };
    const expectedResult =
`<p class="p  "  ><a href="#linkURL1" target="" id="" class="a  ">test link</a>
</p>
`;
    const result = renderNestedComponents(testData, templates);
    expect(result).to.equal(expectedResult);
  });

  it('should render an "a" component and a "p" component inside a layout component.', () => {
    const testData = {
      __render: 'layout/layout',
      layout__cols: [
        {
          layout__colContent: [
            {
              __render: 'p/p',
              p__content: 'paragraph',
            },
            {
              __render: 'a/a',
              a__linkURL: '#linkURL2',
              a__content: 'link',
            },
          ],
        },
      ],
    };
    const expectedResult =
`<div id="" class="">
  <div class="layout ">
    \n      <div class="layout__col ">
        <p class="p  "  >paragraph</p>
 <a href="#linkURL2" target="" id="" class="a  ">link</a>

      </div>
  </div>
</div>
`;
    const result = renderNestedComponents(testData, templates);
    expect(result).to.equal(expectedResult);
  });

  it('should render components with default data and merge arrays between local and default data.',
    () => {
      const testData = {
        __render: 'p/p',
        p__content: {
          __render: 'a/a',
          a__content: 'test link',
          a__linkURL: '#linkURL3',
          a__classes: ['newAClass'],
        },
      };

      const defaults = {
        'p/p': {
          p__classes: ['defaultPClass'],
        },
        'a/a': {
          a__classes: ['defaultAClass'],
        },
      };

      const expectedResult =
`<p class="p  defaultPClass "  ><a href="#linkURL3" target="" id="" class="a  defaultAClass newAClass ">test link</a>
</p>
`;
      const result = renderNestedComponents(testData, templates, defaults);
      expect(result).to.equal(expectedResult);
    }
  );

  it('should interpolate multiple variables from within defaults and respect overrides.', () => {
    const testData = [
      {
        __render: 'p/p',
        p__content: {
          __render: 'a/a',
          a__content: 'test link 1',
        },
        p__link: '#linkURL4',
      },
      {
        __render: 'p/p',
        p__content: {
          __render: 'a/a',
          a__content: 'test link 2',
        },
        p__link: '#linkURL5',
      },
      {
        __render: 'p/p',
        p__content: {
          __render: 'a/a',
          a__content: 'test link 3',
          a__linkURL: '#linkOverride',
        },
        p__link: '#linkURL6',
      },
    ];

    const defaults = {
      'a/a': {
        a__classes: ['defaultAClass'],
        a__linkURL: '%{p__link}',
      },
    };

    const expectedResult =
`<p class="p  "  ><a href="#linkURL4" target="" id="" class="a  defaultAClass ">test link 1</a>
</p>
 <p class="p  "  ><a href="#linkURL5" target="" id="" class="a  defaultAClass ">test link 2</a>
</p>
 <p class="p  "  ><a href="#linkOverride" target="" id="" class="a  defaultAClass ">test link 3</a>
</p>\n`;
    const result = renderNestedComponents(testData, templates, defaults);
    expect(result).to.equal(expectedResult);
  });

  it('should render templates that override variables in default templates.', () => {
    const testData = [
      {
        __render: 'thumbnail/thumbnail',
        thumbnail__imageURL: 'http://p-hold.com/700/200',
      },
      {
        __render: 'thumbnail/thumbnail',
        thumbnail__imageURL: 'http://p-hold.com/300/400',
      },
    ];

    const defaults = {
      'thumbnail/thumbnail': {
        thumbnail__img: {
          __render: 'img/img',
          img__src: '%{thumbnail__imageURL}',
          img__classes: ['thumbnail__img']
        },
      },
    };

    const expectedResult =
`
<div class="thumbnail  ">
    <img class=" thumbnail__img" src="http://p-hold.com/700/200" srcset="" alt=""   >

  <div class="thumbnail__caption ">
    <!--
    <h4 class="thumbnail__captionHeading  "></h4>
    -->
    \n  </div>
</div>
 \n<div class="thumbnail  ">
    <img class=" thumbnail__img" src="http://p-hold.com/300/400" srcset="" alt=""   >\n\n  <div class="thumbnail__caption ">
    <!--
    <h4 class="thumbnail__captionHeading  "></h4>
    -->
    \n  </div>
</div>
`;
    const result = renderNestedComponents(testData, templates, defaults);
    expect(result).to.equal(expectedResult);
  });

});
