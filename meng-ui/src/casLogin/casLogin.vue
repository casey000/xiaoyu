<template>
	<div class="login-bg">
        <div class="all-div">
            <div></div>
            <div>
                <h1>TDMS</h1>
                <h4>Technical Document Management System</h4>
                <div>
                    CAS登录中...
                </div>
            </div>

        </div>
	</div>
</template>

<script>
    import CAS from '../common/js/casLogin'
	export default {
        created(){
            CAS.callback = async function () {
                window.location.href = "/module/index.html";
            }.bind(this);

            return CAS.casLogin((index) => this.showPage = index);
        }
	};
</script>

<style scoped="scoped" type="text/css">

	.login-bg {
		width:100%;
		height:100%;
		background: url(/img/timg.png) no-repeat;
		background-size: 100% 100%;
        position: relative;
	}

    .all-div{
        width: 900px;
        height: 310px;
        position: absolute;
        left: 0;
        right: 0;
        margin: 120px auto;
        display: flex;
    }

    .all-div>:first-child{
        width: 550px;
        height: 310px;
        background: url(/img/timg.jpg) no-repeat center center;
        background-size: cover;
    }

    .all-div>:last-child{
        width: 350px;
        height: 310px;
        background: #fff;
        text-align: center;
        margin: 0 auto;
        z-index: 100;
    }

    .all-div>:last-child>h1{
        font-size: 60px;
        letter-spacing: 2px;
        color: #2d3c5d;
        margin-top: 30px;
        margin-bottom: 0;
        font-weight: 800;
    }

    .all-div>:last-child>h4{
        color: #cccccc;
        font-size: 14px;
        font-weight: 600;
        margin-top: 5px;
        margin-bottom: 10px;
    }

    .all-div>:last-child>div{
        line-height: 96px;
        color: #cccccc;
        font-size: 24px;
        font-weight: 600;
        margin-top: 5px;
        margin-bottom: 10px;
    }

</style>
