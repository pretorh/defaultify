module.exports = defaultify;

function defaultify(user, defaults, raiseError) {
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
            var defaultKeyType = typeof(defaults[key]);
            if (typeof(user[key]) === defaultKeyType) {
                setValue(res, key, user[key], "set");
            } else {
                setValue(res, key, defaults[key], "invalid type (expected " + defaultKeyType + ")");
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
    if (raiseError) {
        try {
            checkInfo(res.info, "");
        } catch (e) {
            e.arguments = res.info;
            throw e;
        }
    }
    return res;
}

function checkInfo(info, path) {
    for (var key in info) {
        if (typeof(info[key]) === "object") {
            checkInfo(info[key], path + key + ".");
        } else if (info[key] === "unknown key") {
            throw new Error("unknown key " + path + key);
        } else if (info[key].substr(0, 12) === "invalid type") {
            throw new Error(info[key] + " for " + path + key);
        }
    }
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
