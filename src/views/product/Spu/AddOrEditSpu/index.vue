<template>
  <div>
    <el-form :model="spuForm" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input v-model="spuForm.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>
      <!-- 这里还得发请求 -->
      <el-form-item label="品牌">
        <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <!-- 可以通过rows设置它的高度 -->
        <el-input
          v-model="spuForm.description"
          type="textarea"
          rows="4"
          placeholder="SPU描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImgList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="unselectId" :placeholder="`还有${unSelectedSaleAttr.length}未选择`">
          <el-option :label="unselect.name" :value="unselect.id" v-for="(unselect,index) in unSelectedSaleAttr" :key="unselect.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!unselectId">添加销售属性</el-button>
        <el-table style="width: 100%" border :data="spuForm.spuSaleAttrList">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="saleAttrName"
            label="属性名"
            width="150"
          ></el-table-column>
          <el-table-column label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="tag.id"
                v-for="tag in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
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
      // 收集spuForm的信息
      // spuForm信息(新增spu的时候需要设置一些初始值及字段信息)
      spuForm: {
        category3Id: 0,
        id: 0,
        spuName: "string",
        description: "string",
        tmId: 0, //收集所选品牌的id的字段
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        spuSaleAttrList: [
          {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: "string",
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: "string",
                saleAttrName: "string",
                saleAttrValueName: "string",
                spuId: 0,
              },
            ],
          },
        ],
      },
      tradeMarkList: [], // 品牌列表
      spuImgList: [], // 图片列表
      saleAttrList: [], // 销售属性

      // tag标签内的属性
      inputVisible: false,
      inputValue: '',
      unselectId: '',//收集未选择的销售属性id
    };
  },
  computed:{
    unSelectedSaleAttr(){
      let result = this.saleAttrList.filter(item => {
        return this.spuForm.spuSaleAttrList.every(item1 => {
          return item.name != item1.saleAttrName
        })
      })
      return result
    }
  },
  methods: {
    // 照片墙
    handleRemove(file, fileList) {
      console.log(file, fileList);
      // 移除照片的时候需要先更新收集照片列表
      this.spuImgList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleAvatarSuccess(res, file, fileList) {
      // 上传图片的时候需要更新收集照片列表
      this.spuImgList = fileList
    },
    // 取消添加、编辑SPU
    toList() {
      // 自定义事件，将sence传递给父组件
      this.$emit("changeSence", 0);
    },
    // 获取spu信息
    async getSpuById(row) {
      // 获取spu基本信息
      let spuResult = await this.$API.spu.reqGetSpuById(row.id);
      if (spuResult.code == 200) {
        this.spuForm = spuResult.data;
      }
      // 获取品牌数据
      let trademarkResult = await this.$API.spu.reqTrademarkList();
      if (trademarkResult.code == 200) {
        this.tradeMarkList = trademarkResult.data;
      }
      // 获取图片数据
      let imgResult = await this.$API.spu.reqSpuImgList(row.id);
      if (imgResult.code == 200) {
        let imgListArr = imgResult.data;
        imgListArr.forEach((item) => {
          item.url = item.imgUrl;
          item.name = item.imgName;
        });
        this.spuImgList = imgListArr;
      }
      // 获取销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    
    // 销售属性--tag标签内部方法,后期还需要修改的
    handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      }
  },
};
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>