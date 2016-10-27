import xtype from 'toybox-js-xtype';
import jp from 'jsonpath/jsonpath';
import renderNestedComponents from 'toybox-js-render-nested-components';

/**
 * Given an object with data (like a JSON schema), transform matches for
 * %{ } tags inside the data into functions with variable references.
 * Returns a function that, when called, returns the interpolated data.
 *
 * @export
 * @param {Object} sourceData
 * @param {Object} templates
 * @param {Object} defaults
 * @param {String} [contextPath='$']
 * @returns {Function}
 */
export default function parseVariables(sourceData, templates, defaults, contextPath = '$') {
  let _contextData = {};
  if (typeof sourceData === 'string') {
    _contextData = sourceData;
  } else {
    try {
      _contextData = jp.value(sourceData, contextPath);
    } catch (err) {
      console.log(err);
    }
  }
  return parseData(_contextData, sourceData, templates, defaults, contextPath);
}

/**
 * Recursively replaces %{variable} references with functions
 * Returns the transformed data object
 *
 * @param {Object} data
 * @param {Object} sourceData
 * @param {Object} templates
 * @param {Object} defaults
 * @param {String} contextPath
 * @returns {Object}
 */
function parseData(data, sourceData, templates, defaults, contextPath) {
  const _data = data;
  switch (xtype.which(_data, 'arr obj str func')) {
    case 'arr': return _data.map((item, idx) => {
      const childContext = `${contextPath}[${idx}]`;
      return parseData(item, sourceData, templates, defaults, childContext);
    });t
    case 'obj':
      for (const k in _data) {
        if (!_data.hasOwnProperty(k)) return undefined;
        const childContext = `${contextPath}.${k}`;
        _data[k] = parseData(_data[k], sourceData, templates, defaults, childContext);
      }
      return _data;
    case 'str':
      return parseString(_data, sourceData, templates, defaults, contextPath);
    case 'funct': return _data();
    default: return _data;
  }
}

/**
 * Recursively replace instances of %{somevariable} in a string
 * Returns a string or a function that interpolates variables
 *
 * @param {String} string
 * @param {Object} sourceData
 * @param {Object} templates
 * @param {Object} defaults
 * @param {String} contextPath
 * @returns {Object}
 */
function parseString(string, sourceData, templates, defaults, contextPath) {
  const match = string.match(/%{([^}]+)}/);
  if (!match) return string;

  const prestring = string.slice(0, match.index);
  const remainderString = string.slice(match.index + match[0].length);

  if (!remainderString) {
    return function interpolate() {
      if (typeof this.__cache === 'string') return this.__cache;

      let interpolatedVar = interpolateVar(match[1], sourceData, templates, defaults, contextPath);
      if (prestring) interpolatedVar = prestring + interpolatedVar;

      // Store a cached version of the interpolation
      this.__cache = interpolatedVar;

      return interpolatedVar;
    };
  }

  let parsedRemainder = parseString(remainderString, sourceData, templates, defaults, contextPath);
  const interpolatedVar = interpolateVar(match[1], sourceData, templates, defaults, contextPath);

  if (typeof parsedRemainder === 'function') parsedRemainder = parsedRemainder();

  return prestring + interpolatedVar + parsedRemainder;
}

//
/**
 * Given a variable name and source data, returns the closest matching
 * value in source data, or an empty string
 *
 * @param {String} varName
 * @param {Object} sourceData
 * @param {Object} templates
 * @param {Object} defaults
 * @param {String} contextPath
 * @returns {Object}
 */
function interpolateVar(varName, sourceData, templates, defaults, contextPath) {
  const paths = jp.paths(sourceData, contextPath);
  if (paths.length) {
    let i = paths[0].length;
    let curPath = contextPath;
    while (i > -1 && curPath) {
      const context = jp.value(sourceData, curPath);
      if (context[varName] !== undefined) {
        if (typeof context[varName] === 'string') return context[varName];
        if (typeof context[varName] === 'function') return context[varName]();
        return renderNestedComponents(sourceData, templates, defaults, `curPath.${varName}` );
      }
      const parentPath = paths[0].slice(0, i);
      if (parentPath.length) curPath = jp.stringify(parentPath);
      i--;
    }
  }
  return '';
}
