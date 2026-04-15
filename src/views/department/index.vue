<template>
  <div class="container">
    <div class="app-container">
      <el-tree default-expand-all :data="depts" :props="defaultProps" >
        <template v-slot="{  data }">
          <el-row style="width: 100%; height: 40px;" type="flex" justify="space-between" align="middle">
            <el-col >
              {{ data.name }}
            </el-col>
            <el-col :span="4">
              <span class="tree-manager">{{ data.managerName }}</span>
              <el-dropdown>
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>新增</el-dropdown-item>
                  <el-dropdown-item>修改</el-dropdown-item>
                  <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script>
import { getDepartmentList } from '@/api/department'
import { convertListToTree } from '@/utils'
export default {
  name: 'Department',
  data() {
    return {
      depts: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.getDepartmentList()
  },
  methods: {
    async getDepartmentList() {
      const result = await getDepartmentList()
      this.depts = convertListToTree(result, 0)
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
