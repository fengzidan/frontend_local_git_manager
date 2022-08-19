import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
// import client from '@/views/client/index.vue'
// import manager from '@/views/manager/index.vue'
import app from "@/App.vue";
import test from "@/views/test.vue";
import main from "@/views/Main.vue";
import DataList from "@/views/DataList.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "app",
    component: () => import("../App.vue"),
    children: [
      {
        path: "",
        name: "main",
        component: () => import("../views/Main.vue"),
        children: [
          {
            path: "",
            name: "DataList",
            component: () => import("../views/DataList.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/test",
    name: "test",
    component: () => import("@/views/test.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(
    process.env.NODE_ENV === "production" ? "/" : "/remote-manager"
  ),
  routes,
});

export default router;
