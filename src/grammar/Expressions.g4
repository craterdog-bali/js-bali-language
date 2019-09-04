grammar Expressions;
import Elements;

expression:                  // Precedence (highest to lowest)
    component                                                      #componentExpression     |
    variable                                                       #variableExpression      |
    funxtion arguments                                             #functionExpression      |
    '(' expression ')'                                             #precedenceExpression    |
    '@' expression                                                 #dereferenceExpression   |
    expression '.' message arguments                               #messageExpression       |
    expression indices                                             #subcomponentExpression  |
    expression '&' expression                                      #concatenationExpression |
    expression '!'                                                 #factorialExpression     |
    <assoc=right> expression '^' expression                        #exponentialExpression   |
    op=('-' | '*') expression                                      #inversionExpression     |
    expression op=('*' | '/' | '//' | '+' | '-') expression        #arithmeticExpression    |
    '|' expression '|'                                             #magnitudeExpression     |
    expression op=('<' | '=' | '>' | 'is' | 'matches') expression  #comparisonExpression    |
    'not' expression                                               #complementExpression    |
    expression op=('and' | 'sans' | 'xor' | 'or') expression       #logicalExpression       |
    expression '?' expression                                      #defaultExpression
;

variable: IDENTIFIER;

funxtion: IDENTIFIER;

message: IDENTIFIER;

arguments: '(' list ')';

indices: '[' keys ']';

keys: range | list;

