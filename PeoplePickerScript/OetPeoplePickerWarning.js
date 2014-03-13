/// <reference path="C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\14\TEMPLATE\LAYOUTS\SP.core.debug.js" />
/// <reference path="C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\14\TEMPLATE\LAYOUTS\SP.debug.js" />
/// <reference path="C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\14\TEMPLATE\LAYOUTS\MicrosoftAjax.js" />
// user defined variables - personField is the source for all the data extraction, other "Field" variables are the targets for the retrieved data
var personField = "Assigned To";
var lastNameField = "Last Name";
var firstNameField = "First Name";
var officeField = "Location";
var managerNameField = "Reports To";
var currentUsersValues;

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
var spVer = "";
var errorInfo = "";
var originalClick = "";
var originalUsersString = "";
var personFieldArray = [];
var tempPersonField = "";

// aclConfirm is called by the presave function to return an error message
// to see if the user wants to continue or cancel
function aclConfirm() {
    // SHAREPOINT IS VERSION 4 OR SP2010
    aclPreSaveAction(personField, currentUsersValues);
    $('input[id$=btnOK]').attr('onClick', originalClick);
    // SHAREPOINT IS VERSION 15 OR SP2013
    $('input[id$=btnShare]').attr('onclick', originalClick);
}

// aclConfirm is called by the presave function to return an error message
// to see if the user wants to continue or cancel
function listItemConfirm() {
    listItemPreSaveAction(currentUsersValues);
    $('input[id$=SaveItem]').attr('onClick', originalClick);
}

// aclPreSaveAction is called when the user hits Save from a permissions form (aclinv.aspx)
function aclPreSaveAction(personField, currentUsersInfo) {
    // parse user field into array in case there are multiple users in the field
    var officeName;
    var userName;
    var tempName;
    var errorCounter = 0;
    // retrieves the PreferredName of the value entered into the personField
    //assigned = $().OetSPPermissionPeoplePicker({ peoplePickerDisplayName: personField });
    if (spVer == "SP10") {
        assigned = $().OetSPPermissionPeoplePicker({ peoplePickerDisplayName: personField });
        //assignedToPeoplePicker = (assigned.currentValue);
    }
    else {
        assigned = $().OetSPPermissionPeoplePicker15({ peoplePickerDisplayName: personField });
        //assignedToPeoplePicker = (assigned.currentValue);
        //assignedToPeoplePicker = assignedToPeoplePicker.replace(/(;$)/g, "");
    }
    //assignedToPeoplePicker = assignedToPeoplePicker.split("(");
    //assignedToPeoplePicker = assignedToPeoplePicker[0];
    assignedToPeoplePicker = (assigned.currentValue);
    assignedToPeoplePicker = assignedToPeoplePicker.replace(/(;$)/g, "");
    $.each(assignedToPeoplePicker.split(';'), function () {
        tempName = $.trim(this);
        $().SPServices({
            operation: "GetUserProfileByName",
            async: false,
            AccountName: tempName,
            completefunc: function (xData, Status) {
                officeName = getUPValue(xData.responseXML, "Office");
                userName = getUPValue(xData.responseXML, "AccountName");
            }
        });
        if (currentUsersInfo != officeName || !officeName) {
            if (!userName) {
                msg += "\nCouldn't find " + tempName + " in SharePoint's User Profile system.";
            }
            else {
                msg += '\nOffice was blank or not the same as your Office for user: ' + tempName + '; Office: ' + officeName;
            }
            errorCounter++;
        }
    });
    if (errorCounter > 0) {
        if (confirm(msg)) {
            //return true;
        } else {
            //window.frameElement.cancelPopUp();
            return false;
        }
    }
    else { return true; }
}

