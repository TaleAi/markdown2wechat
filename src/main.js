import Vue from "vue";
import ElementUI from "element-ui";
import App from "./App.vue";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/monokai.css";
import "codemirror/theme/base16-light.css";
import "codemirror/theme/base16-dark.css";
import "codemirror/theme/duotone-light.css";
import "codemirror/theme/duotone-dark.css";
import "codemirror/theme/ambiance-mobile.css";
import "./assets/css/app.css";

Vue.config.productionTip = false;
Vue.prototype.$ELEMENT = {
  size: "small",
  zIndex: 3000
};
Vue.use(ElementUI);

new Vue({
  render: (h) => h(App),
}).$mount("#app");