import { createApp } from "vue";
import App from "@/App.vue";
import routes from "@/router";
import components from "@/components";
import "@/assets/scss/main.scss";
import tcdn_dva from "@/api";
import store from "@/store/store";
import FlagIcon from "vue-flag-icon";
import i18n from "@/locales/i18n";
import outsideClickDirective from "./directives/outsideClick";
import outsideClickTeleport from "./directives/outsideClickTeleport";
const app = createApp(App); // Khởi tạo app

app.use(routes); // Sử dụng router

app.config.globalProperties.$api = tcdn_dva; // Đăng ký api

Object.keys(components).forEach((key) => {
  app.component(key, components[key]); // Đăng ký các component
});

app.directive("click-outside", outsideClickDirective); // Đăng ký directive
app.directive("click-outside-teleport", outsideClickTeleport); // Đăng ký directive

app.use(store); // Sử dụng store
app.use(FlagIcon); // Sử dụng flag-icon
app.use(i18n); // Sử dụng i18n
app.mount("#app"); // Mount app vào DOM
