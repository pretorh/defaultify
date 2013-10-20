module.exports = defaultify;

function defaultify(user, defaults, transform, raiseError) {
    var userIsObject = isObject(user);
    var res = setFields(user, defaults, transform, userIsObject);
    
    if (userIsObject) {
        checkUnknownFields(user, res);
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

function setFields(user, defaults, transform, userIsObject) {
    var res = {
        value: {},
        info: {}
    };
    for (var key in defaults) {
        if (isObject(defaults[key])) {
            var obj = defaultify(user[key], defaults[key], transform ? transform[key] : null);
            setValue(res, key, obj.value, obj.info);
        } else if (userIsObject && user.hasOwnProperty(key)) {
            setFromUserKey(res, key, user, defaults, transform);
        } else {
            setValue(res, key, defaults[key], "default");
        }
    }
    return res;
}

function setFromUserKey(res, key, user, defaults, transform) {
    var defaultKeyType = typeof(defaults[key]);
    
    if (transform && typeof(transform[key]) == "function") {
        try {
            var val = transform[key](user[key]);
            setValue(res, key, val, "set");
        } catch (e) {
            setValue(res, key, defaults[key], "transform failed: " + e.message);
        }
    } else if (typeof(user[key]) === defaultKeyType || defaults[key] === null) {
        setValue(res, key, user[key], "set");
    } else {
        setValue(res, key, defaults[key], "invalid type (expected " + defaultKeyType + ")");
    }
}

function checkUnknownFields(user, res) {
    for (var key in user) {
        if (!res.value.hasOwnProperty(key)) {
            res.info[key] = "unknown key";
        }
    }
}

function checkInfo(info, path) {
    for (var key in info) {
        if (typeof(info[key]) === "object") {
            checkInfo(info[key], path + key + ".");
        } else if (info[key] === "unknown key") {
            throw new Error("unknown key " + path + key);
        } else if (info[key].substr(0, 12) === "invalid type") {
            throw new Error(info[key] + " for " + path + key);
        } else if (info[key].substr(0, 16) === "transform failed") {
            throw new Error(info[key] + " for " + path + key);
        }
    }
}

function isObject(value) {
    return typeof(value) === "object" && value != null && value.constructor.name != "Array";
}

function setValue(res, key, value, detail) {
    res.value[key] = value;
    res.info[key] = detail;
}
