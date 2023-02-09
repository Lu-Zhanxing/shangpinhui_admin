<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input v-model="model" placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="model" placeholder="请选择品牌">
          <el-option label="label" value="value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <!-- 可以通过rows设置它的高度 -->
        <el-input v-model="model" type="textarea" rows="4" placeholder="SPU描述"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="model" placeholder="还有3未选择">
          <el-option label="label" value="value"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        <el-table style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="prop" label="属性名" width="150"></el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click="toList">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "AddOrEditSpu",
  data() {
    return {
      // 上传照片墙
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  methods: {
    // 照片墙
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 取消添加、编辑SPU
    toList(){
      // 这里需要用到父组件传过来的sence，现在这么写不对呢
      // this.sence = 0
    }
  },
};
</script>

<style>
</style>