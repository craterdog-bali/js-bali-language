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
 * reference element.
 */
var URL = require('url').URL;
var types = require('../abstractions/Types');
var Element = require('../abstractions/Element').Element;


/**
 * This constructor creates a new reference element.
 * 
 * @param {String} value The value of the reference.
 * @param {Parameters} parameters Optional parameters used to parameterize this element. 
 * @returns {Reference} The new reference element.
 */
function Reference(value, parameters) {
    Element.call(this, types.REFERENCE, parameters);
    if (!value) throw new Error('REFERENCE: An invalid value was passed to the constructor: ' + value);
    value = value.slice(1, -1);  // remove the angle brackets
    this.value = new URL(value);
    var source = '<' + this.value + '>';  // embed in angle brackets
    this.setSource(source);
    this.length = types.TOO_BIG;  // references should never be inlined
    return this;
}
Reference.prototype = Object.create(Element.prototype);
Reference.prototype.constructor = Reference;
exports.Reference = Reference;