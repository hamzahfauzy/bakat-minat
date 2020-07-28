<template>
    <v-container fluid>
        <v-row dense>
            <v-col>
                <span class="title">Category</span>
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
                <v-btn depressed color="primary" @click="dialog = true">
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
                    :items="categories"
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

            <v-col sm="12" md="3" v-for="category in searches.length ? searches : categories" :key="category._id" v-else>
                <v-card outlined>
                    <v-list-item three-line dense>
                        <v-list-item-content>
                            <div class="overline mb-4 primary--text">{{category.converted_date}}</div>
                            <v-list-item-title class="headline mb-1">{{category.name}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-card-actions>
                        <v-btn text color="warning" @click="find(category._id)">
                            <v-icon left>mdi-pencil</v-icon>
                            {{$vuetify.breakpoint.mdAndUp ? 'Edit' : ''}}
                        </v-btn>
                        <v-btn text color="red" @click="del(category._id)">
                            <v-icon left>mdi-delete</v-icon>
                            {{$vuetify.breakpoint.mdAndUp ? 'Delete' : ''}}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <!-- Dialog -->
        <v-row dense>
            <v-dialog v-model="dialog" max-width="600px">
                <v-form ref="form" @submit.prevent="add" id="form-add">
                    <v-card>
                        <v-card-title>Add Category</v-card-title>
                        <v-card-text>
                            <v-alert type="success" v-if="res">{{res.message}}</v-alert>
                            <v-text-field dense outlined label="Name" v-model="name" :rules="rules"/>
                            <v-textarea v-model="description" label="Description" dense outlined :rules="rules"></v-textarea>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text color="warning" @click="closeDialog">Close</v-btn>
                            <v-btn text color="primary" type="submit" form="form-add" :loading="loading">Tambah</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-dialog>
        </v-row>
        <!-- Edit Dialog -->
        <v-row dense v-if="category">
            <v-dialog v-model="editDialog" max-width="600px">
                <v-form ref="edit" id="form-edit" @submit.prevent="edit">
                    <v-card>
                        <v-card-title>Edit {{category.name}}</v-card-title>
                        <v-card-text>
                            <v-alert type="success" v-if="res">{{res.message}}</v-alert>
                            <v-text-field dense outlined label="Name" v-model="category.name" :rules="rules"/>
                            <v-textarea v-model="category.description" label="Description" dense outlined :rules="rules"></v-textarea>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text color="warning" @click="closeDialog">Close</v-btn>
                            <v-btn text color="primary" type="submit" form="form-edit" :loading="loading">Edit</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-dialog>
        </v-row>
    </v-container>
</template>

<script>
    import {mapActions,mapState, mapMutations} from 'vuex'
    import Swal from 'sweetalert2'


    export default {
        name:'Category',
        data(){
            return{
                dialog:false,
                rules:[
                    v => !!v || 'This Field is Required'
                ],
                name:'',
                action:false,
                description:'',
                editDialog : false,
                search:'',
                headers: [
                    {text: 'No', value: 'index',},
                    {text: 'Name', value: 'name',},
                    {text: 'Description', value: 'description',},
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
                categories:state=>state.category.categories.map((items,index)=>({...items,index:index+1})),
                res:state=>state.category.res,
                loading:state=>state.loading,
                category:state=>state.category.category,
                searches:state=>state.category.searches
            }),
        },
        methods:{
            ...mapActions('category',['index','new','view','update','delete']),
            ...mapMutations('category',['setSearches']),
            closeDialog(){
                if(this.action)
                {
                    this.action = false
                    this.index()
                }
                this.dialog = false
                this.editDialog = false
            },
            add(){
                if(this.$refs.form.validate()){
                    this.new({name:this.name,description:this.description})
                    this.dialog = false
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
                    this.update(this.category)
                    this.action = true
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
                        ).then(()=>{
                            this.index()
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
                let searched = this.categories.filter(category=>category.name.toLowerCase().includes(this.search.toLowerCase()))
                this.setSearches(searched)
            }
        },
        watch:{
            categories: function() {
                this.categories.forEach(val => {
                    val['converted_date'] = this.formatDate(val.create_date)
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>