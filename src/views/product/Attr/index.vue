<template>
  <div>
    <el-card class="box-card" style="margin: 10px 0 20px 0">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowAttrList">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin: 0 0 20px 0"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column label="序号" type="index" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                style="margin-right: 10px"
                v-for="(attrVal, index) in row.attrValueList"
                :key="attrVal.id"
                >{{ attrVal.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                icon="el-icon-edit"
                type="warning"
                size="mini"
                @click="editAttr(row)"
              ></el-button>
              <el-button
                icon="el-icon-delete"
                type="danger"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowAttrList">
        <el-form :inline="true" :model="attrForm" class="demo-form-inline">
          <el-form-item label="属性名">
            <el-input
              v-model="attrForm.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrVal" :disabled="!attrForm.attrName">添加属性值</el-button>
        <el-button @click="cancelAddOrEditAttr">取消</el-button>
        <el-table
          :data="attrForm.attrValueList"
          style="width: 100%;margin:20px 0" border>
          <el-table-column
            label="序号"
            type="index"
            width="80"
            align="center">
          </el-table-column>
          <el-table-column
            label="属性值名称"
            width="width">
            <!-- 这里不知道咋处理，还得再看看视频 -->
            <template slot-scope="{row,$index}">
              <el-input v-model="row.valueName" placeholder="请输入属性值" size="mini" v-if="row.flag" @blur="changeFlag(row)" @keyup.native.enter="changeFlag(row)"></el-input>
              <span v-else @click="row.flag = true" style="display:block">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="width">
            <template slot-scope="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="cancelAddOrEditAttr">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      // 是否展示属性列表
      isShowAttrList: false,
      attrForm:{
        attrName:'',
        attrValueList:[],
        categoryId:'',
        // 这里是固定值3，因为只有分类三才会有添加属性操作
        categoryLevel:'3'
      }
    };
  },
  methods: {
    // 获取子组件传过来的id
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        // 当level为3时，发请求请求属性列表
        this.getCategoryList();
      }
    },
    // 请求属性值列表
    async getCategoryList() {
      let { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    // 添加属性
    addAttr(){
      this.isShowAttrList = false
      // 添加之前先清空之前的内容
      this.attrForm = {
        attrName:'',
        attrValueList:[],
        categoryId:this.category3Id,
        categoryLevel:'3'
      }
    },
    // 添加属性按钮的回调
    addAttrVal(){
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id, // 获取到编辑属性的id值
        valueName:'',
        flag: true
      })
    },
    // 编辑属性
    editAttr(row){
      this.isShowAttrList = false
      console.log(row)
      // 注意：这里要用到深拷贝(引入的lodash深拷贝插件)
      this.attrForm = cloneDeep(row)
    },
    // 取消添加属性
    cancelAddOrEditAttr(){
      this.isShowAttrList = true
    },
    // 失去焦点、回车事件改变状态，隐藏输入框，显示span
    changeFlag(row){
      // 如果输入的内容为空，提示
      if(row.valueName.trim() == ''){
        this.$message('输入的属性值不能为空')
        return
      }
      // 判断是否有重复的
      let isRepeat = this.attrForm.attrValueList.some(item => {
        if(item != row){
          return item.valueName == row.valueName
        }
      })
      // 如果有重复的，那么点击回车无效
      if(isRepeat) return
      row.flag = false
    }
  },
};
</script>

<style>
</style>