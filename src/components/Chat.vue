<template>
    <div class="ec-chat">
        <div class="ec-chat__header">

        </div>
        <div class="ec-chat__body">

        </div>
        <div class="ec-chat__footer">

        </div>
    </div>
</template>

<script>
    export default {
        name: 'Chat'
    }
</script>

<style scoped lang="scss">
    .ec-chat {
        height: 100%;
        flex: 1;
        align-self: auto;

        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-content: stretch;
        align-items: stretch;

        &__header {
            flex: 0 0 auto;
            align-self: auto;
            height: 52px;
            border-bottom: 1px solid #D8D8D8;
        }

        &__body {
            flex: 1;
        }

        &__footer {
            flex: 0 0 auto;
            align-self: auto;
            height: 52px;
            border-top: 1px solid #D8D8D8;
        }
    }
</style>
