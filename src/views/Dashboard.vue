<template>
    <v-container fluid :class="user && user.isAdmin ? '' : 'fill-height'">
        <template v-if="user && user.isAdmin">
          <v-row dense>
            <v-col>
                <h2 class="title">Dashboard</h2>
            </v-col>
          </v-row>
          <v-row v-if="loading">
              <v-col v-for="i in 12" cols="6" md="3" :key="i">
                  <v-skeleton-loader type="image"></v-skeleton-loader>
              </v-col>
          </v-row>
          
            <v-row dense v-else>
                <v-col cols="6" md="4">
                    <v-card outlined>
                        <v-list-item three-line>
                            <v-list-item-content>
                                <span class="overline">Siswa</span>
                                <v-list-item-title class="headline primary--text">{{users.length}}</v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-avatar tile size="50">
                                <v-icon size="50" color="primary">mdi-account-group</v-icon>
                            </v-list-item-avatar>
                        </v-list-item>
                    </v-card>
                </v-col>
                <v-col cols="6" md="4">
                    <v-card outlined>
                        <v-list-item three-line>
                            <v-list-item-content>
                                <span class="overline">Kategori</span>
                                <v-list-item-title class="headline primary--text">{{categories.length}}</v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-avatar tile size="50">
                                <v-icon size="50" color="primary">mdi-clipboard-check</v-icon>
                            </v-list-item-avatar>
                        </v-list-item>
                    </v-card>
                </v-col>
                <v-col cols="6" md="4">
                    <v-card outlined>
                        <v-list-item three-line>
                            <v-list-item-content>
                                <span class="overline">Galeri</span>
                                <v-list-item-title class="headline primary--text">{{galleries.length}}</v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-avatar tile size="50">
                                <v-icon size="50" color="primary">mdi-view-dashboard</v-icon>
                            </v-list-item-avatar>
                        </v-list-item>
                    </v-card>
                </v-col>
                <v-col cols="6">
                    <v-card outlined>
                        <v-list-item three-line>
                            <v-list-item-content>
                                <span class="overline">Soal</span>
                                <v-list-item-title class="headline primary--text">{{questions.length}}</v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-avatar tile size="50">
                                <v-icon size="50" color="primary">mdi-book</v-icon>
                            </v-list-item-avatar>
                        </v-list-item>
                    </v-card>
                </v-col>
                <v-col cols="6">
                    <v-card outlined>
                        <v-list-item three-line>
                            <v-list-item-content>
                                <span class="overline">Instruksi</span>
                                <v-list-item-title class="headline primary--text">{{instructions.length}}</v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-avatar tile size="50">
                                <v-icon size="50" color="primary">mdi-book</v-icon>
                            </v-list-item-avatar>
                        </v-list-item>
                    </v-card>
                </v-col>
            </v-row> 
          
        </template>
        <template v-else>
          <v-row dense justify="center" align="center" v-if="load">
            {{load}}
          </v-row>
          <v-row dense justify="center" align="center" v-if="detail">
              <v-col class="text-center" sm="12" md="4">
                  <v-card outlined class="py-5">
                      <v-card-text>
                        <v-avatar color="grey" size="200">
                            <v-img src="https://w5insight.com/wp-content/uploads/2014/07/placeholder-user-400x400.png"/>
                        </v-avatar>
                        <div class="my-5">
                            <h2 class="title">{{detail.name}}</h2>
                            <span class="subtitle-1">NIS : {{detail.username}}</span>
                        </div>
                        <!-- <v-btn depressed color="red" class="white--text" block target="_blank" href="https://www.youtube.com/watch?v=rIprh0-NS-k">Tutorial</v-btn>
                        <p></p>
                        <v-btn depressed color="primary" block target="_blank" href="http://exam.tmcindonesia.com">Uji Coba</v-btn>
                        <p></p> -->
                        <v-btn  v-if="false" depressed color="success" block @click="setSequencesBeforStart">Lanjutkan</v-btn>
                        <v-btn text v-else-if="detail.metas.exam_finished" color="success" block>Kamu Telah Menyelesaikan Tes</v-btn>
                        <v-btn depressed color="success" block to="/start" v-else-if="isStart">Mulai Tes</v-btn>
                        <v-btn text color="warning" block v-else>Tidak ada tes</v-btn>
                        <p></p>
                        <v-btn depressed color="primary" block target="_blank" href="http://exam.tmcindonesia.com/">Demo</v-btn>
                        <p></p>
                        <v-btn depressed color="primary" block target="_blank" href="http://video.tmcindonesia.com/">Lihat video tutorial dan demo</v-btn>
                        <p></p>
                        <!-- <p>Hasil bisa Anda download pada tombol di bawah ini pada tanggal {{tanggal}}</p>
                        <v-btn v-if="downloadHasil && detail.metas.exam_finished" depressed color="primary" target="_blank" :href="downloadURL+detail._id" block>Download Hasil</v-btn>
                        <v-btn v-else depressed color="primary" block>Download Hasil</v-btn> -->
                        <v-btn text color="red" @click="setLogout" block>Keluar</v-btn>
                      </v-card-text>
                  </v-card>
              </v-col>
          </v-row>
        </template>
    </v-container>
