
/// <reference path="C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\14\TEMPLATE\LAYOUTS\SP.core.debug.js" />
/// <reference path="C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\14\TEMPLATE\LAYOUTS\SP.debug.js" />
/// <reference path="C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\14\TEMPLATE\LAYOUTS\MicrosoftAjax.js" />
// user defined variables - personField is the source for all the data extraction, other "Field" variables are the targets for the retrieved data
var personField = "Assigned To";
var lastNameField = "Last Name";
var firstNameField = "First Name";
var officeField = "Location";
var managerNameField = "Reports To";

// declaring the remaining variables
var assigned;
var assignedToPeoplePicker;
var employeeEID;
var queryResult;
var lastName;
var firstName;
var office;
var managerName;
var msg = "At least one of the users you have selected is not from your office. Are you sure you want to add them?";
var errorInfo = "";
var originalClick = "";
var originalUsersString = "";

// myConfirm is called by the presave function to return an error message
// to see if the user wants to continue or cancel
function myConfirm(originalFunction) {
    //return window.confirm(msg);
    if (confirm(msg)) {
        //        var fnc = window[originalFunction];
        //        if (fnc && fnc === "function") {
        //            fnc();
        //            //return true;
        //            //return window.confirm(msg);
        //        }
        // correct the empty User Field issue
        var thisRow = $("h3").filter(function () {
            // Ensures we get a match whether or not the People Picker is required (if required, the nobr contains a span also)
            return ($(this).text().indexOf(personField) > -1);
        }).closest('tr[id*="PlaceHolderMain"]');
        //alert(thisRow.id.toString());
        //        var assignees = thisRow.find("div[name='upLevelDiv']").html();
        //        if (assignees.length() < 5) {
        //alert(assignedToPeoplePicker);
        thisRow.find("div[name='upLevelDiv']").html(assignedToPeoplePicker);
        //        }
        $('input[id$=btnOK]').attr('onClick', originalClick);
        return true;
    } else {
        //window.frameElement.cancelPopUp();
        return false;
    }
}
//function myConfirm() {
//    //aclPreSaveAction();
//    return window.confirm(msg);
//}

// aclPreSaveAction is called when the user hits Save from a permissions form (aclinv.aspx)
function aclPreSaveAction(personField, currentUsersValues) {
    // parse user field into array in case there are multiple users in the field
    var officeName;
    var userName;
    var tempName;
    var errorCounter = 0;
    // retrieves the PreferredName of the value entered into the personField
    assigned = $().OetSPFindPeoplePicker({ peoplePickerDisplayName: personField });
    //var userFieldContents = (assigned.peoplePickerDisplayName);
    assignedToPeoplePicker = (assigned.currentValue);
    //assignedToPeoplePicker = assignedToPeoplePicker.split("(");
    //assignedToPeoplePicker = assignedToPeoplePicker[0];

    $.each(assignedToPeoplePicker.split(';'), function () {
        tempName = $.trim(this);
        //alert(tempName);
        $().SPServices({
            operation: "GetUserProfileByName",
            async: false,
            AccountName: tempName,
            completefunc: function (xData, Status) {
                officeName = getUPValue(xData.responseXML, "Office");
                userName = getUPValue(xData.responseXML, "AccountName");
            }
        });
        if (currentUsersValues != officeName || !officeName) {
            if (!userName) {
                msg += "\nCouldn't find " + tempName + " in SharePoint's User Profile system.";
            }
            else {
                msg += '\nOffice was blank or not the same as your Office for user: ' + tempName + '; Office: ' + officeName;
            }
            errorCounter++;
        }
    });
    alert(errorCounter);
    if (errorCounter > 0) {
        return myConfirm();
        //return window.confirm(msg);
        //return false;
    } else {
        return true;
    }
    //return window.confirm(msg);
}

// function to parse xml and return value
function getUPValue(x, p) {
    var thisValue = $(x).SPFilterNode("PropertyData").filter(function () {
        return $(this).find("Name").text() == p;
    }).find("Values").text();
    return thisValue;
}

// MAIN
$(document).ready(function () {
    //var managerName;
    //var lastName;
    var currentUsersDepartment;
    var currentUsersOffice;
    var currentUsersValues = $().SPServices.SPGetCurrentUser({
        //webURL: "", 	// Added in 2013.01
        //fieldName: "Name",
        //fieldName: "Department",
        fieldName: "Office",
        //fieldNames: ["ID", "Last Name", "Department", "Office"],     	// Added in v0.7.2 to allow multiple columns
        debug: false
    });
    var url = window.location.toString().toLowerCase();
    //$('.ms-dlgContent', window.parent.document).css('height', '650px');
    if (url.indexOf("aclinv.aspx") !== -1) {
        $('input[id$=chkSendEmailv15]').attr('checked', false);
        //personField = "Users/Groups:";
        personField = "Select Users";
        //        $('.ms-inputuserfield').focusout(function () {
        //            $('h3').filter(function () { return ($(this).text().indexOf(personField) > -1) }).closest('tr[id*="PlaceHolderMain"]').find("div[name='upLevelDiv']").css("background-color", "yellow");
        //        });
        originalClick = $('input[id$=btnOK]').attr('onClick');
        var cleanedOriginalClick = originalClick.replace("javascript:", "");
        $('input[id$=btnOK]').attr('onClick', 'return myConfirm()');
        //alert(existingClick);
        //var updatedClick = originalClick + '; return myConfirm();';
        //var updatedClick = 'return myConfirm(' + cleanedOriginalClick + ')';
        //$('input[id$=btnOK]').attr('onClick', updatedClick);
        //        $('input[id$=btnOK]').click(function () {
        //            $(this).attr('onClick', updatedClick);
        //        });
        //        var newClick = $('input[id$=btnOK]').attr('onClick');
        //$('input[id$=btnOK]').attr('onClick', updatedClick);
        //alert(updatedClick);
        //$('input[id$=btnOK]').attr('onSubmit', 'return myConfirm()');
        //        $('input[id$=btnOK]').click(function () {
        //            //event.stopImmediatePropagation();
        //            //event.preventDefault();
        //            //aclPreSaveAction(personField, currentUsersValues);
        //            //aclPreSaveAction();
        //            return myConfirm();
        //        });



        //        var myClick = null;

        //        //get a list of jQuery handlers bound to the click event
        //        var jQueryHandlers = $('input[id$=btnOK]').data('events').click;

        //        //grab the first jquery function bound to this event
        //        $.each(jQueryHandlers, function (i, f) {
        //            myClick = f.handler;
        //            return false;
        //        });

        //        //unbind the original
        //        $('input[id$=btnOK]').unbind('click');

        //        //bind the modified one
        //        $('input[id$=btnOK]').click(function () {
        //            if (window.confirm(msg)) {
        //                myClick();
        //            } else {
        //                return false;
        //            }
        //        });



    }
});