// listItemPreSaveAction is called when the user hits Save from a list item form (NewForm.aspx, or EditForm.aspx)
function listItemPreSaveAction(currentUsersInfo) {
    // parse user field into array in case there are multiple users in the field
    var officeName;
    var userName;
    var tempName;
    var i;
    for (i = 0; i < personFieldArray.length; ++i) {
        personField = personFieldArray[i];
        var errorCounter = 0;
        // retrieves the PreferredName of the value entered into the personField
        if (spVer == "SP10") {
            assigned = $().SPFindPeoplePicker({ peoplePickerDisplayName: personField });
        } else {
            assigned = $().OetSPFindPeoplePicker15({ peoplePickerDisplayName: personField });
        }
        assignedToPeoplePicker = (assigned.currentValue);
        assignedToPeoplePicker = assignedToPeoplePicker.replace(/(;$)/g, "");
        $.each(assignedToPeoplePicker.split(';'), function () {
            tempName = $.trim(this);
            $().SPServices({
                operation: "GetUserProfileByName",
                async: false,
                AccountName: tempName,
                completefunc: function (xData, Status) {
                    officeName = getUPValue(xData.responseXML, "Office");
                    userName = getUPValue(xData.responseXML, "AccountName");
                }
            });
            if (currentUsersInfo != officeName || !officeName) {
                if (errorCounter < 1) {
                    msg += "\nField: " + personField;
                }
                if (!userName) {
                    msg += "\nCouldn't find " + tempName + " in SharePoint's User Profile system.";
                }
                else {
                    msg += '\nOffice was blank or not the same as your Office for user: ' + tempName + '; Office: ' + officeName;
                }
                errorCounter++;
            }
        });
    }
    if (errorCounter > 0) {
        if (confirm(msg)) {
            $('input[id$=btnOK]').attr('onClick', originalClick);
        } else {
            return false;
        }
    }
    else { return true; }
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
    //var currentUsersDepartment;
    //var currentUsersOffice;
    currentUsersValues = $().SPServices.SPGetCurrentUser({
        //webURL: "", 	// Added in 2013.01
        //fieldName: "Name",
        //fieldName: "Department",
        fieldName: "Office",
        //fieldNames: ["ID", "Last Name", "Department", "Office"],     	// Added in v0.7.2 to allow multiple columns
        debug: false
    });
    var url = window.location.toString().toLowerCase();
    // For Permission pages
    if (url.indexOf("aclinv.aspx") !== -1) {
        // SHAREPOINT IS VERSION 4 OR SP2010
        if (_spPageContextInfo.webTitle === undefined) {
            $('input[id$=chkSendEmail]').attr('checked', false);
            personField = "Select Users";
            spVer = "SP10";
            //get a list of handlers bound to the click event
            originalClick = $('input[id$=btnOK]').attr('onClick');
            $('input[id$=btnOK]').attr('onClick', 'return aclConfirm()');
        } else {
            // SHAREPOINT IS VERSION 15 OR SP2013
            $('input[id$=chkSendEmailv15]').attr('checked', false);
            personField = $('h3#divWelcomeMessage span[id$=Label_Aclinv_PageWelcomeMessage]').text();
            spVer = "SP13";
            //get a list of handlers bound to the click event
            originalClick = $('input[id$=btnShare]').attr('onclick');
            $('input[id$=btnShare]').attr('onclick', 'return aclConfirm()');
        }
    }
    // For List Item pages
    else {
        // SHAREPOINT IS VERSION 4 OR SP2010
        if (_spPageContextInfo.webTitle === undefined) {
            spVer = "SP10";
            $('.ms-usereditor').parent('span').parent('td').parent('tr').find('nobr').each(function () {
                personFieldArray.push($(this).text());

            });
        } else {
            // SHAREPOINT IS VERSION 15 OR SP2013
            spVer = "SP13";
            $('input[id$=PeoplePicker_HiddenInput]').parent('div').parent('div').parent('td').parent('tr').find('nobr').each(function () {
                personFieldArray.push($(this).text());
            });
        }
        //get a list of handlers bound to the click event
        originalClick = $('input[id$=SaveItem]').attr('onClick');
        $('input[id$=SaveItem]').attr('onClick', 'return listItemConfirm()');
    }
});