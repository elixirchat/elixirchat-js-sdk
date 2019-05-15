<template>
    <div class="ec-container">
        <div class="ec-container__flex">
            <div class="ec-container__chat">
                <div class="ec-chat-container" v-if="active">
                    <Chat />
                </div>
            </div>
            <div class="ec-container__button">
                <button type="button" @click="toggle"
                        class="ec-chat-button" :class="{'ec-chat-button_active': active}"></button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    import Chat from './components/Chat';

    export default {
        name: 'App',
        components: {
            Chat
        },
        data() {
            return {};
        },
        computed: {
            ...mapGetters('chat', {
                active: 'active'
            })
        },
        methods: {
            ...mapActions('chat', ['toggle']),
        }
    };
</script>

<style scoped lang="scss">
    .ec-container {
        position: fixed;
        bottom: 0;
        right: 20px;
        height: 100%;

        &__flex {
            height: 100%;
            flex: 1;
            align-self: auto;

            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            justify-content: flex-start;
            align-content: stretch;
            align-items: stretch;
        }

        &__chat {
            flex: 1;
            padding-top: 20px;
            padding-bottom: 10px;
            display: flex;
        }

        &__button {
            flex: 0 0 auto;
            align-self: auto;
            height: 94px;
            text-align: right;
        }
    }

    .ec-chat-button {
        border: 0 none;
        padding: 0;
        outline: 0 none;
        width: 74px;
        height: 74px;
        border-radius: 37px;
        background-color: #FF006E;
        background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzciIGhlaWdodD0iMzUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyLjc0IDM0LjkwOGMtLjI4NCAwLS41NjgtLjExLS44LS4zM2ExLjIwMyAxLjIwMyAwIDAgMS0uMDE3LTEuNjQ3bDcuOTk2LTguMzg4aDEyLjM4NWMuODg5IDAgMS42MTctLjc1IDEuNjE3LTEuNjY2VjQuMDE0YzAtLjg4LS42OTMtMS41OTMtMS41NDYtMS41OTNINC4xMjJjLTEuMDMgMC0xLjg0OC44Ni0xLjg0OCAxLjkwNHYxOC42NjJjMCAuODQyLjY3NiAxLjUzOCAxLjQ5MyAxLjUzOEg5LjY1Yy42MjIgMCAxLjEzNy41MyAxLjEzNyAxLjE3MiAwIC42NC0uNTE1IDEuMTcyLTEuMTM3IDEuMTcySDMuNzY3QzEuNjg4IDI2Ljg2OSAwIDI1LjEyOSAwIDIyLjk4N1Y0LjMyNUMwIDEuOTgxIDEuODQ4LjA3NyA0LjEyMi4wNzdoMjguMjM2YzIuMTE0IDAgMy44MiAxLjc1OCAzLjgyIDMuOTM3djE4Ljg0NGMwIDIuMTk4LTEuNzQxIDMuOTkzLTMuODc0IDMuOTkzSDIwLjg4bC03LjMzOSA3LjY5MWExLjA5MyAxLjA5MyAwIDAgMS0uOC4zNjZ6IiBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L3N2Zz4=);
        background-position: center center;
        background-repeat: no-repeat;
        box-shadow: none;

        &:active, &:focus {
            box-shadow: none;
            border: 0 none;
        }

        &_active {
            background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEgLTEpIiBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxyZWN0IHRyYW5zZm9ybT0icm90YXRlKDQ1IDEyIDEyKSIgeD0iMTEiIHk9Ii0zIiB3aWR0aD0iMiIgaGVpZ2h0PSIzMCIgcng9IjEiLz48cmVjdCB0cmFuc2Zvcm09InNjYWxlKDEgLTEpIHJvdGF0ZSg0NSA0MC45NyAwKSIgeD0iMTEiIHk9Ii0zIiB3aWR0aD0iMiIgaGVpZ2h0PSIzMCIgcng9IjEiLz48L2c+PC9zdmc+);
        }
    }

    .ec-chat-container {
        align-self: flex-end;
        position: relative;
        height: 100%;
        max-height: 600px;
        width: 380px;
        background: #FFFFFF;
        box-shadow: 0 0 60px 0 rgba(0,0,0,0.15);
        border-radius: 8px;

        text-align: left;
    }
</style>
