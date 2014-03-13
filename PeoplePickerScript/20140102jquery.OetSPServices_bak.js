

// Find a People Picker in the aclinv.aspx page for permissions
// Returns references to:
//   row - The TR which contains the People Picker (useful if you'd like to hide it at some point)
//   contents - The element which contains the current value
//   currentValue - The current value if it is set
//   checkNames - The Check Names image (in case you'd like to click it at some point)
$.fn.OetSPPermissionPeoplePicker = function (options) {

    var opt = $.extend({}, {
        peoplePickerDisplayName: "", // The displayName of the People Picker on the form
        valueToSet: "", 				// The value to set the People Picker to. Should be a string containing each username or groupname separated by semi-colons.
        checkNames: true				// If set to true, the Check Names image will be clicked to resolve the names
    }, options);

    var thisRow = $("h3").filter(function () {
        // Ensures we get a match whether or not the People Picker is required (if required, the nobr contains a span also)
        return ($(this).text().indexOf(personField) > -1);
    }).closest('tr[id*="PlaceHolderMain"]');
    //alert(thisRow.id.toString());
    var thisContents = thisRow.find("div[name='upLevelDiv']");
    var thisCheckNames = thisRow.find("img[Title='Check Names']:first");
    //alert($.thisRow.html());

    // If a value was provided, set the value
    if (opt.valueToSet.length > 0) {
        thisContents.html(opt.valueToSet);
    }

    // If checkName is true, click the check names icon
    if (opt.checkNames) {
        thisCheckNames.click();
    }
    var thisCurrentValue = $.trim(thisContents.text());
    // Parse the entity data
    var dictionaryEntries = [];

    // IE
    thisContents.children("span").each(function () {

        // Grab the entity data
        var thisData = $(this).find("div[data]").attr("data");

        var dictionaryEntry = {};

        // Entity data is only available in IE
        if (thisData != undefined) {
            var arrayOfDictionaryEntry = $.parseXML(thisData);
            $xml = $(arrayOfDictionaryEntry);

            $xml.find("DictionaryEntry").each(function () {
                var key = $(this).find("Key").text();
                var value = $(this).find("Value").text();
                dictionaryEntry[key] = value;
            });
            dictionaryEntries.push(dictionaryEntry);
            // For other browsers, we'll call GetUserInfo to get the data
        } else {
            $().SPServices({
                operation: "GetUserInfo",
                async: false,
                cacheXML: true,
                userLoginName: $(this).attr("title"),
                completefunc: function (xData, Status) {

                    $(xData.responseXML).find("User").each(function () {

                        $.each(this.attributes, function (i, attrib) {
                            var key = attrib.name;
                            var value = attrib.value;
                            dictionaryEntry[key] = value;
                        });
                        dictionaryEntries.push(dictionaryEntry);
                    });
                }
            });
        }
    });

    return { row: thisRow, contents: thisContents, currentValue: thisCurrentValue, checkNames: thisCheckNames, dictionaryEntries: dictionaryEntries };
};


// Find a People Picker in the page
// Returns references to:
//   row - The TR which contains the People Picker (useful if you'd like to hide it at some point)
//   contents - The element which contains the current value
//   currentValue - The current value if it is set
//   checkNames - The Check Names image (in case you'd like to click it at some point)
$.fn.OetSPFindPeoplePicker = function (options) {

    var opt = $.extend({}, {
        peoplePickerDisplayName: "", // The displayName of the People Picker on the form
        valueToSet: "", 				// The value to set the People Picker to. Should be a string containing each username or groupname separated by semi-colons.
        checkNames: true				// If set to true, the Check Names image will be clicked to resolve the names
    }, options);

    var thisRow = $("h3").filter(function () {
        // Ensures we get a match whether or not the People Picker is required (if required, the nobr contains a span also)
        return ($(this).text().indexOf(personField) > -1);
    }).closest('tr[id*="PlaceHolderMain"]');
    //alert(thisRow.id.toString());
    var thisContents = thisRow.find("div[name='upLevelDiv']");
    var thisCheckNames = thisRow.find("img[Title='Check Names']:first");
    //alert($.thisRow.html());

    // If a value was provided, set the value
    if (opt.valueToSet.length > 0) {
        thisContents.html(opt.valueToSet);
    }

    // If checkName is true, click the check names icon
    if (opt.checkNames) {
        thisCheckNames.click();
    }
    var thisCurrentValue = $.trim(thisContents.text());
    // Parse the entity data
    var dictionaryEntries = [];

    // IE
    thisContents.children("span").each(function () {

        // Grab the entity data
        var thisData = $(this).find("div[data]").attr("data");

        var dictionaryEntry = {};

        // Entity data is only available in IE
        if (thisData != undefined) {
            var arrayOfDictionaryEntry = $.parseXML(thisData);
            $xml = $(arrayOfDictionaryEntry);

            $xml.find("DictionaryEntry").each(function () {
                var key = $(this).find("Key").text();
                var value = $(this).find("Value").text();
                dictionaryEntry[key] = value;
            });
            dictionaryEntries.push(dictionaryEntry);
            // For other browsers, we'll call GetUserInfo to get the data
        } else {
            $().SPServices({
                operation: "GetUserInfo",
                async: false,
                cacheXML: true,
                userLoginName: $(this).attr("title"),
                completefunc: function (xData, Status) {

                    $(xData.responseXML).find("User").each(function () {

                        $.each(this.attributes, function (i, attrib) {
                            var key = attrib.name;
                            var value = attrib.value;
                            dictionaryEntry[key] = value;
                        });
                        dictionaryEntries.push(dictionaryEntry);
                    });
                }
            });
        }
    });

    return { row: thisRow, contents: thisContents, currentValue: thisCurrentValue, checkNames: thisCheckNames, dictionaryEntries: dictionaryEntries };
};
