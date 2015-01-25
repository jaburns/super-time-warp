/**
 * Created by jordan on 25/01/15.
 */

var soundManager = (function () {
    var instance;

    function initSoundManager(numChannels) {
        this.channel_max = numChannels || 10;
        this.audioChannels = [];
        this.nextChannel = 0;

        this.loopChannel = new Audio();
        this.loopChannel.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);

        for (var a = 0; a < this.channel_max; a++) {
            this.audioChannels[a] = new Audio();					// expected end time for this channel
        }
    }

    function createInstance() {
        var _soundManager = new initSoundManager();

        _soundManager.playSound = function(sound) {
            this.nextChannel++;
            if(this.nextChannel == this.channel_max)
            {
                this.nextChannel = 0;
            }

            this.audioChannels[this.nextChannel].src = document.getElementById(sound).src;
            this.audioChannels[this.nextChannel].load();
            this.audioChannels[this.nextChannel].play();
        };

        _soundManager.stopAllSounds = function() {
            for (var a = 0; a < this.audioChannels.length;a++) {
                this.audioChannels[a].stop();
            }
        };

        _soundManager.playLoop = function(sound) {
            this.loopChannel.src = document.getElementById(sound).src;
            this.loopChannel.load();
            this.loopChannel.volume = 0.45;
            this.loopChannel.play();
        };

        return _soundManager;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();