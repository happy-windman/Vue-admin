<style scoped >
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon {
  transition: all 0.3s;
  display: flex;
  align-items: center;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>
<template>
  <div class="layout">
    <Layout>
      <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
        <Menu :active-name="currentName" theme="dark" width="auto" :class="menuitemClasses">
          <MenuItem name="home" to="home">
            <Icon type="ios-navigate"></Icon>
            <span>主页</span>
          </MenuItem>
          <MenuItem name="position" to="position">
            <Icon type="ios-search"></Icon>
            <span>职位管理</span>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Header :style="{padding: 0}" class="layout-header-bar">
          <Icon
            @click.native="collapsedSider"
            :class="rotateIcon"
            :style="{margin: '0 20px'}"
            type="md-menu"
            size="24"
          ></Icon>

          <Breadcrumb style="padding-right:30px;">
            <BreadcrumbItem to="/">管理系统</BreadcrumbItem>
            <BreadcrumbItem :to="currentName">{{map[currentName]}}</BreadcrumbItem>
            <!-- <BreadcrumbItem>职位管理</BreadcrumbItem> -->
          </Breadcrumb>
        </Header>
        <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">
          <router-view v-if="isAlive"></router-view>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
export default {
  provide() {
      return {
        reload: this.reload
      }
    },
  data() {
    return {
      isCollapsed: false,
      currentName: this.$route.name,
      map: {
        home: "首页",
        position: "职位管理"
      },
      
      isAlive: true
    };
  },

  computed: {
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    }
  },
  methods: {
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
    },
     reload() {
        this.isAlive = false;
        this.$nextTick(function () {
          this.isAlive = true
        })
      }
  },
  mounted() {
    console.log(this.$route);
  },
  watch: {
    $route(to) {
      console.log(to)
      this.currentName=to.name
    }
  }
};
</script>