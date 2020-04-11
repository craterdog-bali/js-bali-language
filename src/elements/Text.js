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
 * This element class captures the state and methods associated with a
 * text string element.
 */
const utilities = require('../utilities');
const types = require('../types');


// PUBLIC FUNCTIONS

/**
 * This function creates a new text string element using the specified value.
 *
 * @param {String} value The value of the text string.
 * @param {Object} parameters Optional parameters used to parameterize this element.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Text} The new text string.
 */
const Text = function(value, parameters, debug) {
    types.Element.call(
        this,
        ['/bali/elements/Text'],
        [
            '/bali/interfaces/Sequential',
            '/bali/interfaces/Chainable'
        ],
        parameters,
        debug
    );
    if (this.debug > 1) {
        const validator = new utilities.Validator(this.debug);
        validator.validateType('/bali/elements/Text', '$Text', '$value', value, [
            '/javascript/Undefined',
            '/javascript/String'
        ]);
    }

    value = value || '';  // default value

    // since this element is immutable the value must be read-only
    this.getValue = function() { return value; };

    return this;
};
Text.prototype = Object.create(types.Element.prototype);
Text.prototype.constructor = Text;
exports.Text = Text;


// PUBLIC METHODS

/**
 * This method returns whether or not this text string has a meaningful value. If the text
 * string is empty it returns <code>false</code>, otherwise it returns <code>true</code>.
 *
 * @returns {Boolean} Whether or not this text string has a meaningful value.
 */
Text.prototype.toBoolean = function() {
    return !this.isEmpty();
};


/**
 * This method accepts a visitor as part of the visitor pattern.
 *
 * @param {Visitor} visitor The visitor that wants to visit this element.
 */
Text.prototype.acceptVisitor = function(visitor) {
    visitor.visitText(this);
};


/**
 * This method returns whether or not this text string has any characters.
 *
 * @returns {Boolean} Whether or not this text string has any characters.
 */
Text.prototype.isEmpty = function() {
    return this.getSize() === 0;
};


/**
 * This method returns the number of characters that this text string has.
 *
 * @returns {Number} The number of characters that this text string has.
 */
Text.prototype.getSize = function() {
    return this.getValue().length;
};


/**
 * This method returns an object that can be used to iterate over the characters in
 * this text string.
 * @returns {Iterator} An iterator for this text string.
 */
Text.prototype.getIterator = function() {
    const iterator = new TextIterator(this.getValue(), this.getParameters(), this.debug);
    return iterator;
};


// PUBLIC FUNCTIONS

/**
 * This function returns a new text string that contains the bytes from the second text
 * concatenated onto the end of the first text string.
 *
 * @param {Text} first The first text string to be operated on.
 * @param {Text} second The second text string to be operated on.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Text} The resulting text string.
 */
Text.concatenation = function(first, second, debug) {
    if (debug > 1) {
        const validator = new utilities.Validator(debug);
        validator.validateType('/bali/elements/Text', '$concatenation', '$first', first, [
            '/bali/elements/Text'
        ]);
        validator.validateType('/bali/elements/Text', '$concatenation', '$second', second, [
            '/bali/elements/Text'
        ]);
    }
    const string1 = first.getValue();
    const string2 = second.getValue();
    const string = string1 + string2;
    return new Text(string, first.getParameters(), debug);
};


// PRIVATE CLASSES

const TextIterator = function(text, parameters, debug) {
    types.Iterator.call(
        this,
        ['/bali/elements/TextIterator'],
        [],
        parameters,
        debug
    );
    var slot = 0;  // the slot before the first number
    const size = text.length;  // static so we can cache it here

    this.toStart = function() {
        slot = 0;  // the slot before the first number
    };

    this.toSlot = function(newSlot) {
        slot = newSlot;
    };

    this.toEnd = function() {
        slot = size;  // the slot after the last number
    };

    this.hasPrevious = function() {
        return slot > 0;
    };

    this.hasNext = function() {
        return slot < size;
    };

    this.getPrevious = function() {
        if (!this.hasPrevious()) return;
        return text[--slot];
    };

    this.getNext = function() {
        if (!this.hasNext()) return;
        return text[slot++];
    };

    return this;
};
TextIterator.prototype = Object.create(types.Iterator.prototype);
TextIterator.prototype.constructor = TextIterator;
