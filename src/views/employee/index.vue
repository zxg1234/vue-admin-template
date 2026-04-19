<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input
          v-model="queryParam.keyword"
          style="margin-bottom:10px"
          type="text"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="输入员工姓名全员搜索"
          @input="changeKeyWord"
        />
        <!-- 树形组件 -->
        <el-tree
          ref="departmentsTree"
          :data="departmentsTree"
          :props="defaultProps"
          default-expand-all
          node-key="id"
          highlight-current
          :expand-on-click-node="false"
          @node-click="changeNode"
        />
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button size="mini" type="primary">添加员工</el-button>
          <el-button size="mini" @click="changeImportExcel">excel导入</el-button>
          <el-button size="mini" @click="exprotEmp">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            prop="staffPhoto"
            label="头像"
            width="180"
          >
            <template v-slot="{ row }">
              <img v-if="row.staffPhoto" :src="row.staffPhoto" class="user-avatar">
              <span v-else class="username">{{ row.username?.substring(0, 1) }}</span>
            </template>

          </el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
            width="180"
          />
          <el-table-column
            prop="mobile"
            label="手机号"
          />
          <el-table-column
            prop="workNumber"
            label="工号"
          />
          <el-table-column
            prop="formOfEmployment"
            label="聘用形式"
          />
          <el-table-column
            prop="departmentName"
            label="部门"
          />
          <el-table-column
            prop="timeOfEntry"
            label="入职时间"
          />
          <el-table-column
            prop="address"
            label="操作"
            width="130"
          >
            <el-row type="flex" justify="center" align="middle">
              <el-col>
                <el-button type="text" size="mini" class="mr-1">查看</el-button>
                <el-button type="text" size="mini" class="mr-1">角色</el-button>
                <el-button type="text" size="mini">删除</el-button>
              </el-col>
            </el-row>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="end" align="middle" style="width: 100%;">

          <el-pagination
            :page-size="queryParam.pagesize"
            :current-page="queryParam.page"
            :total="total"
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
          />

        </el-row>
        <!-- 分页 -->
      </div>
    </div>
    <import-excel :show-excel-dialog.sync="showExcelDialog" :upload-success="getUserPageList" />
  </div>
</template>

<script>

import { getDepartmentList } from '@/api/department'
import { convertListToTree } from '@/utils'
import { userPageList, exportUserList } from '@/api/user'
import FileSaver from 'file-saver'
import importExcel from './components/import-excel.vue'
export default {
  name: 'Employee',
  components: {
    importExcel
  },
  data() {
    return {
      departmentsTree: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      queryParam: {
        departmentId: null,
        pagesize: 10,
        page: 1,
        keyword: ''
      },
      total: 1,
      tableData: [],
      showExcelDialog: false
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const result = await getDepartmentList()
      this.departmentsTree = convertListToTree(result, 0)
      console.log('this.departmentsTree', this.departmentsTree)
      console.log('this.departmentsTree[0].id', this.departmentsTree[0].id)
      this.queryParam.departmentId = this.departmentsTree[0].id
      console.log(' this.queryParam', this.queryParam)
      this.$nextTick(() => {
        this.$refs.departmentsTree.setCurrentKey(this.queryParam.departmentId)
      })

      this.getUserPageList()
    },
    async changeNode(data) {
      this.queryParam.departmentId = data.id
      await this.getUserPageList()
    },
    handleCurrentChange(currentPage) {
      console.log(this.queryParam)
      this.queryParam.page = currentPage

      this.getUserPageList()
    },
    async getUserPageList() {
      console.log(' this.userPageList', this.queryParam)
      const reslut = await userPageList(this.queryParam)
      this.total = reslut.total
      this.tableData = reslut.rows
    },
    changeKeyWord(str) {
      this.queryParam.keyword = str
      this.getUserPageList()
    },
    async exprotEmp() {
      const data = await exportUserList()
      console.log(data)
      FileSaver.saveAs(data, '导出员工数据.xlsx')
    },
    changeImportExcel() {
      this.showExcelDialog = !this.showExcelDialog
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin:10px ;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display:inline-block;
    }

    .user-avatar {
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-radius: 10px;
    }
  }
}

</style>
