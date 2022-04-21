import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import plugins from "./plugins";
import service from "./service";

const app = createApp(App);
for (let key in plugins) {
  const pluginContent = plugins[key];
  const { component, comp, filter, directive } = pluginContent;
  if (component || comp) {
    let comps = component || comp
    for (let key in comps) {
      app.component(key, comps[key]);
    }
  }
  if (filter) {
    for (let key in filter) {
      app.config.globalProperties[`$${key}`] = filter[key];
    }
  }
  if (directive) {
    for (let key in directive) {
      app.use(directive[key]);
    }
  }
}
app.config.globalProperties.$api = service;
app.use(router).mount("#app");
// createApp(App).mount('#app')
