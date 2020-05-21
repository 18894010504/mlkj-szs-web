<template>
  <div>
    <el-container>
      <el-aside width="200px" class="leftConent">
        <div>
          <p>栏目信息</p>
          <el-tree :data="columtree" accordion :props="defaultProps" @node-click="selectTree"></el-tree>
        </div>
      </el-aside>
      <el-main class="conent">
        <div>
          <div class="head">
            <div class="left">
              <el-select class="complany" v-model="statusPush" size="small" placeholder="====未选择===" @change="statuswenxinfun">
                <el-option
                  v-for="item in weixinstatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select class="complany" v-model="isexaminedata" size="small" placeholder="====未选择===" @change="isexamstatus">
                <el-option
                  v-for="item in Approvaltatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input
                class="complanyinput"
                placeholder="请输入内容"
                size="small"
                v-model="restaurantkeyword">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <el-button class="" size="small" type="primary" icon="el-icon-search" @click.native.stop="seltable">查询</el-button>
              <el-button size="small" icon="el-icon-refresh" @click.native="refreshfun">刷新</el-button>
            </div>
            <div class="right">
              <el-button type="primary" size="small" icon="el-icon-share" @click.native="PublishArticles">推送</el-button>
              <el-button type="primary" size="small" @click.native="dialogVisible = true" icon="el-icon-circle-plus">新增
              </el-button>
            </div>
          </div>
          <div class="conentHtml">
            <el-table
              :data="tableData"
              style="width: auto" border
              @selection-change="handleSelectionChange">
              <el-table-column
                :selectable= 'checkboxInit'
                type="selection"
                width="55">
                <span>scope.row.isexamine</span>
              </el-table-column>
              <el-table-column
                label="序号"
                type="index"
                width="80">
              </el-table-column>
              <el-table-column label="内容标题" width="150">
                <template slot-scope="scope">
                  <span>{{scope.row.title }}</span>
                </template>
              </el-table-column>
              <el-table-column label="文章摘要" width="180">
                <template slot-scope="scope">
                  <span>{{scope.row.digest }}</span>
                </template>
              </el-table-column>
              <el-table-column label="所属栏目">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="添加时间" text-align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.createdAt }}</span>
                </template>
              </el-table-column>
              <el-table-column label="封面图片">
                <template slot-scope="scope" style="text-align: center">
                  <img :src="scope.row.images" alt="" style="display: inline-block;width: 100%;height: 30px">
                </template>
              </el-table-column>
              <el-table-column label="推送状态" width="110"  padding-left="80px">
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 1">已推送</span>
                  <span v-if="scope.row.status == 0">未推送</span>
                  <!--<el-switch disabled  :inactive-value="0" :active-value="1" v-model="scope.row.status"></el-switch>-->
                </template>
              </el-table-column>
              <el-table-column label="审批状态" width="110">
                <template slot-scope="scope">
                  <span v-if="scope.row.isexamine == 0">已通过</span>
                  <span v-if="scope.row.isexamine == 1">待审批</span>
                  <span v-if="scope.row.isexamine == 2">未通过</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="文本操作" width="260">
                <template slot-scope="scope">
                  <el-button size="mini" @click="handleEdit(scope)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope)">删除</el-button>
                  <el-button v-if="scope.row.isexamine == 2" size="mini"  @click="Retrial(scope)">重审</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="food">
            <div class="foodNum">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.index"
                :page-sizes="[20, 30, 40, 50, 100]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="20">
              </el-pagination>
              <!--当前页数 {{page.index}} / 查询到 {{page.records}} 条数据-->
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
    <!--新增弹层-->
    <el-dialog style="margin-top:0; "
               title="新增"
               :visible.sync="dialogVisible"
               width="1000px"
               :close-on-press-escape="false"
               :lock-scroll="false"
               :close-on-click-modal="false"
               v-if="dialogVisible"
               top="9vh">
      <div class="layer-text">
        <ul>
          <li v-for="(item,key) in selectList" :key="key" @click="handDataClick(item)">
            {{item.moduleName}}
          </li>
        </ul>
        <div class="show-box">
          <div class="modulelist" v-for="(item,index) in moduleimg" :key="index" @click="moduleclickfun(index)">
            <img :src="item.image" alt="">
          </div>
        </div>
      </div>
      <div class="layer-right">
        <el-form ref="form" :model="form" label-width="80px" size="small" s>
          <el-form-item required label="内容标题">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item required label="所属栏目">
            <el-cascader
              placeholder="===请选择==="
              :options="columtree"
              v-model="moduleCode"
              filterable
              :props="defaultProps"
              change-on-select
              @change ="moduleCodearr"
            ></el-cascader>
          </el-form-item>
          <!--<el-form-item label="添加时间">-->
          <!--<el-date-picker required v-model="form.createdAt" type="datetime" placeholder="选择日期时间"-->
          <!--@change="datefun"></el-date-picker>-->
          <!--</el-form-item>-->
          <el-form-item required label="封面图片:">
            <el-upload
              class="upload-demo"
              ref="upload"
              :multiple="true"
              :action="uploadImgUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="(res, file)=>{return uploadSuccess(res,file,'complain')}"
              :file-list="fileList"
              list-type="picture"
              accept="jpeg,png,gif"
              :auto-upload="false"
              name="imgFile">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click.stop="submitUpload('upload')">
                上传到服务器
              </el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item required label="选择状态">
            <el-switch v-model="status" @change="statusfun"></el-switch>
          </el-form-item>
          <el-form-item required label="摘要">
            <el-input type="textarea" rows="5" v-model="form.digest"></el-input>
          </el-form-item>
          <el-form-item required label="文章内容">
            <editor id="editor_id"
                    height="160px"
                    width="98%"
                    :content="form.content"
                    :afterChange="afterChange()"
                    :loadStyleMode="false"
                    :resizeMode="0"
                    :resizeType="1"
                    :filterMode="false"
                    :allowFileManager="true"
                    :uploadJson="this.$root.baseUrl + 'kind/szsArticleImgUpload?calback='+ this.$root.calbackUrl + 'redirect'"
                    :fileManagerJson="this.$root.baseUrl+'fileManager?userPath=&type=7'"
                    :items="items"
                    @on-content-change="onContentChange">
            </editor>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="">
        <el-button size="small" @click="dialogVisible=false">取消</el-button>
        <el-button size="small" type="primary" @click="dialogSave">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import 'kindeditor/themes/default/default.css'
