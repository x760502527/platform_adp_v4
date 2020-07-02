import React from 'react';
import { Table, Checkbox, Space } from 'antd';

const columns = [
  {
    title: '菜单选项',
    dataIndex: 'title',
    valueType: 'text',
  },
  {
    title: '操作权限',
    dataIndex: 'operation',
    render: (operations: any[]) => (
      <Space>
        {
          operations.map((v)=>{
            return (
              <span key={v.name}><Checkbox>{v.name}</Checkbox></span>
            )
          })
        }
      </Space>
    )
  },
];

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

const rowSelection = {
  onChange: (selectedRowKeys: any, selectedRows: any) => {
    // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  // getCheckboxProps: (record: { name: string; }) => ({
  //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
  //   name: record.name,
  // }),
};

const Tree: React.FC<{}> = (props) => {
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
