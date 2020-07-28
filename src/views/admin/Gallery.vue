<template>
    <v-container fluid>
        <v-row dense>
            <v-col>
                <span class="title">Gallery</span>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="d-flex">
                <v-btn depressed color="primary" @click="openFileDialog" class="ml-auto">
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-file-input style="display:none;" id="filetoupload" multiple @change="uploadFile"></v-file-input>
            </v-col>
        </v-row>
        <v-row dense v-if="loading">
            <v-col sm="3" md="2" v-for="i in 6" :key="i">
                <v-skeleton-loader type="image"></v-skeleton-loader>
            </v-col>
        </v-row>
        <v-row dense v-else>
            <v-col sm="3" md="2" v-for="gallery in galleries" :key="gallery._id">
                <v-card outlined>
                    <v-card-text>
                        <v-img :src="gallery.url" :alt="gallery.name" height="100" contain eager></v-img>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="primary" @click="copyUrl(gallery.url)" v-on="on">
                                    <v-icon>mdi-file-code-outline</v-icon>
                                </v-btn>
                            </template>
                            <span>copy html</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="success" @click="copyUrl(gallery.url,1)" v-on="on">
                                    <v-icon>mdi-earth</v-icon>
                                </v-btn>
                            </template>
                            <span>copy url</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="red" @click="del(gallery._id)" v-on="on">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </template>
                            <span>delete image</span>
                        </v-tooltip>
                        <v-spacer></v-spacer>

                        <v-snackbar v-model="snackbar" :timeout="2000" color="success">
                            {{ text }}
                            <v-btn text @click="snackbar = false">
                                Close
                            </v-btn>
                        </v-snackbar>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    import Swal from 'sweetalert2'

    export default {
        name:'Gallery',
        data(){
            return{
                text:'',
                snackbar:false
            }
        },
        created(){
            this.index()
        },
        computed:{
            ...mapState({
                loading:state=>state.loading,
                galleries:state=>state.gallery.galleries
            })
        },
        methods:{
            ...mapActions('gallery',['index','new','delete']),
            openFileDialog(){
                var filetoupload = document.getElementById('filetoupload')
                filetoupload.click()
            },
            async uploadFile(){
                var files = document.getElementById('filetoupload').files
                for(var i=0;i<files.length;i++)
                {
                    var file = files[i]
                    var formData = new FormData
                    formData.append('filetoupload',file)
                    await this.new(formData)
                }
                Swal.fire(
                    "Success!",
                    'The item has been uploaded',
                    'success',
                ).then(res => {
                    if(res.value){
                        this.index()
                    }
                })
            }, 
            copyUrl(url,html = false){
                url = html ? `<img src="${url}"/>` : url
                navigator.clipboard.writeText(url).then(()=>{
                    this.text = 'COPIED'
                    this.snackbar = true
                })
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
                            'Success!',
                            'The item has been deleted!',
                            'success'
                        ).then(()=>{
                            this.index()
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>