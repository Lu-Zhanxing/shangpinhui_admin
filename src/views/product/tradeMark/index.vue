<template>
  <div>
    <el-button type="primary" class="el-icon-plus" style="margin: 10px 0"
      >添加</el-button
    >

    <el-table :data="list" style="width: 100%" border>
      <el-table-column type="index" label="序号" align="center" width="100px">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column label="品牌LOGO" width="width">
        <template slot-scope="{ row, $index }">
          <img style="width:50px;height:50px" :src="row.logoUrl" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button type="warning" class="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" class="el-icon-delete" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- current-page当前页码，page-size每页多少条数据，total总条数，pager-count连续页码（这里包含中间的连续页码以及第一页和最后一页按钮） -->
    <el-pagination
      align="center"
      style="margin-top: 20px"
      :current-page="page"
      :page-size="limit"
      :total="total"
      :pager-count="7"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[3, 5, 10]"
      layout="prev, pager, next, jumper, -> , sizes, total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 90,
      list: [],
    };
  },
  mounted() {
    this.getTradeMarkList();
  },
  methods: {
    // 获取品牌管理列表
    async getTradeMarkList() {
      let { page, limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      console.log(result);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    // 改变每页多少条数据
    handleSizeChange(val) {
      this.limit = val;
      this.getTradeMarkList();
    },
    // 改变当前页码
    handleCurrentChange(val) {
      this.page = val;
      this.getTradeMarkList();
    },
  },
};
</script>

<style>
</style>