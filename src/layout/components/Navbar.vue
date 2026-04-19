<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-if="avatar" :src="avatar" class="user-avatar">
          <span v-else class="username">{{ name?.substring(0, 1) }}</span>
          <span class="name">{{ name }}</span>
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/zxg1234/vue-admin-template/">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <a target="_blank" @click.prevent="updatePassword">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="showPasswordDialog" width="35%" center @close="cancelPassword">
      <el-form ref="updatePassword" label-width="100px" :model="updatePasswordForm" :rules="rules">
        <el-form-item size="small" label="旧密码" prop="oldPassword">
          <el-input v-model="updatePasswordForm.oldPassword" show-password />
        </el-form-item>
        <el-form-item size="small" label="新密码" prop="newPassword">
          <el-input v-model="updatePasswordForm.newPassword" show-password />
        </el-form-item>
        <el-form-item size="small" label="确认新密码" prop="confirmPassword">
          <el-input v-model="updatePasswordForm.confirmPassword" show-password />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="submitPassword">提交</el-button>
          <el-button size="mini" @click="cancelPassword">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePassword } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      showPasswordDialog: false,
      updatePasswordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度必须在6-20位', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度必须在6-20位', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              console.log('比较新旧密码', value, this.updatePasswordForm.oldPassword)
              if (value === this.updatePasswordForm.oldPassword) {
                callback(new Error('新密码不能与旧密码相同'))
              } else {
                callback()
              }
            }, trigger: 'blur'
          }
        ],
        confirmPassword: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度必须在6-20位', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.updatePasswordForm.newPassword) {
                callback(new Error('两次输入的密码不一致'))
              } else {
                callback()
              }
            }, trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    },
    updatePassword() {
      this.showPasswordDialog = true
    },
    cancelPassword() {
      this.showPasswordDialog = false
      this.$refs.updatePassword.resetFields()
    },
    submitPassword() {
      this.$refs.updatePassword.validate(async(valid) => {
        if (valid) {
          // 这里可以进行修改密码逻辑，例如发送修改密码请求
          console.log('表单校验成功', this.updatePasswordForm)
          await updatePassword(this.updatePasswordForm)
          // 重置表单信息
          this.cancelPassword()
        } else {
          console.log('表单验证失败')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;

        .el-icon-setting {
          font-size: 18px;
        }

        .name {
          margin-left: 8px;
          font-size: 16px;
          margin-right: 8px;
          color: #5a5e66;
        }

        .username {
          display: inline-block;
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border-radius: 10px;
          background-color: #409eff;
          color: #fff;
          font-size: 16px;
        }

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
