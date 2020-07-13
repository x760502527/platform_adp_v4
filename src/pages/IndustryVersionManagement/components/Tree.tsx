import React, { useState } from 'react';
import { Table, Checkbox, Space } from 'antd';

const Tree: React.FC<{}> = (props:any) => {
  // 表格源数据
  const [sourceData, changeData] = useState<object[]>(props.data);
  // 选中的菜单
  const [selectedRow, changeSelectedRow] = useState<object[]>([]);
  // 选中的菜单key
  const [selectedRole, setRole] = useState<string[]>([]);
  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      props.getRowMenucode(selectedRowKeys.join(','));
      changeSelectedRow(selectedRows);
    },
    checkStrictly: false
  };
  // 处理数据：
  // const handleData = (data:any) => {
  //   let roleMenucode:string[] = [];
  //   // console.log(data);
  //   data.forEach(item => {
  //     if(item.children.length !== 0) {
  //       handleData(item.children);
  //     }
  //     item.operation.forEach(item => {
  //       roleMenucode.push(item.isClick === '1' ? item.menucode : '')
  //     })
  //   })
  //   return roleMenucode;
  // }
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
                    disabled={selectedRow.indexOf(record) !== -1 ? false : true }
                    defaultChecked={item.isClick === '0'? false : true} 
                    onChange={(event) => {
                      // console.log(sourceData)
                      item.isClick = (event.target.checked === false ? '0' : '1');
                      if(event.target.checked) {
                        if(!selectedRole.includes(item.menucode)) {
                          setRole([...selectedRole, item.menucode]);
                        } else {
                          setRole(selectedRole.splice(selectedRole.indexOf(item.menucode), 1));
                          setRole([...selectedRole, item.menucode]);
                        }
                      } else {
                        setRole(selectedRole.splice(selectedRole.indexOf(item.menucode), 1));
                      }
                      console.log(selectedRole);
                    }}
                  >
                    {selectedRole}
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
      dataSource={sourceData}
      columns={columns} />
    </>
  );
};

export default Tree;
