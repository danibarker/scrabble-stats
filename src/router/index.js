import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Team from '../views/Team.vue';
import Compare from '../views/Compare.vue'
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/team',
    name: 'Team',
    component: Team,
  },
  {
    path: '/compare',
    name: 'Compare',
    component: Compare,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
