<template>
    <div class="login">
        <div class="login__container">
            <div class="login__header">
                <div class="login__logo">
                    <img src="@/assets/img/Godrej_Logo.svg.png" alt="Café logo">
                </div>
                <div class="login__title"> {{ $t('login.title') }}</div>
            </div>

            <div class="login__body">
                <div class="login__form">
                    <div class="login__input login__input--user">
                        <input type="text" :placeholder="$t('login.placeholder.user')" v-model="username">
                    </div>
                    <div class="login__input login__input--password">
                        <input type="password" :placeholder="$t('login.placeholder.password')" v-model="password">
                    </div>
                </div>

                <div class="login__button" @click="login">
                    <router-link :to="redirect">
                        <button> {{ $t('login.button') }} </button>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Enum from "@/utils/enum";
export default {
    name: "InventoryForm",
    props: {
        modelValue: { // dùng để đóng mở form
            type: Boolean,
            default: false
        },
    },
/*     components: {
        UploadImage
    }, */

    data() {
        return {
            username: "",
            password: "",
            redirect: '/tong-quan',
        };
    },
    computed: {
     
    },

    watch: {
    
    },
    methods: {
        ...mapGetters(["getInventoryId"]),

        async login() {
            let me = this;
            const response = await me.$api.authen.login(me.username, me.password);
            if (response && response.status == Enum.MISA_CODE.SUCCESS) {  
                this.$store.commit('setPermission', response.data);              
                me.redirect = "/nhan-vien";
            }
        },
    },

    beforeUnmount() {
        this.formMode = Enum.FORM_MODE.NULL // reset lại formMode
        this.attemptSubmit = false; // reset lại attemptSubmit
        this.$emit("update:modelValue", false); // reset lại modelValue
    },
};
</script>

<style lang="scss" scoped>
    .login {
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 100vh;
        position: fixed;
        background-image: url(@/assets/img/login-bg.png);
        background-size: cover;
        z-index: 9999;

        display: flex;
        justify-content: center;

        font-family: -apple-system,system-ui,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;
        line-height: 1.5;
        color: #212b35;
    }

    .login__container {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 565px;

    }

    .login__header {
        margin-top: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 1rem;
        width: 100%;
    }

    .login__logo {
        height: 76px;
        width: 100%;
    }
    .login__logo img {
        width: 100%;
        height: 100%;
    }

    .login__title {
        margin-top: 40px;
        font-size: 30px;
        line-height: 30px;
        font-weight: 500;
    }

    .login__body {
        margin-top: 1.5rem;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .login__form {
        width: 100%;
    }

    .login__input {
        width: 100%;
        margin-bottom: 1rem;
    }

    .login__input input {
        background-image: none!important;
        border: thin solid #d3d5d7;
        border-radius: 40px;
        height: 48px;
        line-height: 1;
        color: #363636;
        font-size: .895rem;
        padding: 0 20px;
        width: 100%;
        outline: none;
        font-weight: 400;
    }

    .login__input input:hover {
        border: $bg-green-hover 1px solid;
    }

    .login__input input:active,
    .login__input input:focus{
        border: $bg-green-active 1px solid;
    }

    .login__input--user {

    }

    .login__input--password {

    }

    .login__button {
        width: 279px;
        height: 70px;
        margin: 50px 0;
        display: flex;
        justify-content: center;
    }

    .login__button a {
        width: 100%;
    }

    .login__button button {
        width: 100%;
        border: none;
        border-radius: 50px;
        line-height: 64px;
        font-weight: 500;
        white-space: nowrap;
        font-size: 24px;
        transition: all .5s ease;
        background-color:  $bg-green;
        color: white;
        cursor: pointer;
        box-sizing: border-box;
    }

    .login__button button:hover {
        background-color:  $bg-green-hover;
    }

    .login__button button:active {
        background-color:  $bg-green-active;
    }
</style>