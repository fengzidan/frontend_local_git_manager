import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
// import client from '@/views/client/index.vue'
// import manager from '@/views/manager/index.vue'
import test from "@/views/test.vue";
import main from "@/views/Main.vue";
import DataList from "@/views/DataList.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "main",
    component: main,
    children: [
      {
        path: "",
        name: "DataList",
        component: DataList,
      },
    ],
  },
  {
    path: "/test",
    name: "test",
    component: test,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
