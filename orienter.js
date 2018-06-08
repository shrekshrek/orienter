/*!
 * GIT: https://github.com/shrekshrek/orienter
 **/

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.Orienter = factory());
}(this, (function () {
    'use strict';

    var Orienter = function () {
        this.initialize.apply(this, arguments);
    };

    Orienter.prototype = {
        lon: 0,
        lat: 0,
        direction: 0,
        fix: 0,
        os: '',
        initialize: function (config) {
            var _config = config || {};

            this.onOrient = _config.onOrient || null;
            this.onChange = _config.onChange || null;

            this._orient = this._orient.bind(this);
            this._change = this._change.bind(this);

            this.lon = 0;
            this.lat = 0;
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

            if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
                this.os = 'ios';
            } else {
                this.os = (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux')) ? 'android' : '';
            }
        },

        init: function () {
            window.addEventListener('deviceorientation', this._orient, false);
            window.addEventListener('orientationchange', this._change, false);
        },

        destroy: function () {
            window.removeEventListener('deviceorientation', this._orient, false);
            window.removeEventListener('orientationchange', this._change, false);
        },

        _change: function (event) {
            this.direction = window.orientation;

            if (this.onChange) this.onChange(this.direction);
        },

        changeDirectionTo: function (n) {
            this.direction = n;
        },

        _orient: function (event) {
            switch (this.os) {
                case 'ios':
                    switch (this.direction) {
                        case 0:
                            this.lon = event.alpha + event.gamma;
                            if (event.beta > 0) this.lat = event.beta - 90;
                            break;
                        case 90:
                            if (event.gamma < 0) {
                                this.lon = event.alpha - 90;
                            } else {
                                this.lon = event.alpha - 270;
                            }
                            if (event.gamma > 0) {
                                this.lat = 90 - event.gamma;
                            } else {
                                this.lat = -90 - event.gamma;
                            }
                            break;
                        case -90:
                            if (event.gamma < 0) {
                                this.lon = event.alpha - 90;
                            } else {
                                this.lon = event.alpha - 270;
                            }
                            if (event.gamma < 0) {
                                this.lat = 90 + event.gamma;
                            } else {
                                this.lat = -90 + event.gamma;
                            }
                            break;
                    }
                    break;
                case 'android':
                    switch (this.direction) {
                        case 0:
                            this.lon = event.alpha + event.gamma + 30;
                            if (event.gamma > 90) {
                                this.lat = 90 - event.beta;
                            } else {
                                this.lat = event.beta - 90;
                            }
                            break;
                        case 90:
                            this.lon = event.alpha - 230;
                            if (event.gamma > 0) {
                                this.lat = 270 - event.gamma;
                            } else {
                                this.lat = -90 - event.gamma;
                            }
                            break;
                        case -90:
                            this.lon = event.alpha - 180;
                            this.lat = -90 + event.gamma;
                            break;
                    }
                    break;
            }

            this.lon += this.fix;
            this.lon %= 360;
            if (this.lon < 0) this.lon += 360;

            this.lon = Math.round(this.lon);
            this.lat = Math.round(this.lat);

            if (this.onOrient) this.onOrient({
                a: Math.round(event.alpha),
                b: Math.round(event.beta),
                g: Math.round(event.gamma),
                lon: this.lon,
                lat: this.lat,
                dir: this.direction
            });
        }

    };

    return Orienter;

})));
