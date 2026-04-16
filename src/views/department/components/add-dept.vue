<template>
  <el-dialog title="新增部门" :visible="showDialog" @close="closeDialog">
    <el-form ref="addDeptForm" label-width="120px" :model="addDeptForm" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="addDeptForm.name" placeholder="请输入2-10个字符" style="width: 80%;" size="mini" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="addDeptForm.code" placeholder="请输入2-10个字符" style="width: 80%;" size="mini" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="managerId">
        <el-select v-model="addDeptForm.managerId" placeholder="请选择负责人" style="width: 80%;" size="mini">
          <el-option
            v-for="item in managers"
            :key="item.id"
            :label="item.username"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="addDeptForm.introduce"
          placeholder="1-100个字符"
          type="textarea"
          style="width: 80%;"
          size="mini"
          :rows="4"
        />
      </el-form-item>
      <el-form-item>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-button type="primary" size="mini" @click="addDept">确 定</el-button>
            <el-button size="mini" @click="closeDialog">取 消</el-button>
          </el-col></el-row>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script>
import { getDepartmentList, getManagerList, addDepartment } from '@/api/department'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentNodeId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      managers: [],
      allDepts: [],
      addDeptForm: {
        name: '',
        code: '',
        managerId: '',
        introduce: '',
        pid: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.allDepts.some(item => item.name === value)) {
                callback(new Error('该部门名称已经存在'))
              } else {
                callback()
              }
            }
          }
        ],
        code: [
          { required: true, message: '请输入部门编码', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.allDepts.some(item => item.code === value)) {
                callback(new Error('部门中已有该编码'))
              } else {
                callback()
              }
            }
          }
        ],
        managerId: [
          { required: true, message: '请选择部门负责人', trigger: 'blur' }
        ],
        introduce: [
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getAllDepts()
    this.getManagers()
  },
  methods: {
    closeDialog() {
      // eslint-disable-next-line no-undef
      this.$refs.addDeptForm.resetFields()
      this.$emit('update:showDialog', false)
    },
    async getAllDepts() {
      this.allDepts = await getDepartmentList()
    },
    async getManagers() {
      this.managers = await getManagerList()
    },
    addDept() {
      this.$refs.addDeptForm.validate(async(valid) => {
        if (valid) {
          await addDepartment({
            ...this.addDeptForm,
            pid: this.currentNodeId
          })
          this.$message.success('新增成功')
          this.$emit('updateDepartment')
          this.closeDialog()
        }
      })
    }
  }

}
</script>

<style></style>
