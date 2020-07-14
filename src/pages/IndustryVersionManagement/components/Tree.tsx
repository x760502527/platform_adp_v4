import React, { useState } from 'react';
import { Table, Checkbox, Space } from 'antd';

interface TreeProps {
  getRowMenucode(data:any): void;
  getRoleMenucode(data:any): void;
  data: any;
}

const Tree: React.FC<TreeProps> = (props:TreeProps) => {
  // 当前的选中权限数据
  // let selectedRoles:string[] = [];
  const [selectedRoles, setRoles] = useState<string[]>([])
  // 选中的菜单
  const [selectedRow, changeSelectedRow] = useState<object[]>([]);
  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      props.getRowMenucode(selectedRowKeys);
      changeSelectedRow(selectedRows);
    },
    checkStrictly: false
  };
  const columns = [
    {
      title: '菜单选项',
      dataIndex: 'menuname',
      valueType: 'text',
      key: 'menuname'
    },
    {
      title: '操作权限',
      dataIndex: 'operation',
      key: 'operation',
      valueType: 'text',
      render: (text: any[], record:any) => (
        <Space>
          {
            text.map((item)=>{
              return (
                <span key={item.menucode}>
                  <Checkbox 
                    defaultChecked={item.isClick === '0'? false : true} 
                    onChange={(event) => {
                      item.isClick = (event.target.checked === false ? '0' : '1');
                      if(event.target.checked) {
                        if(!selectedRoles.includes(item.menucode)) {
                          selectedRoles.push(item.menucode);
                        }
                      } else {
                        if(selectedRoles.includes(item.menucode)) {
                          selectedRoles.splice(selectedRoles.indexOf(item.menucode), 1);
                        }
                      }
                      console.log(selectedRoles)
                      props.getRoleMenucode(selectedRoles)
                    }}
                  >
                    {item.menuname}
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
      rowSelection={{...rowSelection}}
      dataSource={props.data}
      columns={columns} />
    </>
  );
};

export default Tree;
