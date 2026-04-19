<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div class="edit-form">
        <el-form ref="userForm" label-width="220px" :model="userFrom" :rules="rules">
          <!-- 姓名 部门 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="username">
                <el-input v-model="userFrom.username" size="mini" class="inputW" />
              </el-form-item>
            </el-col>

          </el-row>
          <!-- 工号 入职时间 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="工号" prop="workNumber">
                <el-input v-model="userFrom.workNumber" size="mini" :disabled="true" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!--手机 聘用形式  -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机" prop="mobile">
                <el-input
                  v-model="userFrom.mobile"
                  :disabled="!! $route.params.id"
                  size="mini"
                  class="inputW"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="部门" prop="departmentId">
                <!-- 放置及联部门组件 -->
                <el-cascader
                  v-model="userFrom.departmentId"
                  placeholder="请选择"
                  size="mini"
                  :options="depts"
                  :props="props"
                  separator="-"
                  @change="handleChange"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="聘用形式" prop="formOfEmployment">
                <el-select v-model="userFrom.formOfEmployment" placeholder="请选择" size="mini" class="inputW">

                  <el-option label="正式" :value="1" />
                  <el-option label="非正式" :value="2" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="入职时间" prop="timeOfEntry">
                <el-date-picker
                  v-model="userFrom.timeOfEntry"
                  size="mini"
                  type="date"
                  class="inputW"
                /></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="转正时间" prop="correctionTime">
                <el-date-picker
                  v-model="userFrom.correctionTime"
                  size="mini"
                  type="date"
                  class="inputW"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 员工照片 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="员工头像">
                <!-- 放置上传图片 -->
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 保存个人信息 -->
          <el-row type="flex">
            <el-col :span="12" style="margin-left:220px">
              <el-button size="mini" type="primary" @click="saveOrUpdate">保存更新</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>

    </div>
  </div>
</template>

<script>
import { getDepartmentList } from '@/api/department'
import { convertListToTree } from '@/utils/index'
import { addUser, queryUser, updateUser } from '@/api/user'

export default {
  data() {
    return {
      userFrom: {
        'username': '',
        'mobile': '',
        'formOfEmployment': null,
        'workNumber': '',
        'departmentId': null,
        'timeOfEntry': '',
        'correctionTime': '',
        'staffPhoto': ''
      },
      rules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 10个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'change' }
        ],
        formOfEmployment: [
          { required: true, message: '请选择聘用形式', trigger: 'blur' }
        ],
        departmentId: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ],
        correctionTime: [
          { message: '请选择转正时间', required: true, trigger: 'change' }
        ]
        // staffPhoto: [
        //   { required: true, message: '请输入活动名称', trigger: 'blur' },
        //   { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        // ],

      },
      props: {
        value: 'id',
        label: 'name',
        checkStrictly: true
      },
      depts: []
    }
  },
  created() {
    this.getDeparts()
    this.$route.params.id && this.queryUserById()
  },
  methods: {
    async getDeparts() {
      const result = await getDepartmentList()
      this.depts = convertListToTree(result, 0)
    },
    handleChange(list) {
      if (list.length) {
        this.userFrom.departmentId = list[list.length - 1]
      }
    },
    saveOrUpdate() {
      this.$refs.userForm.validate(async(valid) => {
        if (valid) {
          if (this.userFrom.id) {
            await updateUser(this.userFrom)
            this.$message.success('修改成功')
          } else {
            await addUser(this.userFrom)
            this.$message.success('新增成功')
          }
        }
        this.$router.push('/employee')
      })
    },
    async queryUserById() {
      const res = await queryUser(this.$route.params.id)
      console.log('res', res)
      this.userFrom = res
    }

  }

}
</script>

<style scoped lang="scss">
    .edit-form {
      background: #fff;
      padding: 20px;
      .inputW {
        width: 380px
      }
    }

</style>
