// 导入默认导出的路由对象用于跳转路由
// import router from '@/router/router';
//导入路由表
import routers from "./index"
import Cookies from 'js-cookie'
//路由配置文件
import { userTree } from "@/api/common.js"
import store from "@/store/index"
import ElementUI from 'element-ui'


routers.beforeEach(async (to, from, next) => {

  if (to.path === '/login') {
    next();
  } else {
    //其余访问请求判断用户是否登录
    if (!Cookies.get('X-Token')) {
      next('/login'); // 如果用户未登录，则重定向到登录页面
    } else {
      if (store && store.state.routerNav.length == 0) {
          let pathUrl = to.path;
          userTree({}).then(
            (res) => {
              
              if (res.code == 0) {
                //动态路由源信息
                let r = res.data;
                let obj = {
                    icon: 'el-icon-s-platform',
                    name: '安全管理',
                    path: '/secureManagement',
                    component: () => import('@/views/secureManagement/index'),
                    children:[
                      // {
                      //   name: '组织架构管理',
                      //   path: '/secureManagement/organizationalStructure',
                      //   component: () => import('@/views/secureManagement/organizationalStructure/index'),
                      // },
                      // {
                      //   name: '人员管理',
                      //   path: '/secureManagement/userManagent',
                      //   component: () => import('@/views/secureManagement/userManagent/index'),
                      // },
                      // {
                      //   name: '角色管理',
                      //   path: '/secureManagement/roleManagent',
                      //   component: () => import('@/views/secureManagement/roleManagent/index'),
                      // },
                      {
                        name: '密码模板配置',
                        path: '/secureManagement/passwordTemplate',
                        component: () => import('@/views/secureManagement/passwordTemplate/index'),
                      },
                      // {
                      //   name: '菜单管理',
                      //   path: '/secureManagement/menuManagent',
                      //   component: () => import('@/views/secureManagement/menuManagent/index'),
                      // },
                      {
                        name: '系统日志',
                        path: '/secureManagement/logManagent',
                        component: () => import('@/views/secureManagement/logManagent/index'),
                      },
                    ]
                  }
                  let aa = {
                    icon: 'el-icon-s-claim',
                    name: '标注平台',
                    path: '/annotationPlatform',
                    component: () => import('@/views/annotationPlatform/index'),
                    children: [
                      {
                        component: () => import('@/views/annotationPlatform/projectManagement'),
                        name: '项目管理',
                        path: '/annotationPlatform/projectManagement'
                      },
                      {
                        component: () => import('@/views/annotationPlatform/projectManagement/projectDetail'),
                        name: '项目详情',
                        path: '/annotationPlatform/projectManagement/projectDetail',
                        meta: {
                          hideMenu: true
                        }
                      },
                      {
                        component: () => import('@/views/annotationPlatform/annotationGroupManagement'),
                        name: '标注组管理',
                        path: '/annotationPlatform/annotationGroupManagement'
                      },
                      {
                        component: () => import('@/views/annotationPlatform/teamManagement'),
                        name: '团队管理',
                        path: '/annotationPlatform/teamManagement'
                      },
                      {
                        component: () => import('@/views/annotationPlatform/teamManagement/teamDetail'),
                        name: '团队详情',
                        path: '/annotationPlatform/teamManagement/teamDetail',
                        meta: {
                          hideMenu: true
                        }
                      },
                      {
                        component: () => import('@/views/annotationPlatform/statisticsPage'),
                        name: '统计页面',
                        path: '/annotationPlatform/statisticsPage'
                      },
                      {
                        component: () => import('@/views/annotationPlatform/incrementalRraining'),
                        name: '增量训练',
                        path: '/annotationPlatform/incrementalRraining'
                      },
                      {
                        component: () => import('@/views/annotationPlatform/markTool/annotate'),
                        name: '目标检测',
                        path: '/annotationPlatform/projectManagement/markTool/annotate',
                        meta: {
                          noPadding: true,
                          hideMenu: true
                        }
                      },
                      {
                        component: () => import('@/views/annotationPlatform/markTool/classifyBatch'),
                        name: '图像分类-批量',
                        path: '/annotationPlatform/projectManagement/markTool/classifyBatch',
                        meta: {
                          noPadding: true,
                          hideMenu: true
                        }
                      },
                      {
                        component: () => import('@/views/annotationPlatform/markTool/classify'),
                        name: '图像分类',
                        path: '/annotationPlatform/projectManagement/markTool/classify',
                        meta: {
                          noPadding: true,
                          hideMenu: true
                        }
                      },
                      {
                        component: () => import('@/views/annotationPlatform/markTool/annotate'),
                        name: 'ocr',
                        path: '/annotationPlatform/markTool/ocr',
                        meta: {
                          noPadding: true,
                          hideMenu: true
                        }
                      },
                      {
                        component: () => import('@/views/annotationPlatform/markTool/incrementalRraining'),
                        name: '增量训练',
                        path: '/annotationPlatform/markTool/incrementalRraining',
                        meta: {
                          noPadding: true,
                          hideMenu: true
                        }
                      }
                    ]
                  }
                  let gb = {
                        icon: 'el-icon-video-camera-solid',
                        name: '国标设备管理',
                        path: '/GB/equipmentManagement',
                        component: () => import('@/views/applicationMonitoring/GBManagement/index'),
                  }
                sessionStorage.setItem('menuTree', JSON.stringify(res.data));
                // 过滤动态路由菜单
                let menu = fnAddDynamicMenuRoutes(r);
                menu.push(obj,aa,gb)
                if(menu.length){
                  // routers.options.routes[0].redirect = menu[0].path
                  menu.forEach(element => {
                    if (element.children && element.children.length > 0) {
                      element.children.forEach(s => {
                        routers.addRoute('index', s);
                      })
                    } else {
                      routers.addRoute('index', element);
                    }
  
                  });
                  sessionStorage.setItem('menu', JSON.stringify(menu));
                  store.commit("addRouterData", menu)


                  // if(to.path == '/bigScreen'){
                  //   next("/bigScreen");
                  // }else{
                  //   next("/")
                  // }
                  if(pathUrl == '/bigScreen'){
                    next("/bigScreen");
                  }else{
                    if(pathUrl != "/"){
                      next(pathUrl);
                      sessionStorage.setItem('path',pathUrl);
                    }else{
                      next("/")
                    }
                  }
                } else {
                  ElementUI.Message.warning("该用户没有权限")
                  
                }
                
                
              }
            }
          )
      } else {
        next()
      }
    }
  }
})


