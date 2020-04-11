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
 * symbol element.
 */
const utilities = require('../utilities');
const types = require('../types');
const Exception = require('../structures/Exception').Exception;


// PUBLIC FUNCTIONS

/**
 * This function creates a new symbol element using the specified value.
 *
 * @param {String} value The value of the symbol.
 * @param {Object} parameters Optional parameters used to parameterize this element.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Symbol} The new symbol element.
 */
const Symbol = function(value, parameters, debug) {
    types.Element.call(
        this,
        ['/bali/elements/Symbol'],
        ['/bali/interfaces/Sequential'],
        parameters,
        debug
    );
    if (this.debug > 1) {
        const validator = new utilities.Validator(this.debug);
        validator.validateType('/bali/elements/Symbol', '$Symbol', '$value', value, [
            '/javascript/String'
        ]);
    }

    if (!value || !/^[a-zA-Z][0-9a-zA-Z]*$/g.test(value)) {
        const exception = new Exception({
            $module: '/bali/elements/Symbol',
            $procedure: '$Symbol',
            $exception: '$invalidParameter',
            $parameter: value,
            $text: 'An invalid symbol value was passed to the constructor.'
        });
        if (this.debug > 0) console.error(exception.toString());
        throw exception;
    }

    // since this element is immutable the value must be read-only
    this.getValue = function() { return value; };

    return this;
};
Symbol.prototype = Object.create(types.Element.prototype);
Symbol.prototype.constructor = Symbol;
exports.Symbol = Symbol;


// PUBLIC METHODS

/**
 * This method returns whether or not this symbol has a meaningful value. Symbols
 * always have a meaningful value.
 *
 * @returns {Boolean} Whether or not this symbol has a meaningful value.
 */
Symbol.prototype.toBoolean = function() {
    return true;
};


/**
 * This method accepts a visitor as part of the visitor pattern.
 *
 * @param {Visitor} visitor The visitor that wants to visit this element.
 */
Symbol.prototype.acceptVisitor = function(visitor) {
    visitor.visitSymbol(this);
};


/**
 * This method returns whether or not this symbol is empty.
 *
 * @returns {Boolean} Whether or not this symbol is empty.
 */
Symbol.prototype.isEmpty = function() {
    return false;  // a symbol may never be empty
};


/**
 * This method returns the number of characters in this symbol.
 *
 * @returns {Number} The number of characters in this symbol.
 */
Symbol.prototype.getSize = function() {
    return this.getValue().length;
};


/**
 * This method returns an object that can be used to iterate over the characters in
 * this symbol.
 * @returns {Iterator} An iterator for this symbol.
 */
Symbol.prototype.getIterator = function() {
    const iterator = new SymbolIterator(this.getValue(), this.getParameters(), this.debug);
    return iterator;
};


// PRIVATE CLASSES

const SymbolIterator = function(symbol, parameters, debug) {
    types.Iterator.call(
        this,
        ['/bali/elements/SymbolIterator'],
        [],
        parameters,
        debug
    );
    var slot = 0;  // the slot before the first character
    const size = symbol.length;  // static so we can cache it here

    this.toStart = function() {
        slot = 0;  // the slot before the first character
    };

    this.toSlot = function(newSlot) {
        slot = newSlot;
    };

    this.toEnd = function() {
        slot = size;  // the slot after the last character
    };

    this.hasPrevious = function() {
        return slot > 0;
    };

    this.hasNext = function() {
        return slot < size;
    };

    this.getPrevious = function() {
        if (!this.hasPrevious()) return;
        return symbol[--slot];
    };

    this.getNext = function() {
        if (!this.hasNext()) return;
        return symbol[slot++];
    };

    return this;
};
SymbolIterator.prototype = Object.create(types.Iterator.prototype);
SymbolIterator.prototype.constructor = SymbolIterator;
