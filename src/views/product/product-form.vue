<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      @close="productFormClose"
      :show="show">
      <el-form :rules="rules" ref="productForm" :model="formData" label-position="right" label-width="100px" style='width: 96%; margin-left:15px;margin-top:15px'>
        <el-row>
          <el-col :span="12">
            <el-form-item label="锅炉编号" prop="boilerNo">
              <el-input v-model="formData.boilerNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="锅炉型号">
              <el-select clearable class="filter-item" v-model="formData.boilerModelNumber"  style="width: 60%">
                <el-option v-for="item in boilerModelNumberArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-button type="primary" @click="handleAddBoilerModel" v-permission="['3']">添加</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="控制器编号" prop="controllerNo">
              <el-input v-model="formData.controllerNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" >
            <el-form-item label="吨位（T）" prop="tonnageNum">
              <el-input v-model="formData.tonnageNum"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="燃料" prop="fuel">
              <el-select clearable class="filter-item" v-model="formData.fuel" style="width: 100%" >
                <el-option v-for="item in fuelArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="介质" prop="medium">
              <el-select clearable class="filter-item" v-model="formData.medium" style="width: 100%" >
                <el-option v-for="item in mediumArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" @click="submitForm">确认</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <boiler-model-complete-dialog
      :show.sync="boilerModelCompleteDialogVisible"
      @boilerModelCompleteDialogClose="boilerModelCompleteDialogClose">
    </boiler-model-complete-dialog>
  </div>
</template>

<script>
  import {formatDateTime} from '@/utils/date'
  import {getBoilerModelListByCondition} from '@/api/boilerModel'
  import {validatePositiveAndSmallAndFloatNum} from '@/utils/validate'
  import {initMedium,initFuel,initIsSell} from './product-dictionary'
  import {getAuxiliaryMachineLargeClassListByCondition} from '@/api/auxiliaryMachineLargeClass'
  import {getAuxiliaryMachineSmallClassListByCondition} from '@/api/auxiliaryMachineSmallClass'
  import {editProduct} from '@/api/product'
  import permission from '@/directive/permission/index.js'
  import boilerModelCompleteDialog from './boiler-model-complete-page'
  export default {
    directives: { permission },
    components: {
      boilerModelCompleteDialog
    },
    data () {
      const validatePositiveAndSmallAndFloatNumFun = (rule, value, callback) => {
        if (!validatePositiveAndSmallAndFloatNum(value)) {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
      }
      const validateFuelFun = (rule, value, callback) => {
        if(value==null){
          callback(new Error('请选择燃料'))
        }else {
          callback()
        }
      }
      const validateMediumFun = (rule, value, callback) => {
        if(value==null){
          callback(new Error('请选择介质'))
        }else {
          callback()
        }
      }
      return {
        formData:{
          id:'',
          roleIdArray:this.$store.state.user.roleIdArray,
          userId:this.$store.state.user.userId,
          orgId:this.$store.state.user.orgId,
          orgType:this.$store.state.user.orgType,
          controllerNo:'',
          boilerNo:'',
          boilerModelNumber:null,
          tonnageNum:null,
          medium:null,
          fuel:null,
          createDateTime:formatDateTime(new Date(),"yyyy-MM-dd hh:mm:ss"),
          editDateTime:formatDateTime(new Date(),"yyyy-MM-dd hh:mm:ss"),
          isSell:0,
          productAuxiliaryMachineInfoList:[]
        },
        visible: this.show,
        boilerModelNumberArray:[],
        mediumArray:[],
        fuelArray:[],
        isSellArray:[],
        largeClassOptions:[],
        smallClassOptions:[],
        rules:{
          tonnageNum: [{trigger: 'blur', validator: validatePositiveAndSmallAndFloatNumFun}],
          boilerNo: [{ required: true,trigger: 'blur', message: '锅炉编号不能为空' }],
          controllerNo: [{ required: true,trigger: 'blur', message: '设备编号不能为空' }],
          fuel: [{ required: true,trigger: 'blur', validator: validateFuelFun }],
          medium: [{ required: true,trigger: 'blur', validator: validateMediumFun }],
        },
        boilerModelCompleteDialogVisible:false,
      };
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      productFormData:{
        type: Object,
        default: ()=>{}
      },
      title:{
        type:String,
        default:''
      }
    },
    watch: {
      show () {
        this.visible = this.show;
        if (this.title === '编辑') {
          this.formData = this.productFormData
        }else if (this.title === '新增')
        {
          this.formData = {}
          this.formData.isSell=0
          this.formData.roleIdArray=this.$store.state.user.roleIdArray
          this.formData.userId=this.$store.state.user.userId
          this.formData.orgId=this.$store.state.user.orgId
          this.formData.orgType=this.$store.state.user.orgType
          this.formData.createDateTime=formatDateTime(new Date(),"yyyy-MM-dd hh:mm:ss")
          this.formData.editDateTime=formatDateTime(new Date(),"yyyy-MM-dd hh:mm:ss")
        }else  if (this.title === '复制') {
          this.formData = this.productFormData
          this.formData.boilerNo = ''
          this.formData.controllerNo=''
          this.formData.roleIdArray=this.$store.state.user.roleIdArray
          this.formData.userId=this.$store.state.user.userId
          this.formData.orgId=this.$store.state.user.orgId
          this.formData.orgType=this.$store.state.user.orgType
          this.formData.createDateTime=formatDateTime(new Date(),"yyyy-MM-dd hh:mm:ss")
        }
      }
    },
    mounted() {
      Promise.all([this.initSelect(),this.initAuxiliaryMachineAbout()])

    },
    methods: {
      initSelect(){
        this.initBoilerModel()
        initMedium().then(data=>{this.mediumArray=data})
        initFuel().then(data=>{this.fuelArray=data})
        initIsSell().then(data=>{this.isSellArray=data})
      },
      initBoilerModel(){
        getBoilerModelListByCondition({orgId:this.$store.state.user.orgId,orgType:this.$store.state.user.orgType}).then(data=>{
          this.boilerModelNumberArray=data.data.data
        })
      },
      initAuxiliaryMachineAbout(){
        getAuxiliaryMachineLargeClassListByCondition({}).then(response=>{
          this.largeClassOptions=this.getAuxiliaryMachineAboutOptions(response.data.data)
        })
        getAuxiliaryMachineSmallClassListByCondition({}).then(response=>{
          this.smallClassOptions=this.getAuxiliaryMachineAboutOptions(response.data.data)
        })
      },
      getAuxiliaryMachineAboutOptions(dataList){
        let options=[]
        dataList.forEach(item=>{
          let optionItem={}
          optionItem.value=item.id
          optionItem.label=item.name
          options.push(optionItem)
        })
        return options
      },
      submitForm(){
        this.$refs['productForm'].validate((valid) => {
          if (valid) {
            if (this.title === '复制') {
              this.formData.id=''
            }
            this.$emit('confirmEditDialog',{productFromDialogVisible:false,flag:true,productFormData:this.formData,title:this.title})
          } else {
            this.$emit('confirmEditDialog',{productFromDialogVisible:true,flag:false})
          }
        });
      },
      productFormClose(){
        this.$emit('productFormDialogClose',{productFromDialogVisible:false})
      },
      handleAddBoilerModel(){
        this.boilerModelCompleteDialogVisible = true
      },
      boilerModelCompleteDialogClose(obj){
        this.boilerModelCompleteDialogVisible = obj.boilerModelCompleteDialogVisible
        this.initBoilerModel()
      },
    }
  }
</script>
