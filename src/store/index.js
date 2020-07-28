import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import category from './category'
import exam from './exam'
import post from './post'
import user from './user'
import school from './school'
import participant from './participant'
import sequence from './sequence'
import gallery from './gallery'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    userLoggedIn: JSON.parse(localStorage.getItem("userLoggedIn"))
  },
  mutations:{
    setLoading(state,condition){
      state.loading = condition
    }
  },
  modules: { auth , category , exam , post , user , participant , gallery , school , sequence }
})
