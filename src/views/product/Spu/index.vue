<template>
  <div>
    <el-card style="margin:20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :isShowTable="sence==0"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="sence==0">
        <el-button type="primary" icon="el-icon-plus" :disabled="!this.category3Id" @click="addSpu">添加SPU</el-button>
        <el-table :data="spuList" style="width: 100%;margin:10px 0" border>
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width"></el-table-column>
          <el-table-column prop="description" label="spu描述" width="width"></el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{row,$index}">
              <!-- 问题：这里需要用到一个啥玩意儿来着，忘了 -->
              <el-button type="success" icon="el-icon-plus" size="mini"></el-button>
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="editSpu(row)"></el-button>
              <el-button type="info" icon="el-icon-info" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout=" prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          align="center">
        </el-pagination>
      </div>
      <div v-show="sence==1">
        <AddOrEditSpu @changeSence="changeSence" ref="addOrEditSpu"></AddOrEditSpu>
      </div>
      <div v-show="sence==2">
        <add-sku></add-sku>
      </div>
    </el-card>
  </div>
</template>

<script>
import AddOrEditSpu from './AddOrEditSpu'
import AddSku from './AddSku'
export default {
  name: "Spu",
  components:{AddOrEditSpu,AddSku},
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 是否展示列表
      // isShowTable: true,
      // spu列表
      spuList: [],
      // 分页器参数
      page:1, //当前第几页
      limit:3, //每页多少条数据
      total:0, //总共多少条数居
      // 列表展示sence
      sence:0, //0表示展示spu列表，1表示添加、修改SPU页面，2表示新增SKU页面
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
        this.getSpuList();
      }
    },
    async getSpuList() {
      let {page,limit,category3Id} = this
      let result = await this.$API.spu.reqSpuList(page,limit,category3Id)
      if(result.code == 200){
        let resultData = result.data
        this.page = resultData.current
        this.limit = resultData.size
        this.total = resultData.total
        this.spuList = resultData.records
      }
    },
    // 分页组件的两个方法
    handleSizeChange(val) {
      this.limit = val
      this.getSpuList();
    },
    handleCurrentChange(val) {
      this.page = val
      this.getSpuList();
    },
    // 添加spu
    addSpu(){
      this.sence = 1
      
    },
    // 编辑spu
    editSpu(row){
      this.sence = 1
      // 发请求
      this.$refs.addOrEditSpu.getSpuById(row)
    },
    changeSence(sence){
      this.sence = sence
      this.getSpuList();
    }
  },
};
</script>

<style>
</style>