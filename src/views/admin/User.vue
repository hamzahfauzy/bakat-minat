<template>
    <v-container fluid>
        <v-row dense>
            <v-col>
                <span class="title">User</span>
            </v-col>
            <v-col :cols="$vuetify.breakpoint.mdAndUp ? '' : '12'">
                <v-text-field outlined label="Search" v-model="search" @input="handleSearch" dense clearable class="d-inline"/>
            </v-col>
            <v-col class="text-right">
                <v-btn-toggle v-model="tableMode" class="mx-3">
                    <v-btn  @click="tableMode = 0" small>
                        <v-icon>mdi-table</v-icon>
                    </v-btn>
                    <v-btn  @click="tableMode = 1" small>
                        <v-icon>mdi-grid</v-icon>
                    </v-btn>
                </v-btn-toggle>
                <v-btn depressed color="primary" @click="addDialog = true">
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-row dense v-if="loading">
            <v-col cols="12" v-if="tableMode == 0">
                <v-skeleton-loader type="table"></v-skeleton-loader>
            </v-col>
            <v-col sm="12" md="3" v-for="i in 8" :key="i" v-else>
                <v-skeleton-loader type="card"></v-skeleton-loader>
            </v-col>
        </v-row>
        <v-row dense v-else>
            <v-col cols="12" v-if="tableMode == 0">
                <v-data-table
                    :headers="headers"
                    :items="users"
                    :search="search"
                >
                    <template v-slot:item.actions="{ item }">
                        <v-btn icon @click="find(item._id)" color="orange" >
                            <v-icon small>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon @click="del(item._id)" color="red">
                            <v-icon small>mdi-delete </v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </v-col>

            <v-col v-else v-for="user in searches.length ? searches : users" :key="user._id" sm="12" md="3">
                <v-card outlined>
                    <v-list-item three-line dense>
                        <v-list-item-content>
                            <div class="overline mb-4 primary--text">{{user.converted_date}}</div>
                            <v-list-item-title class="headline mb-1">{{user.name}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-card-actions>
                        <v-btn text color="warning" @click="find(user._id)">
                            <v-icon left>mdi-pencil</v-icon>
                            {{$vuetify.breakpoint.mdAndUp ? 'Edit' : ''}}
                        </v-btn>
                        <v-btn text color="red" @click="del(user._id)">
                            <v-icon left>mdi-delete</v-icon>
                            {{$vuetify.breakpoint.mdAndUp ? 'Delete' : ''}}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- Add user Dialog -->
        <v-row dense>
            <v-dialog v-model="addDialog" max-width="600px">
                <v-form ref="form" @submit.prevent="add" id="form-add">
                    <v-card>
                        <v-card-title>Add User</v-card-title>
                        <v-card-text>
                            <v-text-field dense outlined v-model="name" label="Name" :rules="rules" :loading="loading"/>
                            <v-text-field dense outlined v-model="username" label="Username" :rules="rules" :loading="loading"/>
                            <v-text-field dense outlined v-model="password" label="Password" type="password" :rules="rules" :loading="loading"/>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text color="warning" @click="addDialog = false">Close</v-btn>
                            <v-btn text color="primary" form="form-add" type="submit" :loading="loading">Tambah</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-dialog>
        </v-row>

        <!-- Edit Dialog -->
        <v-row dense>
            <v-dialog v-model="editDialog" max-width="600px">
                <v-form ref="edit" @submit.prevent="edit" id="form-edit">
                    <v-card>
                        <v-card-title>Edit {{user.name}}</v-card-title>
                        <v-card-text>
                            <v-text-field dense outlined v-model="user.name" label="Name" :rules="rules" :loading="loading"/>
                            <v-text-field dense outlined v-model="user.username" label="Username" :rules="rules" :loading="loading"/>
                            <v-text-field dense outlined v-model="user.password" label="Password" type="password" :rules="rules" :loading="loading"/>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text color="warning" @click="editDialog = false">Close</v-btn>
                            <v-btn text color="primary" type="submit" form="form-edit" :loading="loading">Edit</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-dialog>
        </v-row>
    </v-container>
</template>

<script>
    import {mapActions,mapState,mapMutations} from 'vuex'
    import Swal from 'sweetalert2'


    export default {
        name:'User',
        data(){
            return{
                addDialog:false,
                editDialog:false,
                rules: [
                    v => !!v || 'This field is required',
                ],
                name:'',
                username:'',
                password:'',
                search:'',
                headers: [
                    {text: 'No', value: 'index',},
                    {text: 'Name', value: 'name',},
                    { text: 'Gender', value: 'metas.gender' },
                    { text: 'Actions', value: 'actions', sortable: false },
                ],
                tableMode:0
            }
        },
        created(){
            this.index()
        },
        computed:{
            ...mapState({
                users:state=>state.user.users.map((items,index)=>({...items,index:index+1})),
                loading:state=>state.loading,
                user:state=>state.user.user,
                searches:state=>state.user.searches
            })
        },
        methods:{
            ...mapActions('user',['index','new','view','update','delete']),
            ...mapMutations('user',['setUser','setUsers','setSearches']),
            add(){
                if(this.$refs.form.validate()){
                    this.new({name:this.name,username:this.username,password:this.password})
                    this.addDialog = false
                    Swal.fire(
                        'Success!',
                        'The item has been added',
                        'success'
                    ).then(res=>{
                        if(res.value){
                            this.index()
                        }
                    })
                }
            },
            find(id){
                this.view(id)
                this.editDialog = true
            },
            edit(){
                if(this.$refs.edit.validate()){
                    this.update(this.user)
                    this.editDialog = false
                    Swal.fire(
                        'Success!',
                        'The item has been updated',
                        'success'
                    ).then(res=>{
                        if(res.value){
                            this.index()
                        }
                    })
                }
            },
            del(id){    
               Swal.fire({
                    title:"Are you Sure to delete it?",
                    icon:'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete it!'
                }).then(res => {
                    if(res.value){
                        this.delete(id)
                        Swal.fire(
                            'Deleted!',
                            'The item has been deleted',
                            'success'
                        ).then(res=>{
                            if(res.value){
                                this.index()
                            }
                        })
                    }
                })
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
            handleSearch(){
                let searched = this.users.filter(user=>user.name.toLowerCase().includes(this.search.toLowerCase()))
                this.setSearches(searched)
            }
        },
        watch:{
            users: function() {
                this.users.forEach(val => {
                    val['converted_date'] = this.formatDate(val.create_date)
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>