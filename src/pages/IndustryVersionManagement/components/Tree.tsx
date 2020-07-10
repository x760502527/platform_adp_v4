import React, { useState } from 'react';
import { Table, Checkbox, Space } from 'antd';


const Tree: React.FC<{}> = (props) => {
  // 定义操作权限选择的hook
  const [checkedStatus, changeChecked] = useState<{}[]>([]);
  // 源数据
  const originalData = [
    {
      name: '一级菜单',
      key:'1',
      title:'一级菜单',
      operation:[{
        name:'新增',
        code:'add'
      },{
        name:"删除",
        code:'delete'
      }],
      children:[
        {
          key:'3',
          title:'二级菜单',
          operation:[{
              name:'新增',
              code:'add'
          },{
              name:"删除",
              code:'delete'
          }],
        },
        {
          key:'5',
          title:'二级菜单',
          operation:[{
              name:'新增',
              code:'add'
          },{
              name:"删除",
              code:'delete'
          }],
        }
      ]
    },
    {
      name: "行业版本管理",
      key:'2',
      title:'行业版本管理',
      operation:[{
        name:'新增',
        code:'add'
      },{
        name:"删除",
        code:'delete'
      }],
      children:[
        {
          key:'4',
          title:'用户管理',
          operation:[{
              name:'新增',
              code:'add'
          },{
              name:"删除",
              code:'delete'
          }],
        }
      ]
    }
  ]
  // 遍历数据将状态存入hook
  // const 
  // originalData.forEach(item => {
  //   if(item.children) {

  //   }
  // })
  // 当前选中的行
  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      // console.log(selectedRowKeys)
      // console.log(selectedRows)
    },
  };
  // 每列的配置
  const columns = [
    {
      title: '菜单选项',
      dataIndex: 'title',
      valueType: 'text',
    },
    {
      title: '操作权限',
      dataIndex: 'operation',
      valueType: 'text',
      render: (operations: any[]) => (
        
        <Space>
          {
            operations.map((v)=>{
              // console.log(operations)
              return (
                <span key={v.name}>
                  <Checkbox>
                    {checkedStatus.toString()}{v.name}
                  </Checkbox>
                </span>
              )
            })
          }
        </Space>
      )
    },
  ];

  return (
    <>
    <Table
      rowSelection={rowSelection}
      dataSource={originalData}

      columns={columns} />
    </>
  );
};

export default Tree;