export default {
  name: 'Template',
  data () {
    return {
      uploadImgUrl: 'http://netdisk.szschina.cn/szsArticleImgUpload', // 上传图片
      columtree: [], // 栏目列表
      fileList: [], // 图片库
      tableData: [], // 表单获取内容
      itemList: [], // 获取模板列表
      selectList: [], // 获取模板内容
      items: [ // 配置编辑器的工具栏，其中”/”表示换行，”|”表示分隔符。 数据类型: Array  详见http://kindeditor.net/docs/option.html#width
        'undo', 'redo', '|', 'preview', 'print', 'template', 'code', 'cut', 'copy', 'paste',
        'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
        'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
        'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
        'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
        'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image',
        'flash', 'media', 'insertfile', 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
        'anchor', 'link', 'unlink', '|', 'about'
      ], // 编辑器
      statusPush: '', // 查询状态
      restaurantkeyword: '', // 搜索关键字
      isexaminedata: '',
      content: '',
      status: '',
      weixinstatus: [
        {value: -1, label: '全部'},
        {value: 1, label: '已推送'},
        {value: 0, label: '未推送'}
      ],
      Approvaltatus: [
        {value: -1, label: '全部'},
        {value: 0, label: '审批通过'},
        {value: 1, label: '待审批'},
        {value: 2, label: '未审批'}
      ],
      dialogVisible: false, // 表单点击事件
      isCollapse: false,
      search: '',
      superior: [],
      options: [],
      moduleCode: [], // 所属模块
      form: {
        images: '', // 图片
        title: '', // 标题
        moduleCode: '', // 所属模块
        // createdAt: '', // 获取日期
        status: 0, // 状态
        content: '', // 编辑内容
        digest: ''
      },
      defaultProps: {
        label: 'name',
        value: 'code',
        children: 'children'
      },
      page: {
        index: 1, // 当前页数
        size: 30, // 最大行数
        page: 1, // 当前页数
        records: 0, // 总条目数
        total: 0 // 总页数
      },
      searchdata: {
        limit: 10,
        page: 1,
        keyword: '',
        status: -1,
        isexamine: '',
        moduleCode: ''
      },
      multipleSelection: [],
      propemovement: [],
      moduleimg: []
    }
  },
  methods: {
    // 表格左侧select是否可以点击方法
    checkboxInit (row, index) {
      if (row.isexamine == 0) {
        return 1
      } else {
        return 0
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      let pushid = []
      for (let item of val) {
        pushid.push(item.id)
      }
      this.propemovement = pushid
    },
    seltable () {
      this.searchdata.keyword = this.restaurantkeyword
      console.log(this.searchdata)
      this.searchfun()
    },
    searchfun () {
      this.sendAxios({
        url: this.$root.base_wechat + '/api/announ/findAnnouncement',
        method: 'post',
        data: this.searchdata
      })
        .then(res => {
          this.tableData = res
        })
    },
    statuswenxinfun (val) {
      this.searchdata.status = val
    },
    isexamstatus (val) {
      this.searchdata.isexamine = val
    },
    // 左侧树查询
    selectTree (data) {
      this.searchdata.moduleCode = data.code
      this.sendAxios({
        url: this.$root.base_wechat + '/api/announ/findAnnouncement',
        method: 'post',
        data: this.searchdata
      })
        .then(res => {
          this.tableData = res
        })
    },
    // 推送查询
    statusfun (val) {
      if (val == true) {
        this.form.status = 1
      } else {
        this.form.status = 0
      }
    },
    // 监听
    moduleCodearr (val) {
      console.log(val)
      let name = val
      this.form.name = name.join('/')
      this.form.moduleCode = val[val.length - 1]
    },
    // 遍历数据
    toTree (data, parentid) {
      var tree = []
      var temp
      for (var i = 0; i < data.length; i++) {
        if (data[i].parentId == parentid) {
          var obj = data[i]
          temp = this.toTree(data, data[i].id)
          if (temp.length > 0) {
            obj.children = temp
          }
          tree.push(obj)
        }
      }
      return tree
    },
    // 请求栏目数据api
    columnData () {
      let self = this
      this.sendAxios({
        url: self.$root.base_wechat + '/api/column/findColumn'
      })
        .then(res => {
          self.columtree = self.toTree(res.result, 0)
        })
    },
    // 上传图片
    submitUpload (ref) {
      this.$refs[ref].submit()
    },
    handleRemove (file, fileList) {
      // console.log(file, fileList)
    },
    // 上传成功后的回调
    uploadSuccess (response, file, tag) {
      this.form.images = response;
      this.$message({
        message: '上传成功',
        type: 'success'
      })
    },
    handlePreview (file) {
      // console.log(file)
    },

    // 修改编辑数据api
    handleEdit (scope) {
      this.sendAxios({
        url: this.$root.base_wechat + '/api/announ/findOne',
        method: 'post',
        data: {
          id: scope.row.id
        }
      })
        .then(res => {
          // console.log(res);
          this.form = res
          this.dialogVisible = true
        })
        .catch(e => {
          // console.log(e)
        })
    },

    // 删除数据api
    handleDelete (scope) {
      this.$confirm('确认删除？')
        .then(_ => {
          this.sendAxios({
            url: this.$root.base_wechat + '/api/announ/delete',
            method: 'post',
            data: {
              delitems: scope.row.id
            }
          })
            .then(e => {
              this.$message({
                message: '删除成功',
                type: 'success',
                showClose: this
              })
              this.obtainData()
            })
            .catch(e => {
              // console.log(e)
            })
        })
        .catch(_ => {
        })
    },

    // 获取栏目右侧数据api
    obtainData () {
      this.sendAxios({
        url: this.$root.base_wechat + '/api/announ/findAnnouncement',
        method: 'post',
        data: {
          limit: 10,
          page: 1
        }
      })
        .then(res => {
          this.tableData = res
        })
    },
    // 刷新的方法
    refreshfun () {
      this.obtainData()
    },
    // 重新审批
    Retrial (scop) {
      console.log(scop.row.id)
      this.sendAxios({
        url: '/api/announ/reApproval',
        method: 'post',
        data: {
          id: scop.row.id
        }
      })
        .then(res => {
          this.$message({
            message: '重新审批发送成功',
            type: 'success',
            showClose: this
          })
        })
    },
    // 新增保存api
    dialogSave () {
      let floag = false
      console.log(this.form)
      for (let prop in this.form) {
        if (this.form[prop] === '') {
          this.$message({
            message: '必填项不能为空',
            type: 'warning',
            showClose: this
          })
          return
        } else {
          floag = true
        }
      }
      if (floag) {
        let self = this
        self.sendAxios({
          // url: this.$root.base_wechat + '/api/announ/save',
          url: 'http://192.168.2.21:8080/api/announ/save',
          method: 'post',
          data: {
            info: JSON.stringify(self.form)
          }
        })
          .then(res => {
            this.$message({
              message: '保存成功',
              type: 'success',
              showClose: this
            })
            self.dialogVisible = false
            self.obtainData()
          })
      }
    },
    // 发布文章的接口
    PublishArticles () {
      let self = this
      console.log(this.propemovement)
      if (this.multipleSelection.length == 0) {
        self.$message({
          type: 'success',
          message: `请选择要发布的文章`
        })
      } else {
        self.sendAxios({
          url: this.$root.base_wechat + '/wechat/ceimg/meterial',
          method: 'get',
          data: {
            iditem: this.propemovement.toString()
          }
        })
          .then(res => {
            console.log(res)
            self.$message({
              type: 'success',
              message: `推送成功`
            })
          })
      }
    },
    // 监听日期格式转换
    datefun (val) {
      let d = new Date(val)
      let h = ''
      if ((d.getHours()) > 0 && (d.getHours()) < 10) {
        h = '0' + d.getHours()
      } else {
        h = d.getHours()
      }
      let f = ''
      if ((d.getMinutes()) > 0 && (d.getMinutes()) < 10) {
        f = '0' + d.getMinutes()
      } else {
        f = d.getMinutes()
      }
      let s = ''
      if ((d.getMinutes()) > 0 && (d.getMinutes()) < 10) {
        s = '0' + d.getMinutes()
      } else {
        s = d.getMinutes()
      }
      let timedata = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + h + ':' + f + ':' + s
      this.form.createdAt = timedata
      // console.log(val);
    },
    // 编辑器api
    onContentChange (val) {
      this.content = val
    },
    afterChange () {
    },
    moduleclickfun (index) {
      this.form.content = this.form.content + this.moduleimg[index].template
    },
    // 查询标签下的模板
    handDataClick: function (data) {
      let self = this
      // console.log(data);
      self.sendAxios({
        url: '/api/template/findTitleTemplateList',
        method: 'post',
        data: {
          moduleCode: data.moduleCode
        }
      })
        .then(res => {
          this.moduleimg = res
        })
    },
    // 获取模板列表
    listModleData () {
      this.sendAxios({
        url: '/api/template/findTemplate',
        method: 'post',
        data: {
          limit: 10,
          page: 1
        }
      })
        .then(res => {
          // console.log(res)
          this.itemList = res.content
          // console.log(res.content)
        })
    },

    // 查询所属系统模块下的标签
    selectData () {
      this.sendAxios({          //  api/template/findModuleTemplateList
        url: '/api/template/findModuleTemplateList',
        method: 'post',
        data: {
          limit: 10,
          page: 1
        }
      })
        .then(res => {
          // console.log(res)
          this.selectList = res
        })
    },
    // 分页
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    }

  },
  created () {
    this.selectData()
    this.listModleData()
    this.obtainData()
    this.columnData()
  }
}

