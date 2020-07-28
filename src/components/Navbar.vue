<template>
    <nav>
        <v-navigation-drawer v-if="user && user.isAdmin" permanent floating app color="primary" :expand-on-hover="$vuetify.breakpoint.mdAndUp" :mini-variant.sync="mini" dark>
            <v-list dense nav>
                <v-list-item class="hidden-md-and-up blue darken-4" @click="mini = !mini">
                    <v-list-item-icon>
                        <v-icon>{{mini ? 'mdi-menu' : 'mdi-menu-open' }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Close</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item two-line class="px-0">
                    <v-list-item-avatar color="grey">
                        <img v-if="user" src="https://w5insight.com/wp-content/uploads/2014/07/placeholder-user-400x400.png">
                    </v-list-item-avatar>

                    <v-list-item-content>
                    <v-list-item-title>{{user ? user.name : 'user'}}</v-list-item-title>
                    <v-list-item-subtitle>{{user ? user.name : 'jobless' }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>
                
                <v-list-item 
                    v-for="item in items"
                    :key="item.title"
                    link :to="item.route" exact>
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-spacer></v-spacer>

            </v-list>

            <template v-slot:append>
                <v-list dense nav>
                    <div v-if="user">
                        <v-list-item link @click="setLogout">
                            <v-list-item-icon>
                                <v-icon>mdi-logout</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Logout</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </div>
                </v-list>
            </template>
        </v-navigation-drawer>
    </nav>
</template>

<script>
    import {mapActions,mapState} from 'vuex'

    export default {
        name:'Navbar',
        data () {
            return {
                mini:true,
                items: [
                    { title: 'Dashboard', icon: 'mdi-view-dashboard' , route:'/'},
                    { title: 'Daftar Sekolah', icon: 'mdi-school' , route:'/admin/school'},
                    { title: 'Daftar Siswa', icon: 'mdi-account-group' , route:'/admin/user'},
                    { title: 'Daftar Instruksi', icon: 'mdi-fast-forward' , route:'/admin/post?instruction=true'},
                    { title: 'Daftar Galeri', icon: 'mdi-view-dashboard' , route:'/admin/gallery'},
                    { title: 'Daftar Soal', icon: 'mdi-book' , route:'/admin/post'},
                    { title: 'Sequence', icon: 'mdi-fast-forward' , route:'/admin/sequence'},
                    { title: 'Daftar Tes', icon: 'mdi-library' , route:'/admin/exam'},
                    { title: 'Kategori', icon: 'mdi-clipboard-check',route:'/admin/category' },
                ],
            }
        },
        created(){
            if(!this.user && this.$router.currentRoute.path != '/login'){
                this.$router.push({name:'login'})
            }
            document.title = 'Minat Bakat'
        },
        computed: {
            ...mapState({
                user : state => state.userLoggedIn
            }),
        },
        methods: {
            ...mapActions(['setLogout']),
        }
    }
</script>

<style lang="scss" scoped>

</style>