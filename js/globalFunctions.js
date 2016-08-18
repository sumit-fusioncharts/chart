//globalFunctions.js
"use strict";
//setting up some window functions
var scrX = 0,
    scrY = 0,
    bool = true;
window.onscroll = function(e) {
    scrY = window.scrollY;
    scrX = window.scrollX;
};
window.onresize = function() {
    location.reload();
};
//Helper functions for older browsers 
if (!Object.hasOwnProperty('create')) {
    Object.create = function(parentObj) {
        function tmpObj() {}
        tmpObj.prototype = parentObj;
        return new tmpObj();
    };
}
if (!Object.hasOwnProperty('defineProperties')) {
    Object.defineProperties = function(obj, props) {
        for (var prop in props) {
            Object.defineProperty(obj, prop, props[prop]);
        }
    };
}

function lookup(_val, _arr) {
    var len = _arr.length,
        bool = false;
    if (len < 1) {
        bool = false;
    } else {
        while (len--) {
            if (_arr[len] == _val) {
                bool = true;
                break;
            }
        }
    }
    return bool;
}

var max2min = function(a, b) {
        return b - a;
    },
    min2max = function(a, b) {
        return a - b;
    },
    sum = function(a, b) {
        return a + b;
    };
function OnAddEventListener(x,leftx,element) {
    var customEventHairLine = new CustomEvent('mouseonelement', { detail:{x:x,top:leftx}});
    element.dispatchEvent(customEventHairLine);
}
