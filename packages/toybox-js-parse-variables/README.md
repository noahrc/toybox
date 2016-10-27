Convert variables inside %{} markers within strings to functions that return interpolated variables.

## Functions

<dl>
<dt><a href="#parseData">parseData(data, sourceData, templates, defaults, contextPath)</a> ⇒ <code>Object</code></dt>
<dd><p>Recursively replaces %{variable} references with functions
Returns the transformed data object</p>
</dd>
<dt><a href="#parseString">parseString(string, sourceData, templates, defaults, contextPath)</a> ⇒ <code>Object</code></dt>
<dd><p>Recursively replace instances of %{somevariable} in a string
Returns a string or a function that interpolates variables</p>
</dd>
<dt><a href="#interpolateVar">interpolateVar(varName, sourceData, templates, defaults, contextPath)</a> ⇒ <code>Object</code></dt>
<dd><p>Given a variable name and source data, returns the closest matching
value in source data, or an empty string</p>
</dd>
</dl>

<a name="parseData"></a>

## parseData(data, sourceData, templates, defaults, contextPath) ⇒ <code>Object</code>
Recursively replaces %{variable} references with functions
Returns the transformed data object

**Kind**: global function  

| Param | Type |
| --- | --- |
| data | <code>Object</code> | 
| sourceData | <code>Object</code> | 
| templates | <code>Object</code> | 
| defaults | <code>Object</code> | 
| contextPath | <code>String</code> | 

<a name="parseString"></a>

## parseString(string, sourceData, templates, defaults, contextPath) ⇒ <code>Object</code>
Recursively replace instances of %{somevariable} in a string
Returns a string or a function that interpolates variables

**Kind**: global function  

| Param | Type |
| --- | --- |
| string | <code>String</code> | 
| sourceData | <code>Object</code> | 
| templates | <code>Object</code> | 
| defaults | <code>Object</code> | 
| contextPath | <code>String</code> | 

<a name="interpolateVar"></a>

## interpolateVar(varName, sourceData, templates, defaults, contextPath) ⇒ <code>Object</code>
Given a variable name and source data, returns the closest matching
value in source data, or an empty string

**Kind**: global function  

| Param | Type |
| --- | --- |
| varName | <code>String</code> | 
| sourceData | <code>Object</code> | 
| templates | <code>Object</code> | 
| defaults | <code>Object</code> | 
| contextPath | <code>String</code> | 

