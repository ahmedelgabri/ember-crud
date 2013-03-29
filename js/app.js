// first things first: let's create our app
window.App = Ember.Application.create({
    LOG_TRANSITIONS: true
});


// ----------------- \
// ROUTING
// ----------------- \

// this is where we declare our routes
App.Router.map(function(){
    // this route will be our list of all users
    this.resource('users', function(){
        // this one is nested and is dynamic, we need it to see one user at a time with its id
        this.resource('user', { path:'/:user_id' }, function(){
            // and another nested one for editing the current user
            this.route('edit');
        });
        // and finally the create route nested in users
        this.route('create');
    });
});

// no need of a home page so we redirect "/" to "/users"
App.IndexRoute = Ember.Route.extend({
    redirect: function(){
        this.transitionTo('users');
    }
});

// we can customize what's happening when accessing the user route
// here we simply retreive datas from our model and assign it to the usersRoute model
// http://emberjs.com/guides/routing/specifying-a-routes-model/
App.UsersRoute = Ember.Route.extend({
    model: function(){
        return App.User.find();
    }
});

// when accessing this route we want to make sure 
// that the editMode property remains false 
App.UserRoute = Ember.Route.extend({
    // this route model is auto generated internally by Ember
    // because we following its naming conventions 
    /*model: function(params) { 
        return App.User.find(params.post_id);
    },*/
    
    // and here we use the setupController hook to set a userController property
    setupController: function(controller){
        //controller.set('editMode', false);
    }
});

// we also want to manually set user.editMode when accessing the userEditRoute (its child route) 
// so we can use the controllerFor method to access the parent controller 
// http://emberjs.com/guides/routing/setting-up-a-controller/ 
App.UserEditRoute = Ember.Route.extend({
    model: function() {
        return this.modelFor('user');
    }, 
    setupController: function(controller){
        this.controllerFor('user').set('editMode', true);
    }, 
    // fix when trying to 
    deactivate: function(){ 
        this.controllerFor('user').set('editMode', false);
    }
});


// ----------------- \
// CONTROLLERS
// ----------------- \

// the usersRoute grabs a LIST of users so we need an ArrayController 
// because ArrayController are meant to manage multiple models 
// http://emberjs.com/guides/controllers/#toc_representing-models 
App.UsersController = Ember.ArrayController.extend();

// our nested user route will render only a single user at a time 
// so in this case we'll use an ObjectController
App.UserController = Ember.ObjectController.extend({
    // the property editMode is also used in the user template 
    // we will use it to manage css transitions when entering and exiting the edit route
    editMode: false, 
    
    edit: function(){
        this.set('editMode', true);
        this.transitionToRoute('user.edit');
    }
});

App.UserEditController = Ember.ObjectController.extend({
    // we want this controller to inherit from its parent controller 
    // in this case it's userController 
    // http://emberjs.com/guides/controllers/dependencies-between-controllers/ 
    needs: ['user'], 
    
    //user: null, 
    //userBinding: 'controllers.user.model',
    
    // in the template we used a {{action closeEditing}} tag wich will trigger this method on click 
    closeEditing: function(){
        // sets the parent controller editMode to false
        this.get('controllers.user').set('editMode', false); 
        // and then goes back to the previous route 
        this.transitionToRoute('user'); 
    }
});


// ----------------- \
// VIEWS
// ----------------- \


App.UserView = Ember.View.extend({
    didInsertElement: function(){
        //$elem = this.$();
        
        /* rotate things with mousemove for debug mode */
        /*$(window).on('mousedown mouseup', function(e){
            var $this = $(this); 
            var oldX = e.pageX; 
            var oldY = e.pageY; 

            if (e.type == 'mousedown') {
                //console.group();
                //  console.log('$this > ',$this);
                //  console.log('oldX > ',oldX);
                //  console.log('oldY > ',oldY);
                //console.groupEnd();

                $elem.addClass('unselectable');

                $this.on('mousemove', function(e){
                    var currX = e.pageX;
                    var currY = e.pageY;
                    //console.log(currX +' < x | y > '+currY);
                    var newX = currY-oldY;
                    //var newY = currX-oldX;
                    //console.log('%d - %d = %d', currY, oldY, currY-oldY);
                    //console.log('newX > ',newX);
                    //console.log('newY > ',newY);

                    $elem.css({
                        '-webkit-transform':'rotateX('+newX+'deg)',
                        '-moz-transform':'rotateX('+newX+'deg)',
                        'transform':'rotateX('+newX+'deg)'
                    });
                });

            } else {
                // console.log('mouseup');
                $this.off('mousemove');
                $elem.removeClass('unselectable');
            }

            e.stopPropagation();
        });*/
    }
});
