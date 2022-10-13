// ==UserScript==
// @name         Reorder Knockout Subforums
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Reorder the Knockout subforums on the main page.
// @author       ColonelCorn: https://knockout.chat/user/1300
// @match        https://knockout.chat/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

//Change this to suit your preferences.
const desired_order = ["General Discussion", "Fast Threads",
                     "Videos", "Film, Television and Music",
                     "Gaming", "Gaming Megathreads",
                     "DIY and Hobbies", "Creativity and Art",
                     "Developers", "Hardware & Software",
                     "News", "Politics",
                     "The Progress Report", "Meta",
                     "Source", "Facepunch Games"
                    ];

//You shouldn't have to change anything below here.
(function() {
    'use strict';

    //Wait for elements to load before trying to do anything.
    waitForKeyElements("p.sf-name:first", reorderSubforums);
})();


function reorderSubforums()
{
    //alert("Starting.");
    console.log("Knockout Subforum Reorder Script - Starting");
    sf_loop:
    for (var i=0; i<desired_order.length-1; i++)    //No need to iterate over the last one, since all the ones before it will be in the desired order.
    {
        //These need to be inside the loop, otherwise the indexes don't update after rearranging each subforum.
        var $subforums_containers = $("div > div:has(a.title-stats:has(p.sf-name))");
        var $subforum_titles      = $("div > div > a.title-stats > p.sf-name");    //Just go down to the elements that contain the subforum titles, then work backwards to the larger subforum element later. Trying to peek down at the grandchild properties while still selecting the grandparent is a pain in the ass.

        //alert("Number of subforum elements found: " + $subforum_titles.length);

        // alert("Attempting to reorder " + desired_order[i] + " to desired position: " + i + ".");
        // alert("Found match: \"" + $subforum_titles.filter(
        //     function() {
        //         //Whitepace isn't a regular space, so replace it with one.
        //         var p_text = $(this).text().trim().replace(/\u2006/g, " ");
        //         alert("Searching for text: \"" + desired_order[i] +
        //             "\"\nText content of current element: \"" + p_text +
        //             "\"\nMatches?: " + (p_text === desired_order[i])
        //         );
        //         return p_text === desired_order[i]
        //     }).first().html() + "\""
        //      );

        //alert("Searching for: " + desired_order[i]);
        //var $curr_subforum = $subforums_containers.filter(":has(a.title-stats:has(p.sf-name:contains(" + desired_order[i]+ ")))");    //Doesn't work consistently because some subforum titles use a regular spaces, and some use \u2006. We'll get the subforum titles separately and work backwards from there to determine if we've got the right one.
        var $curr_subforum =  $subforum_titles.filter(
            function() {
                //Whitepace isn't a regular space, so replace it with one.
                var p_text = $(this).text().trim().replace(/\u2006/g, " ");
                // alert("Text content of current element: " + p_text +
                //       "\nSearching for text: " + desired_order[i]);
                return p_text === desired_order[i]
            }).first().parent().parent();    //Working backwards from the subforum title element.
        if ($curr_subforum.length == 0)
        {
            console.log("Knockout Subforum Reorder Script - Couldn't find: " + desired_order[i]);
            alert("Knockout Subforum Reorder Script Error: Couldn't find: " + desired_order[i] + ". Stopping. Index = " + i);
            break sf_loop;
        }
        else if ($curr_subforum.length > 1)
        {
            console.log("Knockout Subforum Reorder Script - Too many matches for: " + desired_order[i]);
            alert("Knockout Subforum Reorder Script Error: Too many matches for: " + desired_order[i] + ". Stopping. Index = " + i);
            break sf_loop;
        }
        // alert("Found and now attmpting move: " + desired_order[i]);
        $curr_subforum.insertBefore($subforums_containers[i]);
        // alert("Current index (i): " + i +
        //       "\nMove successful: " + desired_order[i]);
        //break;    //DEBUG
    }
    //alert("Subforums reordered.");
    console.log("Knockout Subforum Reorder Script - Finished");
}
