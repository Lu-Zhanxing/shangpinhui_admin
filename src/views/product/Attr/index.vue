<template>
  <div>
    <el-card class="box-card" style="margin: 10px 0 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :isShowTable="isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
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
              <el-popconfirm :title="`确定删除${row.attrName}吗？`" @onConfirm="delAttr(row)">
                <el-button
                icon="el-icon-delete"
                type="danger"
                size="mini"
                slot="reference"
              ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form :inline="true" :model="attrForm" class="demo-form-inline">
          <el-form-item label="属性名">
            <el-input
              v-model="attrForm.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrVal"
          :disabled="!attrForm.attrName"
          >添加属性值</el-button
        >
        <el-button @click="cancelAddOrEditAttr">取消</el-button>
        <el-table
          :data="attrForm.attrValueList"
          style="width: 100%; margin: 20px 0"
          border
        >
          <el-table-column label="序号" type="index" width="80" align="center">
          </el-table-column>
          <el-table-column label="属性值名称" width="width">
            <!-- 这里不知道咋处理，还得再看看视频 -->
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                :ref="$index"
                placeholder="请输入属性值"
                size="mini"
                v-if="row.flag"
                @blur="changeFlag(row)"
                @keyup.native.enter="changeFlag(row)"
              ></el-input>
              <span
                v-else
                @click="changeFlagToTrue(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.valueName}吗？`"
                @onConfirm="delAttrVal($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="saveAttr" :disabled="attrForm.attrValueList.length < 1">保存</el-button>
        <el-button @click="cancelAddOrEditAttr">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      // 是否展示属性列表
      isShowTable: true,
      attrForm: {
        attrName: "",
        attrValueList: [],
        categoryId: "",
        // 这里是固定值3，因为只有分类三才会有添加属性操作
        categoryLevel: "3",
      },
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
    addAttr() {
      this.isShowTable = false;
      // 添加之前先清空之前的内容
      this.attrForm = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: "3",
      };
    },
    // 添加属性按钮的回调
    addAttrVal() {
      // 补充：如果属性值为空，不能再次添加
      let isNull = this.attrForm.attrValueList.some((item) => {
        return item.flag == true && !item.valueName;
      });
      if (!isNull){
        this.attrForm.attrValueList.push({
          attrId: this.attrForm.id, // 获取到编辑属性的id值
          valueName: "",
          flag: true,
        });
      }
      // 自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrForm.attrValueList.length - 1].focus();
      });
    },
    // 编辑属性
    editAttr(row) {
      this.isShowTable = false;
      // 注意：这里要用到深拷贝(引入的lodash深拷贝插件)
      this.attrForm = cloneDeep(row);
      // 这里需要手动添加一下flag值，因为之前的数据可能没有flag值，这时候就需要添加一下
      this.attrForm.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    // 取消添加属性
    cancelAddOrEditAttr() {
      this.isShowTable = true;
    },
    // 失去焦点、回车事件改变状态，隐藏输入框，显示span
    changeFlag(row) {
      // 如果输入的内容为空，提示
      if (row.valueName.trim() == "") {
        this.$message("输入的属性值不能为空");
        return;
      }
      // 判断是否有重复的
      let isRepeat = this.attrForm.attrValueList.some((item) => {
        if (item != row) {
          return item.valueName == row.valueName;
        }
      });
      // 如果有重复的，那么点击回车无效
      if (isRepeat) return;
      row.flag = false;
    },
    changeFlagToTrue(row, index) {
      row.flag = true;
      // 自动聚焦
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 删除(注意：由于elementui版本问题，确定事件是onConfirm，而不是confirm)
    delAttrVal(index) {
      this.attrForm.attrValueList.splice(index, 1);
    },
    // 点击保存，收集数据，发送请求到服务器
    async saveAttr() {
      // 点击保存向后台传递的数据中没有flag，这时候我们要把flag属性删除掉
      // 删除对象某个属性的方法，学到了！！
      this.attrForm.attrValueList = this.attrForm.attrValueList.filter(item =>{
          delete item.flag
          return true
      })
      // 发请求
      try {
        let result = await this.$API.attr.reqSaveAttr(this.attrForm)
        if(result.code == 200){
          this.$message({
            type:'success',
            message:'保存成功'
          })
          // 保存成功后返回列表页
          this.isShowTable = true,
          // 更新属性列表
          this.getCategoryList()
        }
      } catch (error) {
        // this.$message("保存失败")
      }
    },
    // 删除商品属性（视频上没有，自己根据后台接口加上的）
    async delAttr(row){
      let result = await this.$API.attr.reqDeleteAttr(row.id)
      if(result.code == 200){
        this.$message({
          type:'success',
          message:'删除成功'
        })
        // 更新属性列表
        this.getCategoryList()
      }
    }
  },
};
</script>

<style>
</style>