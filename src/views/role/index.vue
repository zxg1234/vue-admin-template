<template>
  <div class="container">
    <div class="app-container">
      <div class="role">
        <el-button size="mini" type="primary" @click="showDialog = true">添加角色</el-button>
      </div>
      <el-table :data="rows">
        <el-table-column align="center" width="50" label="序号">
          <template slot-scope="scope">
            {{ num + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="角色名称" width="200" align="center" prop="name">
          <template v-slot="{ row }">
            <el-input v-if="row.isEdit" v-model="row.editForm.name" size="mini" />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="启用" align="center" width="200" prop="state">
          <template slot-scope="{ row }">
            <el-switch v-if="row.isEdit" v-model="row.editForm.state" :active-value="1" :inactive-value="0" />
            <span v-else>{{ row.state === 1 ? "已启用" : "已禁用" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center" prop="description">
          <template v-slot="{ row }">
            <el-input v-if="row.isEdit" v-model="row.editForm.description" size="mini" />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <template v-if="row.isEdit">
              <el-button type="primary" size="mini" @click="edit(row)">确定</el-button>
              <el-button size="mini" @click="closeEdit(row)">取消</el-button>
            </template>
            <template v-else>
              <el-button type="text" size="mini">分配权限</el-button>
              <el-button type="text" size="mini" @click="editForm(row)">编辑</el-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @onConfirm="deleteForm(row.id)"
              >
                <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;">删除</el-button>
              </el-popconfirm>
            </template>
          </template>

        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" align="middle" style="height: 60px;">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageParamForm.pageSize"
          :current-page="pageParamForm.page"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </div>
    <el-dialog :visible="showDialog" title="新增角色" @close="closeDialog">
      <el-form ref="addRoleForm" :model="addRoleForm" :rules="rules" label-width="120px">
        <el-form-item style="width: 80%;" label="角色名称" prop="name">
          <el-input v-model="addRoleForm.name" />
        </el-form-item>
        <el-form-item style="width: 80%;" label="启用" prop="state">
          <el-switch v-model="addRoleForm.state" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item style="width: 80%;" label="角色描述" prop="description">
          <el-input v-model="addRoleForm.description" type="textarea" rows="4" />
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button type="primary" size="mini" @click="addRole">确定</el-button>
              <el-button size="mini" @click="closeDialog">取消</el-button>
            </el-col>
          </el-row>

        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList, addRole, editRole, deleteRole } from '@/api/role'
export default {
  name: 'Role',
  data() {
    return {
      pageParamForm: {
        page: 1,
        pageSize: 5
      },
      rows: [],
      num: 1,
      total: 0,
      showDialog: false,
      addRoleForm: {
        name: '',
        state: 0,
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }

    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      console.log(this.pageParamForm)
      const { total, rows } = await getRoleList(this.pageParamForm)
      this.total = total
      this.rows = rows
      this.rows.forEach(item => {
        this.$set(item, 'isEdit', false)
        this.$set(item, 'editForm', {
          name: item.name,
          state: item.state,
          description: item.description
        })
      })
      this.num = (this.pageParamForm.page - 1) * this.pageParamForm.pageSize
    },
    handleCurrentChange(currentPage) {
      this.pageParamForm.page = currentPage
      this.getRoleList()
    },
    closeDialog() {
      this.showDialog = false
      this.addRoleForm = {
        name: '',
        state: 0,
        description: ''
      }
      this.$refs.addRoleForm.resetFields()
    },
    addRole() {
      this.$refs.addRoleForm.validate(async(valid) => {
        if (valid) {
          // 保存角色信息
          await addRole(this.addRoleForm)
          this.$message.success('新增成功')
          this.getRoleList()
          this.closeDialog()
        }
      })
    },
    editForm(row) {
      row.isEdit = true
      row.editForm.name = row.name
      row.editForm.state = row.state
      row.editForm.description = row.description
    },
    closeEdit(row) {
      row.isEdit = false
    },
    async edit(row) {
      if (!row.editForm.name) {
        this.$message.error('角色名称不能为空')
      }
      if (!row.editForm.description) {
        this.$message.error('角色描述不能为空')
      }
      await editRole({ ...row.editForm, id: row.id })
      this.$message.success('更新成功')
      this.closeEdit(row)
      this.getRoleList()
    },
    async deleteForm(id) {
      await deleteRole(id)
      this.$message.success('删除成功')
      if (this.rows.length === 1 && this.pageParamForm.page > 1) {
        this.pageParamForm.page -= 1
      }
      this.getRoleList()
    }
  }
}
</script>
<style scoped>
.role {
  margin: 20px 30px;
  padding-top: 30px;
}
</style>
