import xtype from 'xtypejs';
import xtypeCustomTypesExtension from 'xtypejs-extension-custom-types';
import xtypejsShortenedNameScheme from 'xtypejs-name-scheme-shortened';

xtype.options.setNameScheme(xtypejsShortenedNameScheme);
xtype.ext.registerExtension(xtypeCustomTypesExtension);

// Add a type check for Array like objects (like the result of document.queryAll)
xtype.ext.registerType('array_like', {
  definition: {
    validator: (val) => typeof val === 'object' && typeof val.forEach === 'function',
    compactName: 'arrlike',
  },
});

export default xtype;
