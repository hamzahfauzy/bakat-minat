import axios from 'axios'
import router from '../router'

const state = {
    res:null,
    sequences: localStorage.getItem("sequences") ? JSON.parse(localStorage.getItem("sequences")) : []
}

const getters = {}

const mutations = {
    setSequences(state,sequences){
        state.sequences = sequences
    }
}

const actions = {
    async startExam({rootState,commit},data){
        rootState.loading = true
        let res = await axios.post(process.env.VUE_APP_URL+'participant/exam/start',data,{
                headers:{
                    'Authorization':rootState.userLoggedIn.token,
                    'Content-Type':'application/json'
                }
            })
        await localStorage.setItem("sequences",JSON.stringify(res.data.data))
        await commit('setSequences',JSON.parse(localStorage.getItem("sequences")))
        rootState.loading = false
        await router.push({name:'sequence'})
    },
    sendUserSequence({rootState},data){
        rootState.loading = true
        return new Promise((resolve) => {
            axios
            .post(process.env.VUE_APP_URL+'participant/exam/send-user-sequence',data,{
                headers:{
                    'Authorization':rootState.userLoggedIn.token,
                    'Content-Type':'application/json'
                }
            })
            .then(()=>{
                rootState.loading = false
                resolve();
            })
        })
        
    },
    finishExam({rootState},data){
        rootState.loading = true
        axios
            .post(process.env.VUE_APP_URL+'participant/exam/finish',data,{
                headers:{
                    'Authorization':rootState.userLoggedIn.token,
                }
            })
            .then(()=>{
                rootState.loading = false
                localStorage.removeItem("sequences")
                localStorage.removeItem("seqActive")
                router.push({name:'finish'})
            })
    },
}

export default{
    state,getters,mutations,actions,namespaced : true
}