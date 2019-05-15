import Vue from 'vue';
import config from '../config/config.json';

const applicationConfig = {
    ...config,
    ...(window.ElixirChat || {}),
};


Vue.mixin({
    data () {
        return {
            config: applicationConfig
        };
    },
});

export default applicationConfig;
