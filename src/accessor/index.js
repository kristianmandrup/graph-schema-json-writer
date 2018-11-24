"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nonMetaKeys = function (jsonSchema) {
    var keys = Object.keys(jsonSchema);
    return keys.filter(function (key) { return /^__/.test(key); });
};
exports.filteredSchema = function (jsonSchema) {
    var keys = exports.nonMetaKeys(jsonSchema);
    return keys.reduce(function (acc, key) {
        acc[key] = jsonSchema[key];
        return acc;
    }, {});
};
var typeMap = {
    Object: "type",
    Enum: "enum",
    Interface: "interface",
    Input: "input"
};
exports.schemaByType = function (jsonSchema) {
    var schema = exports.filteredSchema(jsonSchema);
    var schemaKeys = Object.keys(schema);
    var result = schemaKeys.reduce(function (acc, key) {
        var value = jsonSchema[key];
        var type = value.type;
        var mappedType = typeMap[type] || type.toLowerCase() + "s";
        acc[mappedType] = acc[mappedType] || {};
        acc[mappedType][key] = value;
        return acc;
    }, {});
    return result;
};
