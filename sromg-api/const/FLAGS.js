/**
 * Flags for modifying how the program is run, combined by using bitwise `or`, ex: `FLAG_1 | FLAG_2 | ... | FLAG_N`
 * 
 * @author   LiquidZulu
 * @property {Number}ALL                       - shorthand for raising all flags, equivalent to `FLAG_1 | FLAG_2 | ... | LAST_FLAG`
 * @property {Number}META_PARSER_PARSE_AUTHOR  - indicates that input should be parsed as relating to an authour rather than a comic
 * @property {Number}META_PARSER_NO_LOGS       - indicates that logs should not be sent to the console
 * @property {Number}META_PARSER_NO_EVENT_LOGS - indicates that logs for new events should not be sent to the console
 */

module.exports = {
    ALL:                       0xff,
    META_PARSER_PARSE_AUTHOR:  0b00000001,
    META_PARSER_NO_LOGS:       0b00000010,
    META_PARSER_NO_EVENT_LOGS: 0b00000100
}