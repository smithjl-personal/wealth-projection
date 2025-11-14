import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import FontAwesomeIcon from "./fontawesome-icons";

createApp(App).component("FontAwesomeIcon", FontAwesomeIcon).mount("#app");
