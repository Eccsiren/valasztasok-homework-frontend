import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import AboutView from "./views/AboutView.vue";
import AccountView from "./views/AccountView.vue";
import QTableCandidateView from "./views/QTableCandidateView.vue";
import QTableTaxBandView from "./views/QTableTaxBandView.vue";
import StartPageView from "./views/StartPageView.vue";
import EditCandidateView from "./views/EditCandidateView.vue";
import NewCandidateView from "./views/NewCandidateView.vue";
import EditTaxBandView from "./views/EditTaxBandView.vue";
import NewTaxBandView from "./views/NewTaxBandView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/report",
    name: "startPage",
    component: StartPageView,
  },
  {
    path: "/account",
    name: "account",
    component: AccountView,
  },
  {
    path: "/editCandidate",
    name: "editCandidate",
    component: EditCandidateView,
  },
  {
    path: "/newCandidate",
    name: "newCandidate",
    component: NewCandidateView,
  },
  {
    path: "/qtableCandidate",
    name: "qtableCandidate",
    component: QTableCandidateView,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  next();
});
export default router;
