import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard'
import Login from '../views/Login'
import Sequence from '../views/Sequence'
import SequenceDemo from '../views/SequenceDemo'
import Start from '../views/Start'
import StartDemo from '../views/StartDemo'
import Finish from '../views/Finish'

// Admin

import ExamAdmin from '../views/admin/Exam'
import SchoolAdmin from '../views/admin/School'
import UserAdmin from '../views/admin/User'
import PostAdmin from '../views/admin/Post'
import PostCreate from '../views/admin/post/Create'
import PostUpdate from '../views/admin/post/Update'
import PostAnswer from '../views/admin/post/Answer'
import CategoryAdmin from '../views/admin/Category'
import GalleryAdmin from '../views/admin/Gallery'
import SequenceAdmin from '../views/admin/Sequence'


Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/login',
    name: 'login',
    component:Login
  },
  {
    path: '/sequence/',
    name: 'sequence',
    component:Sequence
  },
  {
    path: '/sequence-demo/',
    name: 'sequence-demo',
    component:SequenceDemo
  },
  {
    path: '/start',
    name: 'start',
    component:Start
  },
  {
    path: '/start-demo',
    name: 'start-demo',
    component:StartDemo
  },
  {
    path: '/finish',
    name: 'finish',
    component:Finish
  },

  // Admin

  {
    path: '/admin/exam',
    name: 'admin.exam',
    component: ExamAdmin
  },
  {
    path: '/admin/school',
    name: 'admin.school',
    component: SchoolAdmin
  },
  {
    path: '/admin/user',
    name: 'admin.user',
    component: UserAdmin
  },
  {
    path: '/admin/post',
    name: 'admin.post',
    component: PostAdmin
  },
  {
    path: '/admin/post/create',
    name: 'admin.post.create',
    component: PostCreate
  },
  {
    path: '/admin/post/:id',
    name: 'admin.post.update',
    component: PostUpdate
  },
  {
    path: '/admin/post/answer/:id',
    name: 'admin.post.answer',
    component: PostAnswer
  },
  {
    path: '/admin/category',
    name: 'admin.category',
    component: CategoryAdmin
  },
  {
    path: '/admin/gallery',
    name: 'admin.gallery',
    component: GalleryAdmin
  },
  {
    path: '/admin/sequence',
    name: 'admin.sequence',
    component: SequenceAdmin
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
