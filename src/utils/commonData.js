export const projectType = [
  {
    name: '图像分类',
    value: 1
  },
  {
    name: '目标检测',
    value: 2
  },
  {
    name: 'OCR检测',
    value: 3
  },
  {
    name: '增量训练',
    value: 4
  }
];

export const defaultLabel = [
  {
    name: '人',
    editCell: false,
    children: [
      {
        name: '性别',
        editCell: false,
        children: [
          {
            name: '男',
            editCell: false,
            children: []
          },
          {
            name: '女',
            editCell: false,
            children: []
          }
        ]
      }
    ]
  }
];

export const annotationType = {
  RECT: 2,
  POLYGON: 7,
  POINT: 5
};
