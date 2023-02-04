<template>
  <div>
    <el-card class="box-card" style="margin: 10px 0 20px 0">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <el-button type="primary" icon="el-icon-plus" style="margin: 0 0 20px 0"
        >添加属性</el-button
      >
      <el-table :data="attrList" style="width: 100%" border>
        <el-table-column label="序号" type="index" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表" width="width">
          <template slot-scope="{ row,$index }">
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
          <template slot-scope="{ row,$index }">
            <el-button icon="el-icon-edit" type="warning" size="mini"></el-button>
            <el-button icon="el-icon-delete" type="danger" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Attr",
  data() {
    return {
      category1Id:'',
      category2Id:'',
      category3Id:'',
      attrList: [],
    };
  },
  methods: {
    getCategoryId({categoryId,level}){
      if (level == 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      }else if(level == 2){
        this.category2Id = categoryId
        this.category3Id = ''
      }else{
        this.category3Id = categoryId
        // 当level为3时，发请求请求属性列表
        this.getCategoryList()
      }
    },
    async getCategoryList(){
      let {category1Id, category2Id, category3Id} = this
      let result = await this.$API.attr.reqAttrInfoList(category1Id, category2Id, category3Id)
        if(result.code == 200){
            this.attrList = result.data
        }
    }
  },
};
</script>

<style>
</style>