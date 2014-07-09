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
            chrome.storage.sync.set(obj, resolve);
        });
    },
    getAll: function() {
        return new Promise(function(resolve){
            chrome.storage.sync.get(null, resolve);
        });
    },
    getValue: function(key) {
        return new Promise(function(resolve, reject){
            if (key) {
                chrome.storage.sync.get(key, resolve);
            }
            else {
                reject(new Error("Invalid key"));
            }
        });
    },

    getValues: function(keys) {
        return new Promise(function(resolve, reject){
            if (Array.isArray(keys)) {
                reject(new Error("Keys must be an array"));
                return;
            }
            chrome.storage.sync.get(keys, resolve);
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
                graph.graphId(key);
                //kinda ugly but I can't come up with a way to chain this out
                return storage.getValue(graph.graphId()).then(function(obj){
                    graph.read(obj);
                    this.d_graphs[key] = graph;
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
        storage.setValue(this.graphId(), {
            nodes: this.nodes(),
            edges: this.edges()
        });
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