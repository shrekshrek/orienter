/*!
 * VERSION: 0.1.0
 * DATE: 2015-12-20
 * GIT:https://github.com/shrekshrek/orienter
 *
 * @author: Shrek.wang, shrekshrek@gmail.com
 **/

(function (factory) {

    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function (exports) {
            root.Motioner = factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        factory(root, exports);
    } else {
        root.Motioner = factory(root, {});
    }

}(function (root, Motioner) {
    function extend(obj, obj2) {
        for (var prop in obj2) {
            obj[prop] = obj2[prop];
        }
    }

    Motioner = function () {
        this.initialize.apply(this, arguments);
    };

    extend(Motioner.prototype, {
        os: '',
        initialize: function () {

            if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
                this.os = 'ios';
            }else{
                this.os = (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux')) ? 'android' : '';
            }
        },

        init: function () {
            this._motion = this.motionHandler.bind(this);
            window.addEventListener('devicemotion', this._motion, false);

        },

        destroy: function () {
            window.removeEventListener('devicemotion', this._motion, false);
        },

        motionHandler: function (event) {
            switch (this.os) {
                case 'ios':

                    break;
                case 'android':

                    break;
            }

            if (this.handler) this.handler.apply(this, event);

            console.log(event);
        }

    });

    return Motioner;
}));
