<!--  -->
<template>
    <div class="box">
        <iframe name="my-iframe" id="my-iframe" :src="itemUrl" frameborder="0" width="100%"
                height="100%"></iframe>
    </div>
</template>

<script>
    export default {
        props: ['itemUrl'],
        data() {
            return {
                dom: '',
            }
        },
        created() {

        },
        mounted() {
        },
        methods: {
        }
    }
</script>
<style scoped>
    .box {
        width: 100%;
        height: 100%;
    }
</style>
