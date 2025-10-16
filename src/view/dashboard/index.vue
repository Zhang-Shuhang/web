<template>
    <div class="big">
        <div class="inner">
            <p>热烈欢迎!!</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Dashboard',
    }
</script>

<style lang="scss" scoped>
    .big {
        width: 100%;
        height: calc(100vh - 220px);
        background-color: #F0F2F5;
        position: relative;
    }

    .inner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
