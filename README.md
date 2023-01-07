## archived

this is basically `Object.assign(options, defaultOptions)`

## defaultify

utility javascript module to set object literals used as options for functions

Used to setup option objects with default values.

### Overwrite default values with user-given values ###
You have a function taking an object with the possible keys minValue (defaulting to 1) and maxValue (defaulting to 5).
The default value are {minValue: 1, maxValue: 5}

    // the user overwrites minValue, but uses the default value for maxValue
    doStuff({
        minValue: 2
    });
    
    // doStuff should use the following object as options
    {
        minValue: 2,
        maxValue: 5
    }
    
    // doStuff could accomplish this with:
    function doStuff(options) {
        var defualtOpts = {
            minValue: 1,
            maxValue: 5
        };
        // opts is an object with the keys info (details about the change) and value (the options to use)
        var opts = defaultify(options, defualtOpts);
        opts = opts.value;
        
        // shorter, raising error if the user passes illigal options
        // var opts = defaultify(options, defualtOpts, true).value;
        
        ...
    
    }

### Transform user given values ###
You have a function taking a command (string) as one of the object values. But you want abbreviations to be allowed

    // user uses abbreviation for test
    doCommand({command: "t"});
    
    // doCommand can use a transform function to change this type
    function doCommand(options) {
        var defualtOpts = {
            command: "run"
        };
        var transform = {
            command: function(value) {
                // value is the value passed in by the user, in this case "t"
                if (value === "r") return "run";
                if (value === "t") return "test";
                return value;
            }
        };
        var opts = defaultify(options, defualtOpts, transform, true).value;
        
        ...
    }

### Transform functions as validators ###
Transform functions can also be used to validate user input. In the example above, the transform object can be changed
to

    var transform = {
        command: function(value) {
            if (value === "r" || value === "run") return "run";
            if (value === "t" || value === "test") return "test";
            throw new Error("Invalid command '" + value + "'");
        }
    };
    
    // calling doCommand with an invalid command text raises an error
    try {
        doStuff({command: "say hello"});
    } catch (e) {
        // e.message === "transform failed: Invalid command 'say hello' for command"
    }
    
