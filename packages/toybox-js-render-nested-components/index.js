import renderComponent from 'toybox-js-render-component';
import xtype from 'toybox-js-xtype';
import jp from 'jsonpath/jsonpath';

/**
 * Convert component data to rendered strings using templates.
 *
 * @export
 * @param {Any} data Component data to be rendered
 * @param {Object} templates An object mapping component keys to template functions
 * @param {Object} [defaults] Optional object mapping component keys to default data
 * @param {String} [contextPath='$'] Optional string with a jsonpath to begin rendering at
 * @returns {String} The rendered components
 */
export default function renderNestedComponents(data, templates, defaults, contextPath = '$') {
  let _data = data;
  let defaultData;
  let _contextData = jp.value(data, contextPath);
  let hasComponents = false;

  switch (xtype.which(_contextData, 'arr obj')) {
    case 'arr':

      // Render nested components within the array
      // Set a flag if there are components inside the array
      _contextData.forEach((item, idx) => {
        if (item.__render) hasComponents = true;
        const childContextPath = `${contextPath}[${idx}]`;
        _contextData[idx] = renderNestedComponents(_data, templates, defaults, childContextPath);
      });

      // If this array has components inside, convert it into one string
      if (hasComponents) _contextData = _contextData.join(' ');

      return _contextData;

    case 'obj':

      // Render components within the object
      for (const key in _contextData) {
        if (!_contextData.hasOwnProperty(key)) return undefined;

        const child = _contextData[key];

        if (xtype.is(child, 'obj, arr')) {
          const childContextPath = `${contextPath}.${key}`;
          _contextData[key] = renderNestedComponents(_data, templates, defaults, childContextPath);
        }
      }

      // Apply newly rendered context data to the original data
      if (contextPath === '$') {
        _data = _contextData;
      } else {
        jp.apply(_data, contextPath, () => _contextData);
      }

      // Define defaultData if available for this component
      if (xtype.is(defaults, 'obj') && xtype.is(_contextData.__render, 'str')) {
        defaultData = defaults[_contextData.__render];
      }

      return renderComponent(_data, templates, defaultData, contextPath);

    default: return _contextData;
  }
}
