"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const stripOrphans = require('./converter/helpers/stripOrphans')
// const buildSources = require('./converter/helpers/buildSources')
// const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');
const nedb_1 = __importDefault(require("@seald-io/nedb"));
// import { TAKEAWAY, PROBLEM, SOLUTION, QUOTE, ACTOR, NONE, CONST_ARRAY, SOURCE_MATCH_ERROR, SOURCE_MISSING_ERROR } from './constants'
const ensureArray = (input) => {
    if (!Array.isArray(input)) {
        return [input];
    }
};
// Datastore
class MuralDB extends nedb_1.default {
    constructor(options = {}) {
        const { data = [], idField = "id", 
        // dbname="muraldb", 
        acctId, muralId } = options;
        super(options);
        this.chainFind = this._findAsync;
        this.chainUpdate = this._updateAsync;
        // modifies only objects in the result set.
        // returns the entire results, not just the changed ones
        this.addRelations = ({ modifyOriginal = true, parentField = 'parent' }) => {
            this.chain((results) => __awaiter(this, void 0, void 0, function* () {
                yield this.setupCacheDb(results);
                // get the arrows from the FULL original db
                // type:arrow && tip:single
                // parent = startRefId
                // widget = endRefId
                const arrows = yield this.findAsync({
                    type: 'arrow',
                    tip: 'single'
                }, {
                    endRefId: 1, startRefId: 1
                });
                //update by adding parents but only in the selected DB
                const relationPromises = arrows.map((a) => {
                    return this._updateAsync(
                    // select the child
                    { _id: a._id }, 
                    // set the parentField to the other refId
                    { $set: { [parentField]: a.startRefId } }, 
                    // pass in the option to update the original db as well
                    { modifyOriginal });
                });
                yield Promise.all(relationPromises);
                return this.cacheDb ? this.cacheDb.findAsync({}) : null; // returns entire results set
            }));
            return this;
        };
        // this.raw = data
        this.acct = acctId;
        this.mural = muralId;
        this.queue = Promise.resolve();
        this.cacheDb = null;
        if (!Array.isArray(data)) {
            throw ('Data must be an array of objects');
        }
    }
    then(callback) { callback(this.queue); }
    chain(callback) {
        return this.queue = this.queue
            .then(callback)
            .finally(() => {
            this.queue = Promise.resolve();
            this.cacheDb = null;
        });
    }
    runOperation(results, func, params) {
        return __awaiter(this, void 0, void 0, function* () {
            // this.cacheDb = this.cacheDb || new MuralDB()
            // const count = await this.cacheDb.countAsync({})
            // if(results){
            //     // console.log('--- has results')
            //     await this.cacheDb.insertAsync(results)
            // }else if(count === 0){ // no results but there is a DB already, set the db to full
            //     // console.log('--- count is zero')
            //     await this.cacheDb.insertAsync(this.getAllData())
            // }
            yield this.setupCacheDb(results);
            // run the command on the new db
            return this.cacheDb ? this.cacheDb[func](...params) : null;
            // this.cacheDb = null
        });
    }
    _findAsync(query, projection) {
        this.chain((results) => __awaiter(this, void 0, void 0, function* () {
            // this.cacheDb = this.cacheDb || new MuralDB()
            // const count = await this.cacheDb.countAsync({})
            // if(results){
            //     await this.cacheDb.insertAsync(results)
            // }else if(count === 0){
            //     await this.cacheDb.insertAsync(this.getAllData())
            // }
            yield this.setupCacheDb(results);
            return super.findAsync.apply(this.cacheDb, [query, projection]);
        }));
        return this;
    }
    filterType(types, projection = {}) {
        // console.log('\nfilterType')
        types = ensureArray(types);
        // let result = this.findAsync({
        //     type:{'$in':types}
        // },projection)
        // return result
        this.chain((x) => __awaiter(this, void 0, void 0, function* () {
            const func = '_findAsync';
            const params = [{ type: { '$in': types } }, projection];
            return this.runOperation(x, func, params);
        }));
        // console.log(this.findAsync)
        return this;
    }
    textStartsWith(text, projection = {}) {
        // console.log('\ntextStartsWith')
        // return this.findAsync({
        //     $where: function(){return !!this.text && this.text.startsWith(text)}
        // }, projection)
        this.chain((x) => __awaiter(this, void 0, void 0, function* () {
            const func = '_findAsync';
            const params = [{
                    $where: function () { return !!this.text && this.text.startsWith(text); }
                }, projection];
            return this.runOperation(x, func, params);
        }));
        return this;
    }
    setupCacheDb(results) {
        return __awaiter(this, void 0, void 0, function* () {
            this.cacheDb = this.cacheDb || new MuralDB();
            const count = yield this.cacheDb.countAsync({});
            if (results) {
                yield this.cacheDb.insertAsync(results);
            }
            else if (count === 0) {
                yield this.cacheDb.insertAsync(this.getAllData());
            }
        });
    }
    // Updates widgets and works with chained results
    _updateAsync(query, updateQuery, options) {
        // check if the user wants to update the original dataset or just the results of the chain
        const modifyOriginal = options === null || options === void 0 ? void 0 : options.modifyOriginal;
        this.chain((results) => __awaiter(this, void 0, void 0, function* () {
            yield this.setupCacheDb(results);
            if (modifyOriginal) {
                yield super.updateAsync.apply(this, [query, updateQuery, options]);
            }
            return super.updateAsync.apply(this.cacheDb, [query, updateQuery, options]);
            // this should return the entire DB, not just the modified ones.  User should follow a new query for modified elements
        }));
        return this;
    }
    textContains(text, projection = {}) {
        // console.log('\ntextContains')
        // return this.findAsync({
        //     $where: function(){return !!this.text && this.text.includes(text)}
        // }, projection)
        this.chain((x) => __awaiter(this, void 0, void 0, function* () {
            const func = '_findAsync';
            const params = [{
                    $where: function () { return !!this.text && this.text.includes(text); }
                }, projection];
            return this.runOperation(x, func, params);
        }));
        return this;
    }
    textMatchesRegex(expression, projection = {}) {
        // console.log('\ntextMatchesRegex')
        try {
            // let regex = new RegExp(expression);
            // // regex.lastIndex = 0;
            // let result = this.findAsync({
            //     $where: function(){return !!this.text && !!this.text.match(regex)}
            // }, projection)
            // if (this._chainFlag){
            //     return resultSet(result)
            // }
            // return result
            const regex = new RegExp(expression);
            this.chain((x) => __awaiter(this, void 0, void 0, function* () {
                const func = '_findAsync';
                const params = [{
                        $where: function () { return !!this.text && !!this.text.match(regex); }
                    }, projection];
                return this.runOperation(x, func, params);
            }));
            return this;
        }
        catch (e) {
            throw "Invalid Regex expression.";
        }
    }
    filterBgColor(color, projection) {
        // console.log('\nfilterBgColor')
        const validColorReg = /^#([0-9a-f]{3}){1,2}$/i;
        if (!validColorReg.test(color)) {
            const colors = { "aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff",
                "beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff", "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887",
                "cadetblue": "#5f9ea0", "chartreuse": "#7fff00", "chocolate": "#d2691e", "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c", "cyan": "#00ffff",
                "darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9", "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f",
                "darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f", "darkturquoise": "#00ced1",
                "darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff", "dimgray": "#696969", "dodgerblue": "#1e90ff",
                "firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22", "fuchsia": "#ff00ff",
                "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080", "green": "#008000", "greenyellow": "#adff2f",
                "honeydew": "#f0fff0", "hotpink": "#ff69b4", "indianred ": "#cd5c5c", "indigo": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c",
                "lavender": "#e6e6fa", "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080", "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2",
                "lightgrey": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de",
                "lightyellow": "#ffffe0", "lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6",
                "magenta": "#ff00ff", "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370d8", "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee",
                "mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585", "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5",
                "navajowhite": "#ffdead", "navy": "#000080", "oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6",
                "palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#d87093", "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080",
                "rebeccapurple": "#663399", "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1",
                "saddlebrown": "#8b4513", "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0", "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4",
                "tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0",
                "violet": "#ee82ee", "wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5", "yellow": "#ffff00", "yellowgreen": "#9acd32" };
            if (typeof colors[color.toLowerCase()] != 'undefined')
                color = colors[color.toLowerCase()];
        }
        color = color.toUpperCase();
        this.chain((x) => __awaiter(this, void 0, void 0, function* () {
            // let result = this.findAsync({
            //     $where: function(){return !!this.style && !!this.style.backgroundColor && this.style.backgroundColor.indexOf(color)===0}
            // }, projection)
            // return result
            // if(x) console.log('color x', x.length)
            const func = '_findAsync';
            const params = [{
                    $where: function () {
                        return !!this.style && !!this.style.backgroundColor && this.style.backgroundColor.indexOf(color) === 0;
                    }
                }, projection];
            return yield this.runOperation(x, func, params);
        }));
        return this;
    }
}
exports.default = MuralDB;
