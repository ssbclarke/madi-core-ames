"use strict";
const TAKEAWAY = 'takeaway';
const PROBLEM = 'problem';
const TREND = 'trend';
const SOLUTION = 'solution';
const QUOTE = 'quote';
const ACTOR = 'actor';
const NONE = 'none';
const COLOR_TAKEAWAY = "#FCFE7DFF";
const COLOR_PROBLEM = "#FCFE7DFF";
const COLOR_TREND = "#9BEDFDFF";
const COLOR_SOLUTION = "#FFC2E8FF";
const COLOR_QUOTE = "#FFE08AFF";
const COLOR_ACTOR = "#C7FE80FF";
const SOURCE_MATCH_ERROR = "Source does not match";
const SOURCE_MISSING_ERROR = "Source does not exist";
module.exports = {
    TAKEAWAY,
    PROBLEM,
    TREND,
    SOLUTION,
    QUOTE,
    ACTOR,
    NONE,
    COLOR_TAKEAWAY,
    COLOR_PROBLEM,
    COLOR_TREND,
    COLOR_SOLUTION,
    COLOR_QUOTE,
    COLOR_ACTOR,
    SOURCE_MATCH_ERROR,
    SOURCE_MISSING_ERROR,
    CONST_ARRAY: [TAKEAWAY, PROBLEM, TREND, SOLUTION, QUOTE, ACTOR, NONE],
    COLOR_ARRAY: [COLOR_TAKEAWAY, COLOR_PROBLEM, COLOR_TREND, COLOR_SOLUTION, COLOR_QUOTE, COLOR_ACTOR, null]
};
