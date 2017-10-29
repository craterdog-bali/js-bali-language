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

var codex = require('./EncodingUtilities');
var forge = require('node-forge');
forge.options.usePureJavaScript = true;
var random = require('node-forge').random;
var hash = require('node-forge').md;


/**
 * This utility method returns the result of a weighted coin toss. A probability of
 * zero will always return false and a probability of one will always return true.
 *
 * @param probability The probability that the toss will return true [0..1].
 * @return The result of the coin toss.
 */
exports.coinToss = function(probability) {
    var toss = random.generateSync(1).charCodeAt(0) / 256;  // random value in range [0..1)
    return probability > toss;
};


/**
 * This utility method returns a byte array of the specified size containing randomly generated bytes.
 *
 * @param numberOfBytes The number of bytes in the desired byte array.
 * @return The byte array containing random bytes.
 */
exports.generateRandomBytes = function(numberOfBytes) {
    var bytes = random.generateSync(numberOfBytes);
    return bytes;
};


exports.sha512Hash = function(string) {
    var sha512 = hash.sha512.create();
    sha512.update(string);
    var hashString = codex.base32Encode(sha512.digest().getBytes());
    return hashString;
};