</template>

<script>
import {mapState,mapMutations,mapActions} from 'vuex'

export default {
  name: 'Dashboard',
  data(){
      return{
          seqActive : 0,
          sequences : {},
          metas : {},
          downloadURL:'',
          load : 'Loading...',
      }
  },
  async created(){
    localStorage.removeItem("sequences")
    localStorage.removeItem("seqActive")
    await this.userDetail()
    if(this.user.isAdmin){
        this.getGalleries()
        this.getUsers()
        this.getCategories()
        this.getPosts()
    }
    this.getTanggal()
    this.seqActive = localStorage.getItem("seqActive") ? localStorage.getItem("seqActive") : 0
    this.downloadURL = process.env.VUE_APP_URL + 'exams/download/'
  },
  computed:{
    ...mapState({
        loading: state => state.loading,
        user : state => state.userLoggedIn,
        detail : state => state.auth.detail,
        otherData : state => state.auth.otherData,
        users : state => state.user.users,
        tanggal : state => state.exam.hasil.tanggal,
        downloadHasil : state => state.exam.hasil.enable,
        categories : state => state.category.categories,
        galleries : state => state.gallery.galleries,
        questions : state=>state.post.posts.filter(post=>post.type_as == 'question').map((items,index)=>({...items,index:index+1})),
        instructions : state=>state.post.posts.filter(post=>post.type_as == 'post').map((items,index)=>({...items,index:index+1}))
    }),
    isStart(){
        if(new Date(this.otherData.start_time) < new Date() && new Date(this.otherData.end_time) >  new Date()){
            return true
        }else{
            return false
        }
    }
  },
  methods:{
    ...mapMutations(['setLoading']),  
    ...mapActions(['setLogout','userDetail']),
    ...mapMutations('participant',['setSequences']),
    ...mapActions('user',{
        getUsers : 'index'    
    }),
    ...mapActions('category',{
        getCategories : 'index'    
    }),
    ...mapActions('gallery',{
        getGalleries : 'index'
    }),
    ...mapActions('exam',{
        getExams : 'index',
        getTanggal: 'getTanggal'
    }),
    ...mapActions('post',{
        getPosts : 'get',
    }),
    setSequencesBeforStart(){
        localStorage.setItem('sequences',JSON.stringify(this.sequences))
        localStorage.setItem('seqActive',typeof this.metas.seqActive === 'undefined' ? 0 : this.metas.seqActive)
        this.setSequences(this.sequences)
        this.$router.push({name:'sequence'})
    },
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            hours = d.getHours(),
            minutes = d.getMinutes(),
            seconds = d.getSeconds();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        var _time = [hours, minutes, seconds].join(':')
        var _date = [day, month, year].join('-');

        return [_date,_time].join(' ')
    },
  },
  watch:{
        users: function() {
            this.users.forEach(val => {
                val['converted_date'] = this.formatDate(val.create_date)
            })
        },
        exams: function() {
            this.exams.forEach(val => {
                val['converted_date'] = this.formatDate(val.create_date)
            })
        },
        categories: function() {
            this.categories.forEach(val => {
                val['converted_date'] = this.formatDate(val.create_date)
            })
        },
        galleries: function() {
            this.galleries.forEach(val => {
                val['converted_date'] = this.formatDate(val.create_date)
            })
        },
        loading:function(newValue){
            this.setLoading(newValue)
        },
        detail(detail){
            if(detail) this.load = ""
            this.metas = detail.metas
            this.sequences = typeof detail.metas.sequences === 'undefined' ? {} : detail.metas.sequences
        }
    },
}
</script>