// 用于处理动态菜单数据，将其转为 route 形式
function fnAddDynamicMenuRoutes(menuList = [], routes = []) {
  // 用于保存普通路由数据
  let temp = []
  // 用于保存存在子路由的路由数据
  let route = []
  // 遍历数据
  for (let i = 0; i < menuList.length; i++) {
    // 存在子路由，则递归遍历，并返回数据作为 children 保存
    if (menuList[i].children && menuList[i].children.length > 0) {
      if(menuList[i].type!=2){
        // 获取路由的基本格式
        route = getRoute(menuList[i])
        // 递归处理子路由数据，并返回，将其作为路由的 children 保存
        route.children = fnAddDynamicMenuRoutes(menuList[i].children)
        // 保存存在子路由的路由
        routes.push(route)
      }
    } else {
      // 保存普通路由
      delete getRoute(menuList[i]).children
      if(menuList[i].type!=2){
        temp.push(getRoute(menuList[i]))
      }
    }
  }
  // 返回路由结果
  return routes.concat(temp)
}

// 返回路由的基本格式
function getRoute(item) {
  // 路由基本格式
  let route = {
    // 路由的路径
    path: item.path,
    // 路由名
    name: item.name,
    icon: item.icon,
    // 路由所在组件  必须有一段已定义好的组件名字
    // component: (resolve) => require([`@/layout/Index`], resolve),
    component: (resolve) => require([`@/views` + item.filePath], resolve),
    meta: item.meta,
  }
  // 返回 route
  return route
}


export default routers
