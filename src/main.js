import Vue from 'vue';
import App from './App';
import applicationConfig from './util/config';
import store from './store';

(function () {
    function getContainer () {
        const container = document.createElement('div');
        document.body.appendChild(container);

        return container;
    }

    function loadStyles () {
        if (process.env.NODE_ENV === 'production') {
            return new Promise(function (resolve, reject) {
                resolve();
            });
        }

        return Promise.resolve();
    }

    function init () {
        new Vue({
            el: getContainer(),
            render: h => h(App),
            store
        });
    }

    loadStyles().then(init);
})();
