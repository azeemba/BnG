'use strict';
//assume Promise is already loaded

//once we get requirejs to work out, this should be pulled into
//something that is only required by something specific instead
//of everything

//this is a wrapper around chrome storage so we can swap out
//where we store stuff
var storage = {
    init: function() {
        this.d_graphs = {};
        this.d_initPromise = this.getValue("sessionKeys")
        .then(function(obj){
            if (!obj || !Array.isArray(obj)) {
                var key = "first";
                this.d_sessionKeys = [key];
                return this.setValue("sessionKeys", this.d_sessionKeys).then(
                    this.setValue.bind(this, key, {
                    nodes: [],
                    edges: []
                }));
            }
            else {
                this.d_sessionKeys = obj;
            }
        }.bind(this));
    },
    setValue: function(prop, value) {
        return new Promise(function(resolve, reject){
            if (!prop || !value) {
                reject(new Error("Invalid value: " + value + " " + prop));
                return;
            }
            var obj = {};
            obj[prop] = value;
            chrome.storage.local.set(obj, resolve);
        }).then(function(){
            console.log("just set ", prop, value);
        });
    },
    getAll: function() {
        return new Promise(function(resolve){
            chrome.storage.local.get(null, resolve);
        });
    },
    getValue: function(key) {
        return new Promise(function(resolve){
            if (key) {
                chrome.storage.local.get(key, function(obj){
                    if (!obj || !obj[key]){
                        resolve();
                    }
                    else {
                        resolve(obj[key]);
                    }
                });
            }
            else {
                resolve();
            }
        });
    },

    getValues: function(keys) {
        return new Promise(function(resolve, reject){
            if (Array.isArray(keys)) {
                reject(new Error("Keys must be an array"));
                return;
            }
            chrome.storage.local.get(keys, resolve);
        });
    },

    getGraph: function(key) {
        return this.d_initPromise.then(function(){
            console.log("in getGraph", this.d_sessionKeys);
            if (!key || this.d_sessionKeys.indexOf(key) === -1) {
                key = _.last(this.d_sessionKeys);
            }

            if (this.d_graphs[key]) {
                return this.d_graphs[key];
            }
            else {
                var graph = new sigma.classes.graph();
                //kinda ugly but I can't come up with a way to chain this out
                return storage.getValue(key).then(function(obj){
                    console.log("loading data from ", obj);
                    graph.read(obj);
                    this.d_graphs[key] = graph;
                    graph.graphId(key); //by setting up the id later, we avoid writes to storage
                    return graph;
                }.bind(this));
            }
        }.bind(this));
    },
};

//update the graph class to be connected to storage
// plus add additional functionalities
(function(){
    //load the data from storage on construction
    var updateStorage = function(){
        console.log(this.graphId());
        var key = this.graphId();
        if (key) {
            storage.setValue(key, {
                nodes: this.nodes(),
                edges: this.edges()
            });            
        }
    };
    //update storage on any of the following actions
    sigma.classes.graph.attach("addNode", "addNodeToStorage", updateStorage);
    sigma.classes.graph.attach("addEdge", "addEdgeToStorage", updateStorage);
    sigma.classes.graph.attach("dropNode", "dropNodeFromStorage", updateStorage);
    sigma.classes.graph.attach("dropEdge", "dropEdgeFromStorage", updateStorage);
    sigma.classes.graph.attach("clear", "clearFromStorage", updateStorage);

    sigma.classes.graph.addMethod("graphId", function(id){
        if (!id) {
            return this.d_id;
        }
        else {
            this.d_id = id;
        }
    });
}());

storage.init();