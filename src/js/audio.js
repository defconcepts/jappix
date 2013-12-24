/*

Jappix - An open social platform
These are the audio JS scripts for Jappix

-------------------------------------------------

License: AGPL
Author: Valérian Saliou

*/

// Bundle
var Audio = (function () {

    /**
     * Alias of this
     * @private
     */
    var self = {};


	/**
     * Plays the given sound ID
     * @public
     * @param {number} num
     * @return {boolean}
     */
    self.play = function(num) {

        try {
            // Not supported!
            if((BrowserDetect.browser == 'Explorer') && (BrowserDetect.version < 9))
                return false;
            
            // If the sounds are enabled
            if(DataStore.getDB(DESKTOP_HASH, 'options', 'sounds') == '1') {
                // If the audio elements aren't yet in the DOM
                if(!Common.exists('#audio')) {
                    $('body').append(
                        '<div id="audio">' + 
                            '<audio id="new-chat" preload="auto">' + 
                                '<source src="./snd/new-chat.mp3" />' + 
                                '<source src="./snd/new-chat.oga" />' + 
                            '</audio>' + 
                            
                            '<audio id="receive-message" preload="auto">' + 
                                '<source src="./snd/receive-message.mp3" />' + 
                                '<source src="./snd/receive-message.oga" />' + 
                            '</audio>' + 
                            
                            '<audio id="notification" preload="auto">' + 
                                '<source src="./snd/notification.mp3" />' + 
                                '<source src="./snd/notification.oga" />' + 
                            '</audio>' + 
                        '</div>'
                    );
                }
                
                // We play the target sound
                var playThis = document.getElementById('audio').getElementsByTagName('audio')[num];

                // Fixes Chrome audio bug when Get API serves expired files (for development work purposes)
                if(window.chrome && Common.isDeveloper())
                    playThis.load();

                playThis.play();
            }
        } catch(e) {
            Console.error('Audio.play', e);
        } finally {
            return false;
        }

    };


    /**
     * Return class scope
     */
    return self;

})();