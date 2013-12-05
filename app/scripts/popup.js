'use strict';

function doThisClickHandler(event)
{
    if (isRunningSession())
    {
        //so we stop it
        endSession();
    }
    else
    {
        var name = $("#sessionName").val();
        startSession(name);
    }
    window.close();
}

$(document).ready(function(){
    //lets check if the button should be start or stop
    if (isRunningSession())
    {
        $("#doThis").val("Stop");
        $("#sessionName").val(getSessionName());
        $("#sessionName").attr("disabled", true);
    }
    else
    {   
        var numSessions = sessionCount();
        if (isNaN(numSessions))
            numSessions = 1;
        else
            numSessions++;
        $("#sessionName").val("session" + numSessions);
        $("#sessionName").select();
    }
    $("#doThis").click(doThisClickHandler);
});