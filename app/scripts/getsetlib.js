//global objects in local storage
// {
//  status: {
//      sessionName : "session name",
//  },
//  graphs: {
//      sessionName : graphObj
//  }
//  sessionCount
// }
// graphObj:
// {
//  host : "",
//  startTime : timeObj,
//  nodes : [
//      {
//          id : index,
//          data : {
//              links: ,
//              title: ,
//              visited: ,
//              visited_order: ,
//          }, 
//          neighbors : [nodes_id]
//      }
//  ]
// }

if (!localStorage.graphs)
{
    localStorage.graphs = {};
}

function isRunningSession()
{
    return (localStorage.status !== undefined);
}

// startSession sets up the session
    // name is the name of the session
    // host should be undefined, if unrestricted by host
    // Returns: 
    // If the name already exists, the session is restarted
    // If the name doesn't, a new session is started
function startSession(name, host)
{
    if (graphExists(name))
    {
        setSessionName(name);
    }
    else
    {
        incrementSessionCount();
        setSessionName(name);
        setHost(host);
        setCurrentTime();
    }
}

function endSession()
{
    localStorage.removeItem("status");
}

function sessionCount()
{
    return localStorage.getItem("sessionCount");
}

function incrementSessionCount()
{
    if (isNaN(sessionCount()))
    {
        localStorage.sessionCount = 1;
    }
    else
    {
        localStorage.sessionCount++;
    }
}

function graphExists(name)
{
    return (localStorage.graphs[name] !== undefined);
}

function setSessionName(name)
{
    localStorage.status = {
        sessionName : name
    };
}

function setHost(host)
{
    var sessionGraph = localStorage.graphs[getSessionName()];
    if (sessionGraph)
        sessionGraph.host = host;
}

function setCurrentTime()
{
    var sessionGraph = localStorage.graphs[getSessionName()];
    if (sessionGraph)
        sessionGraph.startTime = new Date();
}

function getSessionName()
{
    return localStorage.status.sessionName;
}

function addNode()
{

}