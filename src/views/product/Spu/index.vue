<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :isShowTable="sence == 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="sence == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!this.category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table :data="spuList" style="width: 100%; margin: 10px 0" border>
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="spuName"
            label="spu名称"
            width="width"
          ></el-table-column>
          <el-table-column
            prop="description"
            label="spu描述"
            width="width"
          ></el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 问题：这里需要用到一个啥玩意儿来着，忘了  hint-button(目前我没用，细节问题，以后有需要再说)-->
              <el-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="editSpu(row)"
                title="编辑spu"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="getSkuListData(row)"
              ></el-button>
              <el-popconfirm
                title="确定删除此SPU信息吗？"
                @onConfirm="delSpu(row)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                ></el-button>
              </el-popconfirm>
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
          align="center"
        >
        </el-pagination>
      </div>
      <div v-show="sence == 1">
        <AddOrEditSpu
          @changeSence="changeSence"
          ref="addOrEditSpu"
        ></AddOrEditSpu>
      </div>
      <div v-show="sence == 2">
        <add-sku @cancelAddSku="cancelAddSku" ref="toAddSku"></add-sku>
      </div>
    </el-card>
    <!-- 弹窗 -->
    <el-dialog :title="`${spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table :data="skuListData" v-loading="loading">
        <el-table-column
          property="skuName"
          label="名称"
          width="150"
        ></el-table-column>
        <el-table-column
          property="price"
          label="价格"
          width="200"
        ></el-table-column>
        <el-table-column property="weight" label="重量"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" width="100" height="100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import AddOrEditSpu from "./AddOrEditSpu";
import AddSku from "./AddSku";
export default {
  name: "Spu",
  components: { AddOrEditSpu, AddSku },
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
      page: 1, //当前第几页
      limit: 3, //每页多少条数据
      total: 0, //总共多少条数居
      // 列表展示sence
      sence: 0, //0表示展示spu列表，1表示添加、修改SPU页面，2表示新增SKU页面
      // 弹窗
      dialogTableVisible: false,
      // 当前选中的spuName
      spuName:'',
      // sku列表
      skuListData: [],
      // loading加载
      loading: true
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
      let { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        let resultData = result.data;
        this.page = resultData.current;
        this.limit = resultData.size;
        this.total = resultData.total;
        this.spuList = resultData.records;
      }
    },
    // 分页组件的两个方法
    handleSizeChange(val) {
      this.limit = val;
      this.getSpuList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getSpuList();
    },
    // 添加spu
    addSpu() {
      this.sence = 1;
      // 发请求获取品牌信息和销售属性
      this.$refs.addOrEditSpu.getTrademarkAndSale(this.category3Id);
    },
    // 编辑spu
    editSpu(row) {
      this.sence = 1;
      // 发请求
      this.$refs.addOrEditSpu.getSpuById(row);
    },
    changeSence({ sence, flag }) {
      this.sence = sence;
      if (flag == "添加") {
        this.page = 1;
      }
      this.getSpuList();
    },

    // 删除SPU
    async delSpu(row) {
      let result = await this.$API.spu.delSpu(row.id);
      if (result.code == 200) {
        this.$message({ message: "删除成功", type: "success" });
        this.getSpuList();
      }
    },

    // 添加sku
    addSku(row) {
      this.sence = 2;
      // 这里需要发请求
      this.$refs.toAddSku.addSku(this.category1Id, this.category2Id, row);
    },

    // 取消添加sku
    cancelAddSku(sence) {
      this.sence = sence;
    },

    // 查看某一个spu的sku列表
    async getSkuListData(row){
      this.spuName = row.spuName
      this.dialogTableVisible = true
      let result =await this.$API.spu.reqSkuListData(row.id)
      if(result.code == 200){
        this.skuListData = result.data
        this.loading = false
      }
    },
    // dialog关闭之前将loading值重置
    close(done){
      this.loading = true
      this.skuListData = []
      done()
    }
  },
};
</script>

<style>
</style>