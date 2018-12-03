<template>
  <el-row class="container">
    <!--顶部-->
    <el-col :span="24" class="header">
      <!--logo正常显示-->
      <router-link :to="{path:'/'}">
        <el-col
          :span="10"
          class="logo"
          :class="collapsed?'logo-collapse-width':'logo-width'"
        >{{collapsed?'':sysName}}</el-col>
      </router-link>
      <!--右上角个人操作-->
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner">
            <el-button type="primary">个人操作</el-button>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <!--导航菜单-->
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo catalogue"
          unique-opened
          router
          v-show="!collapsed"
        >
          <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
            <el-submenu :index="String(index)" class="subdirectory" :key="index">
              <template slot="title">
                <i :class="item.iconCls"></i>
                {{item.name}}
              </template>
              <!--子操作-->
              <el-menu-item
                v-for="child in item.children"
                :index="child.path"
                :key="child.path"
                v-if="!child.hidden"
              >{{child.name}}</el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </aside>
      <!--中间显示数据部分-->
      <section class="content-container">
        <h1 class="homePage" v-show="main">欢迎使用{{sysName}}</h1>
        <div class="grid-content bg-purple-light" v-show="!main">
          <!--显示点击的级别-->
          <el-col :span="24" class="breadcrumb-container">
            <!-- <strong class="title">{{$route.name}}</strong> -->
            <el-breadcrumb class="el-icon-arrow-right">
              <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">{{ item.name }}</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <!--主题数据展示-->
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      sysName: 'Vue管理系统',
      collapsed: false,
      main: false
    }
  },
  methods: {
    // 退出登录
    logout: function () {
      var _this = this
      this.$confirm('确认退出吗?', '提示', {})
        .then(result => _this.$router.push('/login'))
        .catch(err => console.log)
    }
  },
  watch: {
    $route (to, from) {
      if (to.path === '/') this.main = true
      else this.main = false
    }
  },
  mounted () {
    if (this.$router.currentRoute.path === '/') this.main = true
  }
}
</script>

<style scoped lang="scss">
@import "../styles/vars";

.container {
  position: absolute;
  cursor: pointer;
  top: 0px;
  bottom: 0px;
  width: 100%;
  a {
    color: #fff;
  }
  .homePage {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
      "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    text-align: center;
    font-weight: normal;
    color: #666;
    font-size: 100px;
    height: 400px;
    line-height: 400px;
  }
  .subdirectory {
    border-bottom: 1px solid #ccc;
  }
  .header {
    height: 60px;
    line-height: 60px;
    background: $bgColor;
    color: $color;
    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;
      .userinfo-inner {
        color: #fff;
      }
    }
    .logo {
      height: 60px;
      font-size: 20px;
      padding-left: 20px;
      padding-right: 20px;
      .txt {
        color: #edf7ff;
      }
    }
    .logo-width {
      width: 230px;
    }

    .tools {
      padding: 0px 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
    }
  }
  .main {
    display: flex;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
    aside {
      flex: 0 0 230px;
      width: 230px;
      .el-menu {
        height: 100%;
      }
      .collapsed {
        width: 60px;
        .item {
          position: relative;
        }
        .submenu {
          position: absolute;
          top: 0px;
          left: 60px;
          z-index: 99; /*不要攀比z-index*/
          height: auto;
          display: none;
        }
      }
    }
    .menu-collapsed {
      flex: 0 0 60px;
      width: 60px;
    }
    .menu-expanded {
      flex: 0 0 230px;
      width: 230px;
    }
    .content-container {
      background: #fff;
      flex: 1;
      position: absolute;
      right: 0px;
      top: 0px;
      bottom: 0px;
      left: 230px;
      overflow-y: scroll;
      padding: 20px;
      .breadcrumb-container {
        margin-bottom: 15px;
        margin-bottom: 15px;
        height: 37px;
        border-bottom: 1px solid #ccc;
        line-height: 37px;
        .title {
          width: 200px;
          float: right;
          color: #1f2d3d;
        }
        .breadcrumb-inner {
          float: left;
        }
      }
      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
}
</style>
