/*

Jappix - An open social platform
These are the anonymous mode JS script for Jappix

-------------------------------------------------

License: AGPL
Authors: Valérian Saliou, LinkMauve

*/

// Bundle
var Anonymous = (function () {

    /**
     * Alias of this
     * @private
     */
    var self = {};


	/**
     * Connected to an anonymous session
     * @public
     * @return {undefined}
     */
    self.connected = function() {

        try {
            Console.info('Jappix (anonymous) is now connected.');
            
            // Connected marker
            CONNECTED = true;
            CURRENT_SESSION = true;
            RECONNECT_TRY = 0;
            RECONNECT_TIMER = 0;
            
            // Not resumed?
            if(!RESUME) {
                // Create the app
                createTalkPage();
                
                // Send our first presence
                firstPresence('');
                
                // Set last activity stamp
                LAST_ACTIVITY = DateUtils.getTimeStamp();
                
                // Create the new groupchat
                Chat.checkCreate(Common.generateXID(ANONYMOUS_ROOM, 'groupchat'), 'groupchat');
                
                // Remove some nasty elements for the anonymous mode
                $('.tools-mucadmin, .tools-add').remove();
            }
            
            // Resumed
            else {
                // Send again our presence
                presenceSend();
                
                // Change the title
                updateTitle();
            }
            
            // Remove the waiting icon
            removeGeneralWait();
        } catch(e) {
            Console.error('Anonymous.connected', e);
        }

    };


    /**
     * Disconnected from an anonymous session
     * @public
     * @return {undefined}
     */
    self.disconnected = function() {

        try {
            Console.info('Jappix (anonymous) is now disconnected.');
        } catch(e) {
            Console.error('Anonymous.disconnected', e);
        }

    };


    /**
     * Logins to a anonymous account
     * @public
     * @param {string} server
     * @return {boolean}
     */
    self.login = function(server) {

        try {
            // We define the http binding parameters
            oArgs = new Object();
            
            if(HOST_BOSH_MAIN)
                oArgs.httpbase = HOST_BOSH_MAIN;
            else
                oArgs.httpbase = HOST_BOSH;

            // Check BOSH origin
            BOSH_SAME_ORIGIN = isSameOrigin(oArgs.httpbase);
            
            // We create the new http-binding connection
            con = new JSJaCHttpBindingConnection(oArgs);
            
            // And we handle everything that happen
            con.registerHandler('message', handleMessage);
            con.registerHandler('presence', handlePresence);
            con.registerHandler('iq', handleIQ);
            con.registerHandler('onconnect', self.connected);
            con.registerHandler('onerror', handleError);
            con.registerHandler('ondisconnect', self.disconnected);
            
            // We set the anonymous connection parameters
            oArgs = new Object();
            oArgs.domain = server;
            oArgs.authtype = 'saslanon';
            oArgs.resource = JAPPIX_RESOURCE + ' Anonymous (' + (new Date()).getTime() + ')';
            oArgs.secure = true;
            oArgs.xmllang = XML_LANG;
            
            // We connect !
            con.connect(oArgs);
            
            // Change the page title
            pageTitle('wait');
        } catch(e) {
            Console.error('Anonymous.login', e);

            // Reset Jappix
            self.disconnected();
            
            // Open an unknown error
            Board.openThisError(2);
        } finally {
            return false;
        }

    };


    /**
     * Plugin launcher
     * @public
     * @return {undefined}
     */
    self.launch = function() {

        try {
            $(document).ready(function() {
                Console.info('Anonymous mode detected, connecting...');
                
                // We add the login wait div
                showGeneralWait();
                
                // Get the vars
                if(LINK_VARS['r'])
                    ANONYMOUS_ROOM = LINK_VARS['r'];
                if(LINK_VARS['n'])
                    ANONYMOUS_NICK = LINK_VARS['n'];
                
                // Fire the login action
                self.login(HOST_ANONYMOUS);
            });
        } catch(e) {
            Console.error('Anonymous.launch', e);
        }

    };


    /**
     * Return class scope
     */
    return self;

})();

Anonymous.launch();