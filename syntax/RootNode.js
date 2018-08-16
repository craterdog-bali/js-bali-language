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
 * This class captures the state and methods associated with a Bali root node.
 */
var types = require('./NodeTypes');
var formatter = require('../transformers/DocumentFormatter');


/**
 * This constructor creates a new root node.
 * 
 * @param {Number} type The type of the root node.
 * @param {TreeNode} body The parse tree node for the body of the root node.
 * @param {TerminalNode} previousCitation The parse tree node for the citation
 * to the previous version of the document.
 * @returns {RootNode} The new parse root node.
 */
function RootNode(type, body, previousCitation) {
    this.type = type;
    this.isSimple = false;
    this.body = body;
    this.previousCitation = previousCitation;
    this.seals = [];
    return this;
}
RootNode.prototype.constructor = RootNode;
exports.RootNode = RootNode;


/**
 * This method accepts a visitor as part of the visitor pattern.
 * 
 * @param {NodeVisitor} visitor The visitor that wants to visit this root node.
 */
RootNode.prototype.accept = function(visitor) {
    switch(this.type) {
        case types.DOCUMENT:
            visitor.visitDocument(this);
            break;
        case types.TASK:
            visitor.visitTask(this);
            break;
        default:
            throw new Error('SYNTAX: An invalid root node type was found: ' + this.type);
    }
};


/**
 * This method adds a notary seal to the list of seals for this root node.
 * 
 * @param {TreeNode} seal The parse tree node defining the seal to be added to the root node.
 */
RootNode.prototype.addSeal = function(seal) {
    this.seals.push(seal);
};


/**
 * This method returns a string representation of this root node.
 * 
 * @returns {String} The string representation of this root node.
 */
RootNode.prototype.toString = function() {
    var string = formatter.formatParseTree(this);
    return string;
};
