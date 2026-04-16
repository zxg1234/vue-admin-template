<template>
  <div class="container">
    <div class="app-container">
      <el-tree :expand-on-click-node="false" default-expand-all :data="depts" :props="defaultProps">
        <template v-slot="{ data }">
          <el-row style="width: 100%; height: 40px;" type="flex" justify="space-between" align="middle">
            <el-col>
              {{ data.name }}
            </el-col>
            <el-col :span="4">
              <span class="tree-manager">{{ data.managerName }}</span>
              <el-dropdown @command="(cmd)=>operationDepts(cmd,data.id)">
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">新增</el-dropdown-item>
                  <el-dropdown-item command="edit">修改</el-dropdown-item>
                  <el-dropdown-item command="delete">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <add-dept :current-node-id="currentNodeId" :show-dialog.sync="showDialog" @updateDepartment="getDepartmentList" />
  </div>
</template>

<script>
import { getDepartmentList } from '@/api/department'
import { convertListToTree } from '@/utils'
import AddDept from './components/add-dept.vue'
export default {
  name: 'Department',
  components: {
    AddDept
  },
  data() {
    return {
      currentNodeId: null,
      depts: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showDialog: false
    }
  },
  created() {
    this.getDepartmentList()
  },
  methods: {
    async getDepartmentList() {
      const result = await getDepartmentList()
      this.depts = convertListToTree(result, 0)
    },
    operationDepts(type, id) {
      this.currentNodeId = id
      if (type === 'add') {
        this.showDialog = true
      }
    }
  }
}
</script>

<style>
.app-container {
  padding: 30px 140px;
  font-size: 14px;
}

.tree-manager {
  display: inline-block;
  width: 60px;
  margin-right: 20px;
}
</style>
