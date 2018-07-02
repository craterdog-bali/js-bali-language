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

/**
 * This library provides functions that parse a Bali document and
 * produce the corresponding parse tree structure.
 */
var antlr = require('antlr4');
var grammar = require('../grammar');
var syntax = require('../syntax');
var types = require('../syntax/NodeTypes');


/**
 * This function takes a source code string containing a Bali document
 * and parses it into the corresponding parse tree structure.
 * 
 * @param {String} source The source code string.
 * @returns {DocumentContext} The corresponding parse tree structure.
 */
exports.parseDocument = function(source) {
    var parser = initializeParser(source);
    var antlrTree = parser.document();
    var baliTree = convertParseTree(antlrTree);
    return baliTree;
};


/**
 * This function takes a source code string containing a Bali component
 * and parses it into the corresponding parse tree structure.
 * 
 * @param {String} source The source code string.
 * @returns {ComponentContext} The corresponding parse tree structure.
 */
exports.parseComponent = function(source) {
    var parser = initializeParser(source);
    var antlrTree = parser.component();
    var baliTree = convertParseTree(antlrTree);
    return baliTree;
};


/**
 * This function takes a source code string containing Bali parameters
 * and parses them into the corresponding parse tree structure.
 * 
 * @param {String} source The source code string.
 * @returns {ParametersContext} The corresponding parse tree structure.
 */
exports.parseParameters = function(source) {
    var parser = initializeParser(source);
    var antlrTree = parser.parameters();
    var baliTree = convertParseTree(antlrTree);
    return baliTree;
};


/**
 * This function takes a source code string containing a Bali element
 * and parses it into the corresponding parse tree structure.
 * 
 * @param {String} source The source code string.
 * @returns {ElementContext} The corresponding parse tree structure.
 */
exports.parseElement = function(source) {
    var parser = initializeParser(source);
    var antlrTree = parser.element();
    var baliTree = convertParseTree(antlrTree);
    return baliTree;
};


/**
 * This function takes a source code string containing a Bali structure
 * and parses it into the corresponding parse tree structure.
 * 
 * @param {String} source The source code string.
 * @returns {StructureContext} The corresponding parse tree structure.
 */
exports.parseStructure = function(source) {
    var parser = initializeParser(source);
    var antlrTree = parser.structure();
    var baliTree = convertParseTree(antlrTree);
    return baliTree;
};


/**
 * This function takes a source code string containing a Bali range
 * and parses it into the corresponding parse tree structure.
 * 
 * @param {String} source The source code string.
 * @returns {RangeContext} The corresponding parse tree structure.
 */
exports.parseRange = function(source) {
    var parser = initializeParser(source);
    var antlrTree = parser.range();
    var baliTree = convertParseTree(antlrTree);
    return baliTree;
};


/**
 * This function takes a source code string containing a Bali list
 * and parses it into the corresponding parse tree structure.
 * 
 * @param {String} source The source code string.
 * @returns {ListContext} The corresponding parse tree structure.
 */
exports.parseList = function(source) {
    var parser = initializeParser(source);
    var antlrTree = parser.list();
    var baliTree = convertParseTree(antlrTree);
    return baliTree;
};


/**
 * This function takes a source code string containing a Bali catalog
 * and parses it into the corresponding parse tree structure.
 * 
 * @param {String} source The source code string.
 * @returns {CatalogContext} The corresponding parse tree structure.
 */
exports.parseCatalog = function(source) {
    var parser = initializeParser(source);
    var antlrTree = parser.catalog();
    var baliTree = convertParseTree(antlrTree);
    return baliTree;
};


/**
 * This function takes a source code string containing a Bali procedure
 * and parses it into the corresponding parse tree structure.
 * 
 * @param {String} source The source code string.
 * @returns {BlockContext} The corresponding parse tree structure.
 */
exports.parseProcedure = function(source) {
    var parser = initializeParser(source);
    var antlrTree = parser.procedure();
    var baliTree = convertParseTree(antlrTree);
    return baliTree;
};


/**
 * This function takes a source code string containing a Bali expression
 * and parses it into the corresponding parse tree structure.
 * 
 * @param {String} source The source code string.
 * @returns {ExpressionContext} The corresponding parse tree structure.
 */
