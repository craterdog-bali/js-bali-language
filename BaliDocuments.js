/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/
'use strict';

/*
 * This module provides useful functions for parsing and manipulating documents
 * that are written using the Bali Document Notation™. For more information
 * about the Bali language refer to the Reference Guide at:
 * <https://github.com/craterdog-bali/bali-reference-guide/wiki>.
 */
var parser = require('./transformers/DocumentParser');
var formatter = require('./transformers/DocumentFormatter');
var utilities = require('./utilities/DocumentUtilities');


/**
 * This function parses a Bali source string and returns the corresponding
 * document.
 * 
 * @param {String} source The Bali source string.
 * @returns {Document} The resulting document.
 */
exports.parseDocument = function(source) {
    return parser.parseDocument(source);
};


/**
 * This function parses a Bali source string and returns the corresponding
 * component.
 * 
 * @param {String} source The Bali source string.
 * @returns {Document} The resulting component.
 */
exports.parseComponent = function(source) {
    return parser.parseComponent(source);
};


/**
 * This function parses a Bali source string and returns the corresponding
 * parameters.
 * 
 * @param {String} source The Bali source string.
 * @returns {Document} The resulting parameters.
 */
exports.parseParameters = function(source) {
    return parser.parseParameters(source);
};


/**
 * This function parses a Bali source string and returns the corresponding
 * element.
 * 
 * @param {String} source The Bali source string.
 * @returns {Document} The resulting element.
 */
exports.parseElement = function(source) {
    return parser.parseElement(source);
};


/**
 * This function parses a Bali source string and returns the corresponding
 * structure.
 * 
 * @param {String} source The Bali source string.
 * @returns {Document} The resulting structure.
 */
exports.parseStructure = function(source) {
    return parser.parseStructure(source);
};


/**
 * This function parses a Bali source string and returns the corresponding
 * range.
 * 
 * @param {String} source The Bali source string.
 * @returns {Document} The resulting range.
 */
exports.parseRange = function(source) {
    return parser.parseRange(source);
};


/**
 * This function parses a Bali source string and returns the corresponding
 * list.
 * 
 * @param {String} source The Bali source string.
 * @returns {Document} The resulting list.
 */
exports.parseList = function(source) {
    return parser.parseList(source);
};


/**
 * This function parses a Bali source string and returns the corresponding
 * catalog.
 * 
 * @param {String} source The Bali source string.
 * @returns {Document} The resulting catalog.
 */
exports.parseCatalog = function(source) {
    return parser.parseCatalog(source);
};


/**
 * This function parses a Bali source string and returns the corresponding
 * procedure.
 * 
 * @param {String} source The Bali source string.
 * @returns {Document} The resulting procedure.
 */
exports.parseProcedure = function(source) {
    return parser.parseProcedure(source);
};


/**
 * This function parses a Bali source string and returns the corresponding
 * expression.
 * 
 * @param {String} source The Bali source string.
 * @returns {Document} The resulting expression.
 */
exports.parseExpression = function(source) {
    return parser.parseExpression(source);
};


/**
 * This function formats the specified parse tree object as Bali source string.
 * 
 * @param {Object} tree The parse tree to be formatted.
 * @param {String} optionalPadding An optional string that is used
 * to prefix each line of the resulting string.
 * @returns {String} The resulting source string.
 */
exports.formatParseTree = function(tree, optionalPadding) {
    return formatter.formatParseTree(tree, optionalPadding);
};


/**
 * This function returns whether or not the specified object is a
 * document.
 * 
 * @param {Object} object The object to be checked.
 * @returns {Boolean} Whether or not the object is a document.
 */
exports.isDocument = function(object) {
    return utilities.isDocument(object);
};


/**
 * This function constructs an iterator for the specified list.
 * 
 * @param {List} list The list.
 * @returns {Iterator} The new iterator.
 */
exports.iterator = function(list) {
    return utilities.iterator(list);
};


/**
 * This function retrieves from a list the value associated with the
 * specified index.
 * 
 * @param {List} list The list.
 * @param {Number} index The ordinal based index of the desired value.
 * @returns {Component} The value associated with the index.
 */
exports.getValueForIndex = function(list, index) {
    return utilities.getValueForIndex(list, index);
};


/**
 * This function sets in a list the value associated with the specified index.
 * 
 * @param {List} list The list.
 * @param {Number} index The ordinal based index of the value.
 * @param {Component} value The value to be associated with the index.
 * @returns {Component} The old value associated with the index.
 */
exports.setValueForIndex = function(list, index, value) {
    return utilities.getValueForIndex(list, index, value);
};


/**
 * This function adds a new value to a list.
 * 
 * @param {List} list The list.
 * @param {Component} value The value to be added to the list.
 */
exports.addValue = function(list, value) {
    return utilities.addValue(list, value);
};


/**
 * This function retrieves from a catalog the string value associated with the
 * specified key.
 * 
 * @param {Catalog} catalog The catalog.
 * @param {String} key The string form of the key.
 * @returns {Component} The string value associated with the key.
 */
exports.getStringForKey = function(catalog, key) {
    return utilities.getStringForKey(catalog, key);
};


/**
 * This function retrieves from a catalog the value associated with the
 * specified key.
 * 
 * @param {Catalog} catalog The catalog.
 * @param {String} key The string form of the key.
 * @returns {Component} The value associated with the key.
 */
exports.getValueForKey = function(catalog, key) {
    return utilities.getValueForKey(catalog, key);
};


/**
 * This function sets in a catalog a value associated with the
 * specified key.
 * 
 * @param {Catalog} catalog The catalog.
 * @param {String} key The string form of the key.
 * @param {Component} value The value to be associated with the key.
 * @returns {Component} The old value associated with the key.
 */
exports.setValueForKey = function(catalog, key, value) {
    return utilities.setValueForKey(catalog, key, value);
};


/**
 * This function removes from a catalog the value associated with the
 * specified key.
 * 
 * @param {Catalog} catalog The catalog.
 * @param {String} key The string form of the key.
 * @returns {Component} The value associated with the key.
 */
exports.deleteKey = function(catalog, key) {
    return utilities.deleteKey(catalog, key);
};


/**
 * This function returns whether or not the specified object is a
 * reference.
 * 
 * @param {Object} object The object to be checked.
 * @returns {Boolean} Whether or not the object is a reference.
 */
exports.isReference = function(object) {
    return utilities.isReference(object);
};


/**
 * This function returns whether or not the specified object is a
 * version string.
 * 
 * @param {Object} object The object to be checked.
 * @returns {Boolean} Whether or not the object is a version string.
 */
exports.isVersion = function(object) {
    return utilities.isVersion(object);
};


/**
 * This function returns whether or not the specified object is a
 * tag.
 * 
 * @param {Object} object The object to be checked.
 * @returns {Boolean} Whether or not the object is a tag.
 */
exports.isTag = function(object) {
    return utilities.isTag(object);
};

