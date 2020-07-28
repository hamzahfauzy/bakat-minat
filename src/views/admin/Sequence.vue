<template>
    <v-container fluid>
        <v-row dense>
            <v-col>
                <span class="title">Sequence</span>
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
                    :items="sequences"
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

            <v-col v-else v-for="sequence in searches.length ? searches : sequences" :key="sequence._id" sm="12" md="3">
                <v-card outlined>
                    <v-list-item three-line dense>
                        <v-list-item-content>
                            <div class="overline mb-4 primary--text">{{sequence.converted_date}}</div>
                            <v-list-item-title class="headline mb-1">{{sequence.title}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-card-actions>
                        <v-btn text color="warning" @click="find(sequence._id)">
                            <v-icon left>mdi-pencil</v-icon>
                            {{$vuetify.breakpoint.mdAndUp ? 'Edit' : ''}}
                        </v-btn>
                        <v-btn text color="red" @click="del(sequence._id)">
                            <v-icon left>mdi-delete</v-icon>
                            {{$vuetify.breakpoint.mdAndUp ? 'Delete' : ''}}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- Add sequence Dialog -->
        <v-row dense>
            <v-dialog v-model="addDialog" max-width="600px">
                <v-form ref="form" @submit.prevent="add" id="form-add">
                    <v-card>
                        <v-card-title>Add Sequence</v-card-title>
                        <v-card-text>
                            <v-text-field dense outlined v-model="sequence_field.title" label="Title" :rules="rules"/>
                            <v-select dense outlined v-model="sequence_field.content_type" label="Content Type" @change="loadContent(false)" :items="content_type"></v-select>
                            <v-select dense outlined  v-model="sequence_field.contents" label="Content" :items="contents" item-value="value" item-text="text"></v-select>
                            <v-text-field dense outlined v-model="sequence_field.order" label="Order"/>
                            <v-text-field dense outlined  v-model="sequence_field.countdown" label="Timeout"/>
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
                        <v-card-title>Edit {{sequence.name}}</v-card-title>
                        <v-card-text>
                            <v-text-field dense outlined v-model="sequence.title" label="Title" :rules="rules"/> 
                            <v-select dense outlined v-model="sequence.content_type" label="Content Type" @change="loadContent(1)" :items="content_type"></v-select>
                            <v-select dense outlined  v-model="sequence.contents" label="Content" :items="contents" item-value="value" item-text="text"></v-select>
                            <v-text-field dense outlined v-model="sequence.order" label="Order"/>
                            <v-text-field dense outlined  v-model="sequence.countdown" label="Timeout"/>
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
        name:'sequence',
        data(){
            return{
                addDialog:false,
                editDialog:false,
                rules: [
                    v => !!v || 'This field is required',
                ],
                sequence_field:{
                    title:'',
                    content_type:'',
                    contents:'',
                    order:0,
                    countdown:20,
                },
                content_type:[
                    {value:'post',text:'Instruction'},
                    {value:'question',text:'Question'},
                    {value:'category',text:'Category'},
                ],
                search:'',
                headers: [
                    {text: 'No', value: 'index',},
                    {text: 'Title', value: 'title',},
                    {text: 'Order', value: 'order',},
                    {text: 'Countdown', value: 'countdown',},
                    { text: 'Actions', value: 'actions', sortable: false },
                ],
                tableMode:0,
                contents:[]
            }
        },
        created(){
            this.getCategories()
            this.get()
            this.index()
        },
        computed:{
            ...mapState({
                sequences:state=>state.sequence.sequences.map((items,index)=>({...items,index:index+1})),
                loading:state=>state.loading,
                sequence:state=>state.sequence.sequence,
                searches:state=>state.sequence.searches,
                categories:state=>state.category.categories,
                posts:state=>state.post.posts,
            })
        },
        methods:{
            ...mapActions('sequence',['index','new','view','update','delete']),
            ...mapMutations('sequence',['setsequence','setsequences','setSearches']),
            ...mapActions('category',{
                getCategories:'index'
            }),
            ...mapActions('post',['get']),
            add(){
                if(this.$refs.form.validate()){
                    console.log(this.sequence_field)
                    this.new(this.sequence_field)
                    this.addDialog = false
                    Swal.fire(
                        'Success!',
                        'The item has been added',
                        'success'
                    ).then(res => {
                        if(res.value){
                            this.index()
                        }
                    })
                }
            },
            loadContent(edit = false){
                var content_type = edit ? this.sequence.content_type : this.sequence_field.content_type
                if(content_type == 'category'){
                    this.contents = this.categories.map(val => {
                        return {text:val.name,value:val._id}
                    })
                }
                else
                {
                    var ctype = edit ? this.sequence.content_type : this.sequence_field.content_type 
                    var posts = this.posts.filter(val => val.type_as === ctype)
                    this.contents = posts.map(val => {
                        return {text:val.title,value:val._id}
                    })
                }
            },
            find(id){
                this.view(id)
                this.editDialog = true
            },
            edit(){
                if(this.$refs.edit.validate()){
                    this.update(this.sequence)
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
                let searched = this.sequences.filter(sequence=>sequence.name.toLowerCase().includes(this.search.toLowerCase()))
                this.setSearches(searched)
            }
        },
        watch:{
            sequences: function() {
                this.sequences.forEach(val => {
                    val['converted_date'] = this.formatDate(val.create_date)
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>