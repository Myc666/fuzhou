const allRoutess = [
    {
      path: '/',
      component: () => import('@/layout/index'),
      redirect: '/algorithmManagement/modelTesting',
      children:[
        {
          icon: 'el-icon-s-grid',
          name: '算法商城',
          path: '/algorithmManagement/modelTesting',
          component: () => import('@/views/applicationMonitoring/modelTesting/modelTesting.vue'),
          meta: {
            textIndent: true,//控制菜单样式，text-indent：0px
          }
        },
        {
          component: () => import('@/views/applicationMonitoring/modelTesting/modelDetail'),
          name: '算法详情',
          path: '/algorithmManagement/modelDetail',
          meta: {
            hideMenu: true
          }
        },
        // {
        //   icon: 'el-icon-video-camera-solid',
        //   name: '视频管理',
        //   path: '/videoManagement',
        //   component: () => import('@/views/applicationMonitoring/index'),
        //   children:[
        //     {
        //       name: '点位管理',
        //       path: '/videoManagement/pointManagement',
        //       component: () => import('@/views/applicationMonitoring/cameraManagement'),
        //     },
        //     {
        //       name: '视频预览',
        //       path: '/videoManagement/videoPreview',
        //       component: () => import('@/views/applicationMonitoring/videoStreamManagement'),
        //     }
        //   ]
        // },
        {
          icon: 'el-icon-s-cooperation',
          name: '边缘平台',
          path: '/edgePlatform',
          component: () => import('@/views/applicationMonitoring/index'),
          children:[
            {
              name: '点位管理',
              path: '/edgePlatform/boxManagement',
              component: () => import('@/views/applicationMonitoring/boxManagement'),
            },
            {
              name: '盒子管理',
              path: '/edgePlatform/casketManagement',
              component: () => import('@/views/applicationMonitoring/casketManagement/index'),
            },
            {
              name: '视频预览',
              path: '/edgePlatform/videoPreview',
              component: () => import('@/views/applicationMonitoring/edgePlatform/videoPreview'),
            },
            {
              name: '程序升级',
              path: '/edgePlatform/updata',
              component: () => import('@/views/applicationMonitoring/casketManagement/edgePlatformUpdata'),
            },{
              name: '日志查询',
              path: '/systemManagement/logInfo',
              component: () => import('@/views/applicationMonitoring/logInfo'),
            }
          ]
        },
        {
          icon: 'el-icon-s-data',
          name: '告警管理',
          path: '/dataManagement/alarmManagement',
          component: () => import('@/views/applicationMonitoring/alarmManagement'),
          meta: {
            textIndent: true,//控制菜单样式，text-indent：0px
          }
        },
        {
          icon: 'el-icon-s-comment',
          name: '推送管理',
          path: '/noticeManagement',
          component: () => import('@/views/applicationMonitoring/index'),
          children:[
            {
              name: '短信推送',
              path: '/noticeManagement/messageManagement',
              component: () => import('@/views/applicationMonitoring/noticeManagement/messageManagement'),
            },
            {
              name: '办公推送',
              path: '/noticeManagement/wxManagement',
              component: () => import('@/views/applicationMonitoring/noticeManagement/wxManagement'),
            },
            {
              name: '接囗推送',
              path: '/noticeManagement/apiManagement',
              component: () => import('@/views/applicationMonitoring/noticeManagement/apiManagement'),
            },
            {
              name: '语音推送',
              path: '/noticeManagement/voiceManagement',
              component: () => import('@/views/applicationMonitoring/noticeManagement/voiceManagement'),
            }
          ]
        },
        {
          icon: 'el-icon-s-tools',
          name: '系统管理',
          path: '/systemManagement',
          component: () => import('@/views/applicationMonitoring/index'),
          children:[
            {
              name: '基础配置',
              path: '/systemManagement/baseManagement',
              component: () => import('@/views/applicationMonitoring/systemManagement'),
            },
            {
              name: '账号管理',
              path: '/systemManagement/accountManagement',
              component: () => import('@/views/applicationMonitoring/accountManagement'),
            }
          ]
        },
        // {
        //   icon: 'el-icon-s-claim',
        //   name: '标注平台',
        //   path: '/annotationPlatform',
        //   component: () => import('@/views/annotationPlatform/index'),
        //   children: [
        //     {
        //       component: () => import('@/views/annotationPlatform/projectManagement'),
        //       name: '项目管理',
        //       path: '/annotationPlatform/projectManagement'
        //     },
        //     {
        //       component: () => import('@/views/annotationPlatform/projectManagement/projectDetail'),
        //       name: '项目详情',
        //       path: '/annotationPlatform/projectManagement/projectDetail',
        //       meta: {
        //         hideMenu: true
        //       }
        //     },
        //     {
        //       component: () => import('@/views/annotationPlatform/annotationGroupManagement'),
        //       name: '标注组管理',
        //       path: '/annotationPlatform/annotationGroupManagement'
        //     },
        //     {
        //       component: () => import('@/views/annotationPlatform/teamManagement'),
        //       name: '团队管理',
        //       path: '/annotationPlatform/teamManagement'
        //     },
        //     {
        //       component: () => import('@/views/annotationPlatform/teamManagement/teamDetail'),
        //       name: '团队详情',
        //       path: '/annotationPlatform/teamManagement/teamDetail',
        //       meta: {
        //         hideMenu: true
        //       }
        //     },
        //     {
        //       component: () => import('@/views/annotationPlatform/statisticsPage'),
        //       name: '统计页面',
        //       path: '/annotationPlatform/statisticsPage'
        //     },
        //     {
        //       component: () => import('@/views/annotationPlatform/incrementalRraining'),
        //       name: '增量训练',
        //       path: '/annotationPlatform/incrementalRraining'
        //     },
        //     {
        //       component: () => import('@/views/annotationPlatform/markTool/annotate'),
        //       name: '目标检测',
        //       path: '/annotationPlatform/projectManagement/markTool/annotate',
        //       meta: {
        //         noPadding: true,
        //         hideMenu: true
        //       }
        //     },
        //     {
        //       component: () => import('@/views/annotationPlatform/markTool/classifyBatch'),
        //       name: '图像分类-批量',
        //       path: '/annotationPlatform/projectManagement/markTool/classifyBatch',
        //       meta: {
        //         noPadding: true,
        //         hideMenu: true
        //       }
        //     },
        //     {
        //       component: () => import('@/views/annotationPlatform/markTool/classify'),
        //       name: '图像分类',
        //       path: '/annotationPlatform/projectManagement/markTool/classify',
        //       meta: {
        //         noPadding: true,
        //         hideMenu: true
        //       }
        //     },
        //     {
        //       component: () => import('@/views/annotationPlatform/markTool/annotate'),
        //       name: 'ocr',
        //       path: '/annotationPlatform/markTool/ocr',
        //       meta: {
        //         noPadding: true,
        //         hideMenu: true
        //       }
        //     },
        //     {
        //       component: () => import('@/views/annotationPlatform/markTool/incrementalRraining'),
        //       name: '增量训练',
        //       path: '/annotationPlatform/markTool/incrementalRraining',
        //       meta: {
        //         noPadding: true,
        //         hideMenu: true
        //       }
        //     }
        //   ]
        // },
      //   {
      //   icon: 'el-icon-s-cooperation',
      //   name: '人脸布控',
      //   path: '/faceControl',
      //   component: () => import('@/views/faceControl/index'),
      //   children: [
          
      //     {
      //       component: () => import('@/views/faceControl/faceRecognition'),
      //       name: '实时识别',
      //       path: '/faceControl/faceRecognition'
      //     },
      //     {
      //       component: () => import('@/views/faceControl/faceManagent/index'),
      //       name: '人脸管理',
      //       path: '/faceControl/faceManagent'
      //     },
      //     {
      //       component: () => import('@/views/faceControl/faceHistory/index'),
      //       name: '识别记录',
      //       path: '/faceControl/faceHistory'
      //     },
      //     {
      //       component: () => import('@/views/faceControl/faceCompare/index'),
      //       name: '人脸比对',
      //       path: '/faceControl/faceCompare'
      //     }
      //   ]
      // },
      // {
      //   icon: 'el-icon-view',
      //   name: '人流检测',
      //   path: '/flowDsetection',
      //   component: () => import('@/views/flowDsetection/index'),
      //   children: [
      //     {
      //       component: () => import('@/views/flowDsetection/flowSee/index'),
      //       name: '实时检测',
      //       path: '/flowDsetection/flowSee'
      //     }
          
      //   ]
      // },
      // {
      //   icon: 'el-icon-s-marketing',
      //   name: '系统外嵌',
      //   path: '/outSystem',
      //   component: () => import('@/views/outSystem/index'),
      //   children: [
      //     {
      //       component: () => import('@/views/outSystem/systemManagent'),
      //       name: '第三方页面',
      //       path: '/outSystem/systemManagent'
      //     }
          
      //   ]
      // }

      ]
    },
    {
      path: '/out',
      component: () => import('@/layout/outIndex'),
      children: [
        {
          path: '/applicationMonitoring/algorithmManagement/out',
          component: () => import('@/views/applicationMonitoring/algorithmManagement'),
          name: '内嵌算法管理'
        },
        {
          path: '/applicationMonitoring/cameraManagement/out',
          component: () => import('@/views/applicationMonitoring/cameraManagement'),
          name: '内嵌摄像头管理'
        },
        {
          path: '/applicationMonitoring/videoStreamManagement/out',
          component: () => import('@/views/applicationMonitoring/videoStreamManagement'),
          name: '内嵌视频流管理'
        },
        {
          path: '/applicationMonitoring/alarmManagement/out',
          component: () => import('@/views/applicationMonitoring/alarmManagement'),
          name: '内嵌告警管理'
        },
      ]
    },
    {
      path: '/login',
      component: () => import('@/views/login'),
      hidden: true
    },
    {
      path: '/bigScreen',
      component: () => import('@/bigScreen/index'),
      hidden: true
    },
    {
        name: '算法管理',
        path: '/algorithmManagementCopy',
        component: () => import('@/views/applicationMonitoring/index'),
        children:[
          {
            name: '算法部署',
            path: '/algorithmManagementCopy/algorithmArrange',
            component: () => import('@/views/applicationMonitoring/algorithmManagement'),
          },
          {
            name: '模型测试',
            path: '/algorithmManagementCopy/modelTesting',
            component: () => import('@/views/applicationMonitoring/modelTesting/modelTesting.vue'),
          }
        ],
        hidden: true
    },
    {
      name: '视频管理',
      path: '/videoManagementCopy',
      component: () => import('@/views/applicationMonitoring/index'),
      children:[
        {
          name: '点位管理',
          path: '/videoManagementCopy/pointManagement',
          component: () => import('@/views/applicationMonitoring/cameraManagement'),
        },
        {
          name: '视频预览',
          path: '/videoManagementCopy/videoPreview',
          component: () => import('@/views/applicationMonitoring/videoStreamManagement'),
        }
      ],
      hidden: true
    },
    {
      name: '数据汇聚',
      path: '/dataManagementCopy',
      component: () => import('@/views/applicationMonitoring/index'),
      children:[
        {
          name: '告警管理',
          path: '/dataManagementCopy/alarmManagement',
          component: () => import('@/views/applicationMonitoring/alarmManagement'),
        }
      ],
      hidden: true
    },
]

export default allRoutess;
