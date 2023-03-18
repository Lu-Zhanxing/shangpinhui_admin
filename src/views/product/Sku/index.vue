<template>
  <div>
    <el-table :data="skuList" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column label="默认图片" width="150">
        <template slot-scope="{ row, $index }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="100">
      </el-table-column>
      <el-table-column prop="price" label="价格" width="100"> </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-top"
            v-if="row.isSale == 0"
            @click="onSale(row)"
          ></el-button>
          <el-button
            type="info"
            size="mini"
            icon="el-icon-bottom"
            v-if="row.isSale == 1"
            @click="cancelSale(row)"
          ></el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="$message('功能开发中~')"
          ></el-button>
          <el-button
            type="info"
            size="mini"
            icon="el-icon-info"
            @click="skuDetail(row)"
          ></el-button>
          <el-popconfirm title="确定删除此sku吗？" @onConfirm="del(row)">
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              slot="reference"
            ></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      align="center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[5, 10, 20]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
    >
    </el-pagination>
    <!-- 抽屉 -->
    <el-drawer :visible.sync="drawer" :with-header="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="18">{{ skuDetailData.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="18">{{ skuDetailData.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="18">{{ skuDetailData.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="18">
          <el-tag
            type="success"
            size="mini"
            v-for="(attr, index) in skuDetailData.skuAttrValueList"
            :key="attr.id"
            style="margin-right: 5px"
            >{{ attr.attrName }}：{{ attr.valueName }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="18">
          <el-carousel :interval="5000" arrow="always">
            <el-carousel-item
              v-for="(img, index) in skuDetailData.skuImageList"
              :key="img.id"
            >
              <img :src="img.imgUrl" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1, //当前页码
      limit: 5, //每页记录数
      total: 400,
      skuList: [],
      drawer: false, //抽屉显隐
      skuDetailData: [], //sku详情
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    // 获取sku列表
    async getSkuList() {
      let result = await this.$API.sku.reqSkulist(this.page, this.limit);
      if (result.code == 200) {
        this.skuList = result.data.records;
        this.total = result.data.total;
      }
    },

    // 分页器
    handleSizeChange(val) {
      this.limit = val;
      this.getSkuList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getSkuList();
    },

    // sku上架
    async onSale(row) {
      let result = await this.$API.sku.reqOnSale(row.id);
      if (result.code == 200) {
        this.$message.success("上架成功");
        row.isSale = 1;
      }
    },
    // sku下架
    async cancelSale(row) {
      let result = await this.$API.sku.reqCancelSale(row.id);
      if (result.code == 200) {
        this.$message.success("下架成功");
        row.isSale = 0;
      }
    },

    // sku详细信息
    async skuDetail(row) {
      this.drawer = true;
      let result = await this.$API.sku.reqSkuDetail(row.id);
      if (result.code == 200) {
        this.skuDetailData = result.data;
      }
    },

    // 删除sku
    async del(row) {
      let result = await this.$API.sku.reqDelSku(row.id);
      if (result.code == 200) {
        this.$message.success("删除成功");
        this.getSkuList();
      }
    },
  },
};
</script>

<style>
.el-row .el-col-5 {
  font-size: 16px;
  font-weight: bold;
  text-align: right;
  padding-right: 20px;
}
.el-row {
  margin: 30px 30px 10px;
}
</style>
<style>
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.el-carousel__item img {
  width: 100%;
}
.el-carousel__indicators .el-carousel__button {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
}
</style>