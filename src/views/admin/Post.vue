<template>
    <v-container fluid>
        <v-row dense>
            <v-col>
                <span class="title">{{isInstruction ? 'Instruksi' : 'Soal'}}</span>
            </v-col>
            <v-col :cols="$vuetify.breakpoint.mdAndUp ? '' : '12'">
                <v-text-field outlined label="Search" v-model="search" @input="handleSearch" dense clearable class="d-inline"/>
            </v-col>
            <v-col class="text-right">
                <v-btn-toggle v-model="tableMode">
                    <v-btn  @click="tableMode = 0" small>
                        <v-icon>mdi-table</v-icon>
                    </v-btn>
                    <v-btn  @click="tableMode = 1" small>
                        <v-icon>mdi-grid</v-icon>
                    </v-btn>
                </v-btn-toggle>
                <v-btn v-if="!isInstruction" depressed color="success" @click="openFileDialog" class="mx-md-3">
                    <v-icon>mdi-plus</v-icon> Import
                </v-btn>
                <v-file-input style="display:none;" id="filetoupload" @change="uploadFile"></v-file-input>
                <v-btn depressed color="primary" :to="`create${isInstruction ? '?instruction=true' : ''}`" append>
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-row dense v-if="loading">
            <v-col cols="12" v-if="tableMode == 0">
                <v-skeleton-loader type="table"></v-skeleton-loader>
            </v-col>
            <v-col v-for="i in 6" :key="i" cols="12" md="4" v-else>
                <v-skeleton-loader type="card"></v-skeleton-loader>
            </v-col>
        </v-row>
        <v-row dense v-else>
            <v-col cols="12" v-if="tableMode == 0">
                <v-data-table
                    :headers="headers"
                    :items="isInstruction ? posts : questions"
                    :search="search"
                >
                    <template v-slot:item.description="{item}">
                        <span v-html="item.description"></span>
                    </template>
                    <template v-slot:item.answers="{item}">
                        <v-chip-group v-if="item.type_as == 'question'">
                            <v-chip v-for="answer in item.answers" :key="answer._id" :class="answer.type_as == 'correct answer' ? 'success' : ''" disable small>
                                <span v-html="answer.description.replace(/<\/?[^>]+(>|$)/g, '')"></span>
                                <v-btn icon x-small :to="`${answer._id}`" append class="ml-4">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn icon x-small @click="del(answer._id)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </v-chip>
                            <v-chip color="primary" :to="`answer/${item._id}`" append small>
                                <v-icon>mdi-plus</v-icon>
                            </v-chip>
                        </v-chip-group>
                        <span v-else>This isn't a question</span>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-btn icon :to="`${item._id}${isInstruction ? '?instruction=true' : ''}`" append color="orange" >
                            <v-icon small>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon @click="del(item._id)" color="red">
                            <v-icon small>mdi-delete </v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </v-col>

            <v-col v-else v-for="post in searches.length ? searches : isInstruction ? posts : questions" :key="post._id" cols="12" md="4">
                <v-card outlined class="fill-height">
                    <v-list-item three-line dense>
                        <v-list-item-content>
                            <div class="overline mb-4 primary--text" v-if="post.category">{{post.category.name}}</div>
                            <v-list-item-title class="headline mb-1">{{post.title}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-card-text v-html="post.description"></v-card-text>
                    <v-card-text v-if="post.type_as == 'question'">
                        <v-divider class="mb-4"></v-divider>
                        <div class="subheading">Answers <v-btn icon :to="`answer/${post._id}`" append><v-icon>mdi-plus</v-icon></v-btn> </div>
                        <v-chip-group>
                            <v-chip v-for="answer in post.answers" :key="answer._id" :class="answer.type_as == 'correct answer' ? 'success' : ''" disable>
                                <span v-html="answer.description.replace(/<\/?[^>]+(>|$)/g, '')"></span>
                                <v-btn icon x-small :to="`${answer._id}`" append class="ml-4">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn icon x-small @click="del(answer._id)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </v-chip>
                        </v-chip-group>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn text color="warning" :to="`${post._id}${isInstruction ? '?instruction=true' : ''}`" append>
                            <v-icon left>mdi-pencil</v-icon>
                            {{$vuetify.breakpoint.mdAndUp ? 'Edit' : ''}}
                        </v-btn>
                        <v-btn text color="red" @click="del(post._id)">
                            <v-icon left>mdi-delete</v-icon>
                            {{$vuetify.breakpoint.mdAndUp ? 'Delete' : ''}}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import {mapActions,mapState,mapMutations} from 'vuex'
    import Swal from 'sweetalert2'

    export default {
        name:'Post',
        data(){
            return{
                search:'',
                headers: [
                    {text: 'No', value: 'index'},
                    {text: 'Description', value: 'description'},
                    { text: 'Answers', value: 'answers' },
                    { text: 'Actions', value: 'actions', sortable: false },
                ],
                tableMode:0
            }
        },
        created(){
            this.get()
            this.index()
        },
        computed:{
            ...mapState({
                questions:state=>state.post.posts.filter(post=>post.type_as == 'question').map((items,index)=>({...items,index:index+1})),
                posts:state=>state.post.posts.filter(post=>post.type_as == 'post').map((items,index)=>({...items,index:index+1})),
                categories:state=>state.category.categories,
                post:state=>state.post.post,
                loading:state=>state.loading,
                res:state=>state.post.res,
                searches:state=>state.post.searches
            }),
            isInstruction(){
                if(this.$route.query.instruction){
                    return true
                }else{
                    return false
                }
            }
        },
        methods:{
            ...mapActions('post',['get','delete','import']),
            ...mapActions('category',['index']),
            ...mapMutations('post',['setSearches']),
            openFileDialog(){
                var filetoupload = document.getElementById('filetoupload')
                filetoupload.click()
            },
            uploadFile(){
                var files = document.getElementById('filetoupload').files
                var formData = new FormData
                formData.append('filetoupload',files[0])
                this.import(formData)
                this.get()
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
                                this.get()
                            }
                        })
                    }
                })
            },
            handleSearch(){
                let searched = this.posts.filter(post=>post.title.toLowerCase().includes(this.search.toLowerCase()))
                this.setSearches(searched)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>