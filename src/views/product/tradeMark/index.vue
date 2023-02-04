<template>
  <div>
    <el-button
      type="primary"
      class="el-icon-plus"
      style="margin: 10px 0"
      @click="showTrademarkDialog"
      >添加</el-button
    >

    <el-table :data="list" style="width: 100%" border>
      <el-table-column type="index" label="序号" align="center" width="100px">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column label="品牌LOGO" width="width">
        <template slot-scope="{ row, $index }">
          <img style="width: 50px; height: 50px" :src="row.logoUrl" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            class="el-icon-edit"
            size="mini"
            @click="editTrademark(row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            class="el-icon-delete"
            size="mini"
            @click="delTrademark(row.id)"
            >删除</el-button
          >
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
    <!-- 添加、修改品牌弹框 -->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <el-form :model="tmForm" :rules="rules" ref="ruleForm" style="width: 80%">
        <el-form-item
          label="品牌名称"
          prop="tmName"
          :label-width="formLabelWidth"
        >
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEvent">取 消</el-button>
        <el-button type="primary" @click="addOrEditTrademark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      // 弹框表单校验
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "change" },
        ],
        logoUrl: [
          { required: true, message: "请上传图片"},
        ]
      },
      page: 1,
      limit: 3,
      total: 90,
      list: [],
      // 弹框相关
      dialogFormVisible: false,
      formLabelWidth: "120px",
      tmForm: {
        id: "",
        tmName: "",
        logoUrl: "",
      },
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
    // 添加品牌弹框
    showTrademarkDialog() {
      this.dialogFormVisible = true;
      this.tmForm.tmName = "";
      this.tmForm.logoUrl = "";
    },
    // 编辑品牌
    editTrademark(row) {
      this.dialogFormVisible = true;
      // 方法一：这样写不会造成当编辑弹框品牌的时候，列表中的值也会跟着改，取消按钮无效的问题
      // this.tmForm.id = row.id;
      // this.tmForm.tmName = row.tmName;
      // this.tmForm.logoUrl = row.logoUrl;

      // 方法二：直接赋值的方法
      // 注意：这样写就不行，会造成双向数据绑定，当编辑弹框品牌的时候，列表中的值也会跟着改的问题
      // this.tmForm = row

      // 解决：浅拷贝，只拷贝一层，这样就解决了上边这个问题
      // this.tmForm = {...row}
      this.tmForm = Object.assign({}, row);
    },
    // 弹窗取消按钮
    cancelEvent() {
      this.dialogFormVisible = false;
      this.tmForm = { id: "", tmName: "", logoUrl: "" };
    },
    // 弹窗点击确定按钮
    addOrEditTrademark() {
      // 先校验，校验成功再发请求
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          let result = await this.$API.trademark.addOrEditTrademark(this.tmForm);
          if (result.code == 200) {
            this.$message({
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
              type: "success",
            });
            this.getTradeMarkList();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 图片上传
    handleAvatarSuccess(res, file) {
      // this.tmForm.logoUrl = URL.createObjectURL(file.response.data);
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 删除品牌
    delTrademark(rowId) {
      this.$confirm('是否删除该品牌?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          let result = await this.$API.trademark.delTrademark(rowId);
          if(result.code == 200){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            // 当只有一条数据，删除了的时候，页数减一
            if(this.list.length == 1){
              this.page -= 1
            }
            this.getTradeMarkList();
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>