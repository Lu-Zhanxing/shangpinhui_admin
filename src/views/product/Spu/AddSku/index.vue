<template>
  <div>
    <el-form label-width="120px">
      <el-form-item label="SPU名称">{{ spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuForm.skuName" placeholder="SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格（元）">
        <el-input type="number" v-model="skuForm.price" placeholder="价格（元）"></el-input>
      </el-form-item>
      <el-form-item label="重量（千克）">
        <el-input v-model="skuForm.weight" placeholder="重量（千克）"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          v-model="skuForm.skuDesc"
          placeholder="规格描述"
          type="textarea"
          rows="4"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form label-width="80px" :inline="true">
          <el-form-item :label="attr.attrName" v-for="(attr,index) in attrList" :key="attr.id">
            <!-- 疑问题：这里存储到哪里了，怎么存的来着？？？ -->
            <el-select v-model="attr.attrIdAndValId" placeholder="请选择">
              <el-option :label="attrVal.valueName" :value="`${attrVal.attrId}:${attrVal.id}`" v-for="(attrVal,index) in attr.attrValueList" :key="attrVal.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form label-width="80px" :inline="true">
          <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr,index) in saleAttrList" :key="saleAttr.id">
            <el-select v-model="saleAttr.saleAttrIdAndValId" placeholder="请选择">
              <el-option :label="saleAttrVal.saleAttrValueName" :value="`${saleAttrVal.baseSaleAttrId}:${saleAttrVal.id}`" v-for="(saleAttrVal,index) in saleAttr.spuSaleAttrValueList" :key="saleAttrVal.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table :data="imgList" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="80px"> </el-table-column>
          <el-table-column label="图片" width="width">
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="primary" size="mini" v-if="row.isDefault=='0'" @click="setDefault(row)">设为默认</el-button>
              <el-button size="mini" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSku">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "AddSku",
  data() {
    return {
      spuName: "",//父组件传过来的spuName
      // 平台属性
      attrList: [],
      // 销售属性
      saleAttrList: [],
      // 图片列表
      imgList: [],
      // 收集表格勾选的图片
      selectImgList:[],
      // sku
      skuForm: {
        // 从父组件获取的
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 此页面动态绑定的
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        // 平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        // 销售属性
        skuSaleAttrValueList: [
          // {
          //   saleAttrId: 0,
          //   saleAttrValueId: 0,
          // },
        ],
        // 图片列表
        skuDefaultImg: "",
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
      },
    };
  },
  methods: {
    // 添加sku的取消按钮
    cancel() {
      this.$emit("cancelAddSku",0);
      Object.assign(this._data,this.$options.data())
    },

    // 添加Sku页面
    async addSku(category1Id, category2Id, row) {
      // 获取Spu名称
      this.spuName = row.spuName;
      this.skuForm.category3Id = row.category3Id
      this.skuForm.spuId = row.id
      this.skuForm.tmId = row.tmId

      // 获取平台属性信息
      let attrResult = await this.$API.spu.reqGetAttrInfoList(
        category1Id,
        category2Id,
        row.category3Id
      );
      if (attrResult.code == 200) {
        this.attrList = attrResult.data;
      }
      // 获取销售属性信息
      let saleAttrResult = await this.$API.spu.reqGetSaleList(row.id);
      if (saleAttrResult.code == 200) {
        this.saleAttrList = saleAttrResult.data;
      }
      // 获取图片列表信息
      let imgResult = await this.$API.spu.reqSpuImgList(row.id);
      if (imgResult.code == 200) {
        let list = imgResult.data;
        list.forEach(item => item.isDefault = '0')
        this.imgList = list
      }
    },

    // 表格勾选事件
    handleSelectionChange(params){
      this.selectImgList = params
    },

    // 设置默认图片
    setDefault(row){
      // 设置默认图片
      this.skuForm.skuDefaultImg = row.imgUrl

      // 排他操作，只能有一个按钮显示默认
      this.imgList.forEach(item => item.isDefault='0')
      row.isDefault = '1'
    },

    // 保存Sku
    async saveSku(){
      // 整理数据
      // 疑问题：这里用map的话返回的数据中有undefined怎么处理（因为和原数组长度一样，但是原数组中不是每个里边都有值）
      // console.log(this.attrList)
      // let newList = this.attrList.map(item => {
      //   if(item.attrIdAndValId){
      //     let [attrId,valueId] = item.attrIdAndValId.split(":")
      //     return {
      //       attrId,
      //       valueId
      //     }
      //   }
      // })
      // console.log(newList)

      // 整理平台属性
      this.skuForm.skuAttrValueList = this.attrList.reduce((prev,item) => {
        if(item.attrIdAndValId){
          let [attrId,valueId] = item.attrIdAndValId.split(":")
          prev.push({attrId,valueId})
        }
      })
      // 整理销售属性
      this.skuForm.skuSaleAttrValueList = this.saleAttrList.reduce((prev,item) => {
        if(item.saleAttrIdAndValId){
          let [saleAttrId,saleAttrValueId] = item.attrIdAndValId.split(":")
          prev.push({saleAttrId,saleAttrValueId})
        }
      })
      // 整理图片数据
      this.skuForm.skuImageList = this.selectImgList.map(item => {
        return{
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })

      let result = await this.$API.spu.reqSaveSku(this.skuForm)
      if (result.code == 200) {
        this.$message.success("添加sku成功")
        this.$emit("cancelAddSku",0)
      }
    }
  },
};
</script>

<style>
</style>