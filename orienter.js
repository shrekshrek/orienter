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
            root.Orienter = factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        factory(root, exports);
    } else {
        root.Orienter = factory(root, {});
    }

}(function (root, Orienter) {
    function extend(obj, obj2) {
        for (var prop in obj2) {
            obj[prop] = obj2[prop];
        }
    }

    Orienter = function () {
        this.initialize.apply(this, arguments);
    };

    extend(Orienter.prototype, {
        //VERT: 'vertical',//垂直
        //HORI: 'horizontal',//水平
        hori: 0,
        vert: 0,
        direction: 0,
        fix: 0,
        os: '',
        initialize: function () {
            this.hori = 0;
            this.vert = 0;
            this.direction = window.orientation || 0;

            switch (this.direction) {
                case 0:
                    this.fix = 0;
                    break;
                case 90:
                    this.fix = -270;
                    break;
                case -90:
                    this.fix = -90;
                    break;
            }

            this.os = (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) ? 'ios' : '';
            this.os = (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux')) ? 'android' : '';

        },

        init: function () {
            this._orient = this.orientHandler.bind(this);
            window.addEventListener('deviceorientation', this._orient, false);

            this._change = this.changeHandler.bind(this);
            window.addEventListener('orientationchange', this._change, false);
        },

        destroy: function () {
            window.removeEventListener('deviceorientation', this._orient, false);
            window.removeEventListener('orientationchange', this._change, false);
        },

        changeHandler: function (event) {
            this.direction = window.orientation;
            //alert(window.orientation);
        },

        orientHandler: function (event) {
            switch (this.os) {
                case 'ios':
                    switch (this.direction) {
                        case 0:
                            this.hori = event.alpha + event.gamma;
                            if (event.beta > 0) this.vert = event.beta - 90;
                            break;
                        case 90:
                            if (event.gamma < 0) {
                                this.hori = event.alpha - 90;
                            } else {
                                this.hori = event.alpha - 270;
                            }
                            if (event.gamma > 0) {
                                this.vert = 90 - event.gamma;
                            } else {
                                this.vert = -90 - event.gamma;
                            }
                            break;
                        case -90:
                            if (event.gamma < 0) {
                                this.hori = event.alpha - 90;
                            } else {
                                this.hori = event.alpha - 270;
                            }
                            if (event.gamma < 0) {
                                this.vert = 90 + event.gamma;
                            } else {
                                this.vert = -90 + event.gamma;
                            }
                            break;
                    }
                    break;
                case 'android':
                    //switch (this.direction) {
                    //    case 0:
                    //        this.hori = event.alpha + event.gamma;
                    //        if (event.gamma > 90){
                    //            this.vert = 90 - event.beta;
                    //        }else{
                    //            this.vert = event.beta - 90;
                    //        }
                    //        break;
                    //    case 90:
                    //        if (event.gamma < 0) {
                    //            this.hori = event.alpha - 90;
                    //        } else {
                    //            this.hori = event.alpha - 270;
                    //        }
                    //        if (event.gamma > 0) {
                    //            this.vert = 270 - event.gamma;
                    //        } else {
                    //            this.vert = -90 - event.gamma;
                    //        }
                    //        break;
                    //    case -90:
                    //        if (event.gamma < 90) {
                    //            this.hori = event.alpha - 90;
                    //        } else {
                    //            this.hori = event.alpha - 270;
                    //        }
                    //        this.vert = -90 + event.gamma;
                    //        break;
                    //}
                    //break;
            }

            this.hori += this.fix;
            this.hori %= 360;
            if (this.hori < 0) this.hori += 360;

            //this.hori = Math.floor(this.hori * 100) / 100;
            //this.vert = Math.floor(this.vert * 100) / 100;
            this.hori = Math.floor(this.hori);
            this.vert = Math.floor(this.vert);

            if (this.handler) this.handler.apply(this, [{v: this.vert, h: this.hori, d: this.direction}]);
        }

    });

    return Orienter;
}));
