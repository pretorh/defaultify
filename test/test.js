var assert = require("assert"),
    defaultify = require("../");

/*
 * setup
*/

var myobject = {
    test: "hello",
    notSpecified: 5,
    x: "a string and not a number",
    obj: {
        a: 5
    },
    obj2: "a string and not a number"
};

var defaults = {
    test: "a",
    i: 5,
    x: 6.5,
    obj: {
        a: 6,
        b: 7
    },
    arr: [1, 2, 3],
    obj2: {
        x: 5,
        y: 7
    },
    func: function() { return 5; }
};

/*
 * when
*/

var result = defaultify(myobject, defaults);
var values = result.value;
console.log(result);

/*
 * then
*/

function defaultIsReturnedIfNotFound() {
    assert.equal(values.i, 5);
}

function userValuesNotSpecifiedInDefaultNotReturned() {
    assert.equal(values.notSpecified, undefined);
}

function userValuesNotSpecifiedInDefaultInInfo() {
    assert.equal(result.info["notSpecified"], "unknown key");
}

function useUserValueIfPresent() {
    assert.equal(values.test, "hello");
}

function newObjectIsReturned() {
    var user = {};
    var dflt = {a: 6};
    var res = defaultify(user, dflt);
    assert.equal(res.value.a, 6);
    dflt.a = 7;
    assert.equal(res.value.a, 6, "value changed after default changed");
}

function useUserValueOnlyIfSameType() {
    assert.equal(values.x, 6.5);
    assert.equal(result.info["x"], "invalid type (expected number)");
}

function copiesObjects() {
    assert.equal(values.obj.a, 5);
    assert.equal(values.obj.b, 7);
}

function arraysAreCopied() {
    assert.equal(values.arr.length, 3);
}

function subObjectsCopiedCorrectly() {
    assert.equal(typeof(values.obj2), "object");
    assert.equal(values.obj2.x, 5);
}

function raiseErrorOnInvalidFields() {
    var unraised = true;
    try {
        defaultify({
            y: {
                z: "5"
            },
            z: "5"
        }, {
            x: 5,
            y: {
                z: 6
            }
        }, true);
    } catch (e) {
        unraised = false;
        assert.equal(e.message, "invalid type (expected number) for y.z");
        assert.equal(e.arguments.y.z, "invalid type (expected number)");
        assert.equal(e.arguments.z, "unknown key");
    }
    
    if (unraised) {
        assert.fail("error not raised");
    }
}

process.nextTick(defaultIsReturnedIfNotFound);
process.nextTick(userValuesNotSpecifiedInDefaultNotReturned);
process.nextTick(userValuesNotSpecifiedInDefaultInInfo);
process.nextTick(useUserValueIfPresent);
process.nextTick(newObjectIsReturned);
process.nextTick(useUserValueOnlyIfSameType);
process.nextTick(copiesObjects);
process.nextTick(arraysAreCopied);
process.nextTick(subObjectsCopiedCorrectly);
process.nextTick(raiseErrorOnInvalidFields);
