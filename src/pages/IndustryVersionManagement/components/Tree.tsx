import React from 'react';
import { Table, Checkbox, Space } from 'antd';
import { version } from 'prettier';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}
const columns = [
    {
      title: '菜单选项',
      dataIndex: 'title',
      valueType: 'textarea',
      
    },
    {
      title: '操作权限',
      dataIndex: 'operation',
      hideInForm: true,
      render: (operations: any[]) =>(
          <Space>
          {
            operations.map((v)=>{
                return (
                <span><Checkbox>{v.name}</Checkbox></span>
                )
            })
          }
          </Space>
        )
    },
];

const dataSource = [
    {
      title: '胡彦斌',
      operation: '西湖区湖底公园1号',
    },
    {
        title: '2',
        operation: '胡彦祖',
    },
  ];

const originalData = [
    {
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
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: { name: string; }) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

const Tree: React.FC<{}> = (props) => {
//   const { modalVisible, onCancel } = props;

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
