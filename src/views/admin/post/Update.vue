<template>
    <v-container fluid>
        <v-row dense>
            <v-col>
                <v-form ref="edit" @submit.prevent="edit" id="form-edit">
                    <v-card outlined>
                        <v-card-title>Edit {{post.title}}</v-card-title>
                        <v-card-text>
                            <v-alert type="success" v-if="res">{{res.message}}</v-alert>
                            <v-text-field v-if="!isAnswer" dense outlined label="Title" v-model="post.title" :rules="rules"/>
                            <v-select v-if="!isInstruction" dense outlined label="Type as" v-model="post.type_as" :items="type_asR"></v-select>
                            <ckeditor v-model="post.description" class="mb-5" :config="editorConfig" ref="cke"></ckeditor>
                            <v-select dense v-if="!isAnswer" v-model="post.category" label="Category" outlined :items="categories" item-text="name" item-value="_id"></v-select>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text color="warning" :to="`/admin/post${isInstruction ? '?instruction=true' : ''}`" exact>Back</v-btn>
                            <v-btn text color="primary" type="submit" form="form-edit" :loading="loading">Edit</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import {mapActions,mapState} from 'vuex'

    export default {
        name:'PostUpdate',
        data(){
            return{
                editorConfig:{},
                rules:[
                    v => !!v || 'This Field is Required'
                ],
            }
        },
        created(){
            this.editorConfig = {
                extraPlugins: ['uploadimage','justify'],
                filebrowserUploadUrl: process.env.VUE_APP_UPLOAD_URL,
                filebrowserUploadMethod:"form"
            }
            this.index()
            let vm = this
            setTimeout(()=>{
                vm.view(vm.$route.params.id)
            })
        },
        computed:{
            ...mapState({
                categories:state=>state.category.categories,
                post:state=>state.post.post,
                loading:state=>state.loading,
                res:state=>state.post.res
            }),
            type_asR(){
                if(this.isAnswer){
                    return ['correct answer','answer']
                }else{
                    return ['question','post']
                }
            },
            isAnswer(){
                if(this.post.type_as == 'answer' || this.post.type_as == 'correct answer'){
                    return true
                }else{
                    return false
                }
            },
            isInstruction(){
                if(this.$route.query.instruction){
                    return true
                }else{
                    return false
                }
            }
        },
        methods:{
            ...mapActions('post',['view','update']),
            ...mapActions('category',['index']),
            edit(){
                if(this.$refs.edit.validate()){
                    this.post.description = this.$refs.cke.instance.getData()
                    this.update(this.post)
                }
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>