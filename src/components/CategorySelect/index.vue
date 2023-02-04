<template>
  <div>
    <el-form :inline="true" :model="cForm" class="demo-form-inline">
      <el-form-item label="分类一">
        <el-select placeholder="请选择" v-model="cForm.categoryId1" @change="getCategory2()">
          <el-option :label="c1.name" :value="c1.id" v-for="(c1,index) in list1" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类二">
        <el-select placeholder="请选择" v-model="cForm.categoryId2" @change="getCategory3()">
            <el-option :label="c2.name" :value="c2.id" v-for="(c2,index) in list2" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类三">
        <el-select placeholder="请选择" v-model="cForm.categoryId3" >
            <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in list3" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  data() {
    return {
        list1:[],
        list2:[],
        list3:[],
        // 保存选中的value值
        cForm:{
            categoryId1:'',
            categoryId2:'',
            categoryId3:''
        }
    };
  },
  mounted(){
    // 获取分类一的数据
    this.getCategory1()
  },
  methods: {
    // 获取分类一列表
    async getCategory1(){
        let result = await this.$API.attr.reqGetCategory1()
        if(result.code == 200){
            this.list1 = result.data
        }
    },
    // 获取分类二列表
    async getCategory2(){
        const {categoryId1} = this.cForm
        let result = await this.$API.attr.reqGetCategory2(categoryId1)
        if(result.code == 200){
            this.list2 = result.data
        }
        // 改变分类一的时候，将分类二和分类三的选中的值清空
        this.cForm.categoryId2 = ''
        this.cForm.categoryId3 = ''
    },
    // 获取分类三列表
    async getCategory3(){
        const {categoryId2} = this.cForm
        let result = await this.$API.attr.reqGetCategory3(categoryId2)
        if(result.code == 200){
            this.list3 = result.data
        }
        // 改变分类二的时候，将分类三的选中的值清空
        this.cForm.categoryId3 = ''
    }
  },
  
};
</script>

<style>
</style>