</script>

<style scoped lang="scss">
  .conent {
    width: 100%;
    line-height: initial;
    text-align: left;
    $bor: 1px solid $border_color3;
    > div {
      border: $bor;
      background-color: $back_color_white;
      .food {
        padding: 0px 10px;
        font-size: 0;
        .foodNum {
          padding: 10px;
          text-align: right;
        }
        .foodPage {
          text-align: right;
          width: 100%;
        }
        > div {
          vertical-align: middle;
          font-size: $font_size14;
          display: inline-block;
        }
      }
      .head {
        margin-right: 1px;
        width: 100%;
        .complany{
          display: inline-block;
          width: 150px;
        }
        > p {
          padding: 5px 10px;
          border-bottom: 1px solid $border_color3;
          text-align: left;
        }
        .conentHtml{
          .more{
            display: none;
          }
        }
        .left{
          width: 55%;
          .complanyinput{
            width: 200px;
          }
        }
        .right {
          float: right;
          text-align: right;
          width: 40%;
          .btn {
            width: (100% / 3);
          }
        }
        > div {
          padding: 5px 10px;
          display: inline-block;
        }
      }
    }
  }
  .leftConent {
    > div {
      margin: 5px 0px 5px 5px;
      border: 1px solid $border_color3;
    }
    overflow: hidden;
    line-height: initial;
    div {
      background-color: $back_color_white;
      p {
        padding: 5px 10px;
        border-bottom: 1px solid $border_color3;
        text-align: left;
      }
    }
  }
  .layer-text {
    width: 300px;
    display: inline-block;
    ul {
      overflow: hidden;
      list-style-type: none;
      padding: 0;
      margin: 0;
      li {
        cursor: pointer;
        float: left;
        padding: 4px 10px;
        margin: 5px;
        border: 1px solid #e6e6e6;
        border-radius: 4px;
        color: #303133;
        font-size: 14px;
      }
    }
    .show-box {
      /*width: 350px;*/
      margin: 10px 4px 0 4px;
      border: 1px solid #e6e6e6;
      height: 530px;
      overflow-y: scroll;
      .modulelist{
        width: 100%;
        height: 150px;
        margin: 10px 0;
        border-radius: 10px;
        border: 1px solid gray;
        img{
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
      }
    }
  }

  .layer-right {
    float: right;
    form {
      width: 600px;
      display: inline-block;
    }
  }
</style>

<!--<style lang="scss">-->
<!--/*新增弹层*/-->
<!--.el-dialog__headerbtn {-->
<!--top: 15px;-->
<!--}-->

<!--.el-dialog {-->
<!--overflow: hidden;-->
<!--}-->

<!--.el-dialog__header {-->
<!--padding: 10px 20px;-->
<!--}-->

<!--.el-dialog__body {-->
<!--overflow: hidden;-->
<!--padding: 15px 20px;-->
<!--}-->

<!--.ke-toolbar {-->
<!--.ke-hr {-->
<!--clear: none;-->
<!--}-->
<!--}-->

<!--.layout {-->
<!--.el-table td, .el-table th {-->
<!--padding: 12px;-->
<!--}-->
<!--}-->
<!--</style>-->
