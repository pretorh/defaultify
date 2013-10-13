module.exports = defaultify;

function defaultify(user, defaults) {
    var res = {
        value: {},
        info: {}
    };
    var userIsObject = isObject(user);
    for (var key in defaults) {
        if (isObject(defaults[key])) {
            var obj = defaultify(user[key], defaults[key]);
            setValue(res, key, obj.value, obj.info);
        } else if (userIsObject && user.hasOwnProperty(key)) {
            if (typeof(user[key]) === typeof(defaults[key])) {
                setValue(res, key, user[key], "set");
            } else {
                setValue(res, key, defaults[key], "invalid type");
            }
        } else {
            setValue(res, key, defaults[key], "default");
        }
    }
    if (userIsObject) {
        for (var key in user) {
            if (!res.value.hasOwnProperty(key)) {
                res.info[key] = "unknown key";
            }
        }
    }
    return res;
}

function isObject(value) {
    return typeof(value) === "object" && value.constructor.name != "Array";
}

function hasKeyOfType(object, key, type) {
    return (object.hasOwnProperty(key) && typeof(object[key]) === type);
}

function addPrefixedArrayInto(into, key, array) {
    for (var i = 0; i < array.length; ++i) {
        into.push(key + "." + array[i]);
    }
}

function setValue(res, key, value, detail) {
    res.value[key] = value;
    res.info[key] = detail;
}