exports.parseExpression = function(source) {
    var parser = initializeParser(source);
    var antlrTree = parser.expression();
    var baliTree = convertParseTree(antlrTree);
    return baliTree;
};


// PRIVATE FUNCTIONS

function initializeParser(source) {
    var chars = new antlr.InputStream(source);
    var lexer = new grammar.BaliLanguageLexer(chars);
    var tokens = new antlr.CommonTokenStream(lexer);
    var parser = new grammar.BaliLanguageParser(tokens);
    parser.buildParseTrees = true;
    return parser;
}


function convertParseTree(antlrTree) {
    var visitor = new ParsingVisitor();
    antlrTree.accept(visitor);
    var baliTree = visitor.result;
    return baliTree;
}


// PRIVATE CLASSES

function ParsingVisitor() {
    grammar.BaliLanguageVisitor.call(this);
    return this;
}
ParsingVisitor.prototype = Object.create(grammar.BaliLanguageVisitor.prototype);
ParsingVisitor.prototype.constructor = ParsingVisitor;


// anyTemplate: 'any'
ParsingVisitor.prototype.visitAnyTemplate = function(ctx) {
    var value = 'any';
    this.result = new syntax.TerminalNode(types.TEMPLATE, value);
};


// arithmeticExpression: expression op=('*' | '/' | '//' | '+' | '-') expression
ParsingVisitor.prototype.visitArithmeticExpression = function(ctx) {
    var tree = new syntax.TreeNode(types.ARITHMETIC_EXPRESSION);
    var expressions = ctx.expression();
    expressions[0].accept(this);
    tree.addChild(this.result);
    tree.operator = ctx.op.text;
    expressions[1].accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// association: component ':' expression
ParsingVisitor.prototype.visitAssociation = function(ctx) {
    var tree = new syntax.TreeNode(types.ASSOCIATION);
    ctx.component().accept(this);
    tree.addChild(this.result);
    ctx.expression().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// binary: BINARY
ParsingVisitor.prototype.visitBinary = function(ctx) {
    var value = ctx.BINARY().getText();
    var terminal = new syntax.TerminalNode(types.BINARY, value);
    if (value.length > 82) terminal.isSimple = false;  // binaries are formatted in 80 character blocks
    this.result = terminal;
};


// block: '{' procedure '}'
ParsingVisitor.prototype.visitBlock = function(ctx) {
    var tree = new syntax.TreeNode(types.BLOCK);
    ctx.procedure().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// breakClause: 'break' 'loop'
ParsingVisitor.prototype.visitBreakClause = function(ctx) {
    var tree = new syntax.TreeNode(types.BREAK_CLAUSE);
    this.result = tree;
};


// catalog:
//     association (',' association)* |
//     NEWLINE (association NEWLINE)* |
//     ':' /*empty catalog*/
ParsingVisitor.prototype.visitCatalog = function(ctx) {
    var tree = new syntax.TreeNode(types.CATALOG);
    var type = ctx.constructor.name;
    if (type !== 'EmptyCatalogContext') {
        var associations = ctx.association();
        for (var i = 0; i < associations.length; i++) {
            associations[i].accept(this);
            tree.addChild(this.result);
        }
    }
    if (type !== 'NewlineCatalogContext') tree.isSimple = true;
    this.result = tree;
};


// checkoutClause: 'checkout' recipient 'from' expression
ParsingVisitor.prototype.visitCheckoutClause = function(ctx) {
    var tree = new syntax.TreeNode(types.CHECKOUT_CLAUSE);
    ctx.recipient().accept(this);
    tree.addChild(this.result);
    ctx.expression().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// code: '{' procedure '}'
ParsingVisitor.prototype.visitCode = function(ctx) {
    var tree = new syntax.TreeNode(types.CODE);
    ctx.procedure().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// commitClause: 'commit' expression 'to' expression
ParsingVisitor.prototype.visitCommitClause = function(ctx) {
    var tree = new syntax.TreeNode(types.COMMIT_CLAUSE);
    var expressions = ctx.expression();
    expressions[0].accept(this);
    tree.addChild(this.result);
    expressions[1].accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// comparisonExpression: expression op=('<' | '=' | '>' | 'is' | 'matches') expression
ParsingVisitor.prototype.visitComparisonExpression = function(ctx) {
    var tree = new syntax.TreeNode(types.COMPARISON_EXPRESSION);
    var expressions = ctx.expression();
    expressions[0].accept(this);
    tree.addChild(this.result);
    tree.operator = ctx.op.text;
    expressions[1].accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// complementExpression: 'not' expression
ParsingVisitor.prototype.visitComplementExpression = function(ctx) {
    var tree = new syntax.TreeNode(types.COMPLEMENT_EXPRESSION);
    ctx.expression().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// complexNumber: '(' real del=(',' | 'e^') imaginary ')'
ParsingVisitor.prototype.visitComplexNumber = function(ctx) {
    var delimiter = ctx.del.text;
    if (delimiter === ',') delimiter += ' ';
    var value = '(';
    ctx.real().accept(this);
    var real = this.result;
    value += real;
    value += delimiter;
    ctx.imaginary().accept(this);
    var imaginary = this.result;
    value += imaginary;
    value += ')';
    var terminal = new syntax.TerminalNode(types.NUMBER, value);
    terminal.real = real;
    terminal.delimiter = delimiter;
    terminal.imaginary = imaginary;
    this.result = terminal;
};


// component: object parameters? seal*
ParsingVisitor.prototype.visitComponent = function(ctx) {
    var tree = new syntax.TreeNode(types.COMPONENT);
    for (var i = 0; i < ctx.children.length; i++) {
        ctx.children[i].accept(this);
        tree.addChild(this.result);

    }
    this.result = tree;
};


// constantReal: sign='-'? CONSTANT
ParsingVisitor.prototype.visitConstantReal = function(ctx) {
    var string = '';
    if (ctx.sign) {
        string += '-';
    }
    string += ctx.CONSTANT().getText();
    this.result = string;
};


// continueClause: 'continue' 'loop'
ParsingVisitor.prototype.visitContinueClause = function(ctx) {
    var tree = new syntax.TreeNode(types.CONTINUE_CLAUSE);
    this.result = tree;
};


// defaultExpression: expression '?' expression
ParsingVisitor.prototype.visitDefaultExpression = function(ctx) {
    var tree = new syntax.TreeNode(types.DEFAULT_EXPRESSION);
    var expressions = ctx.expression();
    expressions[0].accept(this);
    tree.addChild(this.result);
    expressions[1].accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// dereferenceExpression: '@' expression
ParsingVisitor.prototype.visitDereferenceExpression = function(ctx) {
    var tree = new syntax.TreeNode(types.DEREFERENCE_EXPRESSION);
    ctx.expression().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// discardClause: 'discard' expression
ParsingVisitor.prototype.visitDiscardClause = function(ctx) {
    var tree = new syntax.TreeNode(types.DISCARD_CLAUSE);
    ctx.expression().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// document: NEWLINE* component NEWLINE* EOF
ParsingVisitor.prototype.visitDocument = function(ctx) {
    var tree = new syntax.TreeNode(types.DOCUMENT);
    ctx.component().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// duration: DURATION
ParsingVisitor.prototype.visitDuration = function(ctx) {
    var value = ctx.DURATION().getText();
    var terminal = new syntax.TerminalNode(types.DURATION, value);
    this.result = terminal;
};


// emptyCatalog: ':' /*empty catalog*/
ParsingVisitor.prototype.visitEmptyCatalog = function(ctx) {
    // delegate to abstract type
    this.visitCatalog(ctx);
};

// emptyList: /*empty list*/
ParsingVisitor.prototype.visitEmptyList = function(ctx) {
    // delegate to abstract type
    this.visitList(ctx);
};


// emptyProcedure: /*empty procedure*/
ParsingVisitor.prototype.visitEmptyProcedure = function(ctx) {
    // delegate to abstract type
    this.visitProcedure(ctx);
};



// evaluateClause: (recipient ':=')? expression
ParsingVisitor.prototype.visitEvaluateClause = function(ctx) {
    var tree = new syntax.TreeNode(types.EVALUATE_CLAUSE);
    var recipient = ctx.recipient();
    if (recipient) {
        ctx.recipient().accept(this);
        tree.addChild(this.result);
    }
    ctx.expression().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// exponentialExpression: <assoc=right> expression '^' expression
ParsingVisitor.prototype.visitExponentialExpression = function(ctx) {
    var tree = new syntax.TreeNode(types.EXPONENTIAL_EXPRESSION);
    var expressions = ctx.expression();
    expressions[0].accept(this);
    tree.addChild(this.result);
    expressions[1].accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// factorialExpression: expression '!'
ParsingVisitor.prototype.visitFactorialExpression = function(ctx) {
    var tree = new syntax.TreeNode(types.FACTORIAL_EXPRESSION);
    ctx.expression().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// falseProbability: 'false'
ParsingVisitor.prototype.visitFalseProbability = function(ctx) {
    var value = 'false';
    var terminal = new syntax.TerminalNode(types.PROBABILITY, value);
    this.result = terminal;
};


// fractionalProbability: FRACTION
ParsingVisitor.prototype.visitFractionalProbability = function(ctx) {
    var value = ctx.FRACTION().getText();
    var terminal = new syntax.TerminalNode(types.PROBABILITY, value);
    this.result = terminal;
};


// functionExpression: function parameters
ParsingVisitor.prototype.visitFunctionExpression = function(ctx) {
    var tree = new syntax.TreeNode(types.FUNCTION_EXPRESSION);
    ctx.funxtion().accept(this);
    tree.addChild(this.result);
    ctx.parameters().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// funxtion: IDENTIFIER
ParsingVisitor.prototype.visitFunxtion = function(ctx) {
    var value = ctx.IDENTIFIER().getText();
    var terminal = new syntax.TerminalNode(types.FUNCTION, value);
    this.result = terminal;
};


// handleClause: 'handle' symbol 'matching' expression 'with' block
ParsingVisitor.prototype.visitHandleClause = function(ctx) {
    var tree = new syntax.TreeNode(types.HANDLE_CLAUSE);
    ctx.symbol().accept(this);
    tree.addChild(this.result);
    ctx.expression().accept(this);
    tree.addChild(this.result);
    ctx.block().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// ifClause: 'if' expression 'then' block ('else' 'if' expression 'then' block)* ('else' block)?
ParsingVisitor.prototype.visitIfClause = function(ctx) {
    var tree = new syntax.TreeNode(types.IF_CLAUSE);
    var expressions = ctx.expression();
    var blocks = ctx.block();
    var hasElseBlock = blocks.length > expressions.length;
    for (var i = 0; i < expressions.length; i++) {
        expressions[i].accept(this);
        tree.addChild(this.result);
        blocks[i].accept(this);
        tree.addChild(this.result);
    }
    if (hasElseBlock) {
        blocks[blocks.length - 1].accept(this);
        tree.addChild(this.result);
    }
    this.result = tree;
};


// imaginary: (real | sign='-')? 'i'
ParsingVisitor.prototype.visitImaginary = function(ctx) {
    var string = '';
    var real = ctx.real();
    var sign = ctx.sign;
    if (real) {
        real.accept(this);
        string += this.result;
        if (real.constructor.name === 'ConstantRealContext') {
            string += ' ';
        }
    } else if (sign) {
        string += '-';
    }
    string += 'i';
    this.result = string;
};


// imaginaryNumber: imaginary
ParsingVisitor.prototype.visitImaginaryNumber = function(ctx) {
    ctx.imaginary().accept(this);
    var value = this.result;
    var terminal = new syntax.TerminalNode(types.NUMBER, value);
    this.result = terminal;
};


// indices: '[' list ']'
ParsingVisitor.prototype.visitIndices = function(ctx) {
    var tree = new syntax.TreeNode(types.INDICES);
    ctx.list().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// infiniteNumber: 'infinity'
ParsingVisitor.prototype.visitInfiniteNumber = function(ctx) {
    var value = 'infinity';
    var terminal = new syntax.TerminalNode(types.NUMBER, value);
    this.result = terminal;
};


// inlineList: expression (',' expression)*
ParsingVisitor.prototype.visitInlineList = function(ctx) {
    // delegate to abstract type
    this.visitList(ctx);
};


// inlineProcedure: statement (';' statement)*
ParsingVisitor.prototype.visitInlineProcedure = function(ctx) {
    // delegate to abstract type
    this.visitProcedure(ctx);
};


// inlineCatalog: association (',' association)*
ParsingVisitor.prototype.visitInlineCatalog = function(ctx) {
    // delegate to abstract type
    this.visitCatalog(ctx);
};


// inlineText: TEXT
ParsingVisitor.prototype.visitInlineText = function(ctx) {
    var value = ctx.TEXT().getText();
    var terminal = new syntax.TerminalNode(types.TEXT, value);
    this.result = terminal;
};


// inversionExpression: op=('-' | '/' | '*') expression
ParsingVisitor.prototype.visitInversionExpression = function(ctx) {
    var tree = new syntax.TreeNode(types.INVERSION_EXPRESSION);
    tree.operator = ctx.op.text;
    ctx.expression().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// list:
//     expression (',' expression)* |
//     NEWLINE (expression NEWLINE)* |
//     /*empty list*/
ParsingVisitor.prototype.visitList = function(ctx) {
    var tree = new syntax.TreeNode(types.LIST);
    var type = ctx.constructor.name;
    if (type !== 'EmptyListContext') {
        var expressions = ctx.expression();
        for (var i = 0; i < expressions.length; i++) {
            expressions[i].accept(this);
            tree.addChild(this.result);
        }
    }
    if (type !== 'NewlineListContext') tree.isSimple = true;
    this.result = tree;
};


// logicalExpression: expression op=('and' | 'sans' | 'xor' | 'or') expression
ParsingVisitor.prototype.visitLogicalExpression = function(ctx) {
    var tree = new syntax.TreeNode(types.LOGICAL_EXPRESSION);
    var expressions = ctx.expression();
    expressions[0].accept(this);
    tree.addChild(this.result);
    tree.operator = ctx.op.text;
    expressions[1].accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// magnitudeExpression: '|' expression '|'
ParsingVisitor.prototype.visitMagnitudeExpression = function(ctx) {
    var tree = new syntax.TreeNode(types.MAGNITUDE_EXPRESSION);
    ctx.expression().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// message: IDENTIFIER
ParsingVisitor.prototype.visitMessage = function(ctx) {
    var value = ctx.IDENTIFIER().getText();
    var terminal = new syntax.TerminalNode(types.MESSAGE, value);
    this.result = terminal;
};


// messageExpression: expression '.' message parameters
ParsingVisitor.prototype.visitMessageExpression = function(ctx) {
    var tree = new syntax.TreeNode(types.MESSAGE_EXPRESSION);
    ctx.expression().accept(this);
    tree.addChild(this.result);
    ctx.message().accept(this);
    tree.addChild(this.result);
    ctx.parameters().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// moment: MOMENT
ParsingVisitor.prototype.visitMoment = function(ctx) {
    var value = ctx.MOMENT().getText();
    var terminal = new syntax.TerminalNode(types.MOMENT, value);
    this.result = terminal;
};


// newlineList: NEWLINE (expression NEWLINE)*
ParsingVisitor.prototype.visitNewlineList = function(ctx) {
    // delegate to abstract type
    this.visitList(ctx);
};


// newlineProcedure: NEWLINE (statement NEWLINE)*
ParsingVisitor.prototype.visitNewlineProcedure = function(ctx) {
    // delegate to abstract type
    this.visitProcedure(ctx);
};


// newlineCatalog: NEWLINE (association NEWLINE)*
ParsingVisitor.prototype.visitNewlineCatalog = function(ctx) {
    // delegate to abstract type
    this.visitCatalog(ctx);
};


// newlineText: TEXT_BLOCK
ParsingVisitor.prototype.visitNewlineText = function(ctx) {
    var value = ctx.TEXT_BLOCK().getText();
    var terminal = new syntax.TerminalNode(types.TEXT, value);
    terminal.isSimple = false;
    this.result = terminal;
};


// noneTemplate: 'none'
ParsingVisitor.prototype.visitNoneTemplate = function(ctx) {
    var value = 'none';
    this.result = new syntax.TerminalNode(types.TEMPLATE, value);
};


// parameters: '(' collection ')'
ParsingVisitor.prototype.visitParameters = function(ctx) {
    var tree = new syntax.TreeNode(types.PARAMETERS);
    ctx.collection().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// percent: real '%'
ParsingVisitor.prototype.visitPercent = function(ctx) {
    ctx.real().accept(this);
    var value = this.result + '%';
    var terminal = new syntax.TerminalNode(types.PERCENT, value);
    this.result = terminal;
};


// precedenceExpression: '(' expression ')'
ParsingVisitor.prototype.visitPrecedenceExpression = function(ctx) {
    var tree = new syntax.TreeNode(types.PRECEDENCE_EXPRESSION);
    ctx.expression().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// procedure:
//     statement (';' statement)*   |
//     NEWLINE (statement NEWLINE)* |
//     /*empty statements*/
ParsingVisitor.prototype.visitProcedure = function(ctx) {
    var tree = new syntax.TreeNode(types.PROCEDURE);
    var type = ctx.constructor.name;
    if (type !== 'EmptyProcedureContext') {
        var statements = ctx.statement();
        for (var i = 0; i < statements.length; i++) {
            statements[i].accept(this);
            tree.addChild(this.result);
        }
    }
    if (type !== 'NewlineProcedureContext') tree.isSimple = true;
    this.result = tree;
};


// publishClause: 'publish' expression
ParsingVisitor.prototype.visitPublishClause = function(ctx) {
    var tree = new syntax.TreeNode(types.PUBLISH_CLAUSE);
    ctx.expression().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// queueClause: 'queue' expression 'on' expression
ParsingVisitor.prototype.visitQueueClause = function(ctx) {
    var tree = new syntax.TreeNode(types.QUEUE_CLAUSE);
    var expressions = ctx.expression();
    expressions[0].accept(this);
    tree.addChild(this.result);
    expressions[1].accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// range: expression '..' expression
ParsingVisitor.prototype.visitRange = function(ctx) {
    var tree = new syntax.TreeNode(types.RANGE);
    var expressions = ctx.expression();
    expressions[0].accept(this);
    tree.addChild(this.result);
    expressions[1].accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// realNumber: real
ParsingVisitor.prototype.visitRealNumber = function(ctx) {
    ctx.real().accept(this);
    var value = this.result;
    var terminal = new syntax.TerminalNode(types.NUMBER, value);
    this.result = terminal;
};


// reference: RESOURCE
ParsingVisitor.prototype.visitReference = function(ctx) {
    var value = ctx.RESOURCE().getText();
    var terminal = new syntax.TerminalNode(types.REFERENCE, value);
    this.result = terminal;
};


// regexTemplate: REGEX
ParsingVisitor.prototype.visitRegexTemplate = function(ctx) {
    var value = ctx.REGEX().getText();
    var terminal = new syntax.TerminalNode(types.TEMPLATE, value);
    this.result = terminal;
};


// returnClause: 'return' expression?
ParsingVisitor.prototype.visitReturnClause = function(ctx) {
    var tree = new syntax.TreeNode(types.RETURN_CLAUSE);
    var expression = ctx.expression();
    if (expression) {
        expression.accept(this);
        tree.addChild(this.result);
    }
    this.result = tree;
};


// saveClause: 'save' expression 'to' expression
ParsingVisitor.prototype.visitSaveClause = function(ctx) {
    var tree = new syntax.TreeNode(types.SAVE_CLAUSE);
    var expressions = ctx.expression();
    expressions[0].accept(this);
    tree.addChild(this.result);
    expressions[1].accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// seal: reference binary
ParsingVisitor.prototype.visitSeal = function(ctx) {
    var tree = new syntax.TreeNode(types.SEAL);
    ctx.reference().accept(this);
    tree.addChild(this.result);
    ctx.binary().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// selectClause: 'select' expression 'from' (expression 'do' block)+ ('else' block)?
ParsingVisitor.prototype.visitSelectClause = function(ctx) {
    var tree = new syntax.TreeNode(types.SELECT_CLAUSE);
    var expressions = ctx.expression();
    var selector = expressions[0];
    expressions = expressions.slice(1);  // remove the first expression
    var blocks = ctx.block();
    var hasElseBlock = blocks.length > expressions.length;
    selector.accept(this);
    tree.addChild(this.result);
    for (var i = 0; i < expressions.length; i++) {
        expressions[i].accept(this);
        tree.addChild(this.result);
        blocks[i].accept(this);
        tree.addChild(this.result);
    }
    if (hasElseBlock) {
        blocks[blocks.length - 1].accept(this);
        tree.addChild(this.result);
    }
    this.result = tree;
};


// statement: mainClause handleClause*
ParsingVisitor.prototype.visitStatement = function(ctx) {
    var tree = new syntax.TreeNode(types.STATEMENT);
    ctx.mainClause().accept(this);
    tree.addChild(this.result);
    var handleClauses = ctx.handleClause();
    for (var i = 0; i < handleClauses.length; i++) {
        handleClauses[i].accept(this);
        tree.addChild(this.result);
    }
    this.result = tree;
};


// structure: '[' collection ']'
ParsingVisitor.prototype.visitStructure = function(ctx) {
    var tree = new syntax.TreeNode(types.STRUCTURE);
    ctx.collection().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// subcomponent: variable indices
ParsingVisitor.prototype.visitSubcomponent = function(ctx) {
    var tree = new syntax.TreeNode(types.SUBCOMPONENT);
    ctx.variable().accept(this);
    tree.addChild(this.result);
    ctx.indices().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// subcomponentExpression: expression indices
ParsingVisitor.prototype.visitSubcomponentExpression = function(ctx) {
    var tree = new syntax.TreeNode(types.SUBCOMPONENT_EXPRESSION);
    ctx.expression().accept(this);
    tree.addChild(this.result);
    ctx.indices().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// symbol: SYMBOL
ParsingVisitor.prototype.visitSymbol = function(ctx) {
    var value = ctx.SYMBOL().getText();
    var terminal = new syntax.TerminalNode(types.SYMBOL, value);
    this.result = terminal;
};


// tag: TAG
ParsingVisitor.prototype.visitTag = function(ctx) {
    var value = ctx.TAG().getText();
    var terminal = new syntax.TerminalNode(types.TAG, value);
    this.result = terminal;
};


// task: SHELL NEWLINE* procedure NEWLINE* EOF
ParsingVisitor.prototype.visitTask = function(ctx) {
    var tree = new syntax.TreeNode(types.TASK);
    tree.shell = ctx.SHELL().getText();
    ctx.procedure().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// throwClause: 'throw' expression
ParsingVisitor.prototype.visitThrowClause = function(ctx) {
    var tree = new syntax.TreeNode(types.THROW_CLAUSE);
    ctx.expression().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// trueProbability: 'true'
ParsingVisitor.prototype.visitTrueProbability = function(ctx) {
    var value = 'true';
    var terminal = new syntax.TerminalNode(types.PROBABILITY, value);
    this.result = terminal;
};


// undefinedNumber: 'undefined'
ParsingVisitor.prototype.visitUndefinedNumber = function(ctx) {
    var value = 'undefined';
    var terminal = new syntax.TerminalNode(types.NUMBER, value);
    this.result = terminal;
};


// variable: IDENTIFIER
ParsingVisitor.prototype.visitVariable = function(ctx) {
    var value = ctx.IDENTIFIER().getText();
    var terminal = new syntax.TerminalNode(types.VARIABLE, value);
    this.result = terminal;
};


// variableReal: FLOAT
ParsingVisitor.prototype.visitVariableReal = function(ctx) {
    this.result = ctx.FLOAT().getText();
};


// version: VERSION
ParsingVisitor.prototype.visitVersion = function(ctx) {
    var value = ctx.VERSION().getText();
    var terminal = new syntax.TerminalNode(types.VERSION, value);
    this.result = terminal;
};


// waitClause: 'wait' 'for' recipient 'from' expression
ParsingVisitor.prototype.visitWaitClause = function(ctx) {
    var tree = new syntax.TreeNode(types.WAIT_CLAUSE);
    ctx.recipient().accept(this);
    tree.addChild(this.result);
    ctx.expression().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// whileClause: 'while' expression 'do' block
ParsingVisitor.prototype.visitWhileClause = function(ctx) {
    var tree = new syntax.TreeNode(types.WHILE_CLAUSE);
    ctx.expression().accept(this);
    tree.addChild(this.result);
    ctx.block().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};


// withClause: 'with' ('each' symbol 'in')? expression 'do' block
ParsingVisitor.prototype.visitWithClause = function(ctx) {
    var tree = new syntax.TreeNode(types.WITH_CLAUSE);
    var symbol = ctx.symbol();
    if (symbol) {
        symbol.accept(this);
        tree.addChild(this.result);
    }
    ctx.expression().accept(this);
    tree.addChild(this.result);
    ctx.block().accept(this);
    tree.addChild(this.result);
    this.result = tree;
};