var McFly = require("mcfly");
var Flux = new McFly();
var _posts = [];
var Ajax = require("../mixins/ajax");

function addPosts(data) {
    _posts = data;
}

var ApiStore = Flux.createStore({
    getPosts: function () {
        return _posts;
    }
}, function (payload) {
    if (payload.actionType === "FETCH_POSTS") {
        Ajax.get({
            url: 'http://www.reddit.com/new/.json',
            failure: function (err) {
                console.log(err);
            },
            success: function (res) {
                let data=[];
                res.data.children.map(function(item){
                    data.push(item.data);
                });
                addPosts(data);
                ApiStore.emitChange();
            }
        });


    }
});
module.exports=ApiStore;