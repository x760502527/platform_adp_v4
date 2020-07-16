import React, { useState, useEffect } from 'react';
import { Table, Checkbox, Space } from 'antd';

interface TreeProps {
  getRowMenucode(data:any): void;
  getRoleMenucode(data:any): void;
  data: any;
  selectedRoles: string[];
  selectedMenu: string[];
}

let UpdateTree: React.FC<TreeProps> = (props:TreeProps) => {
  // 当前的选中权限数据
  const [selectedRoles, setRoles] = useState<string[]>(props.selectedRoles)
  // 选中的菜单
  const [selectedRow, changeSelectedRow] = useState<string[]>(props.selectedMenu);
  useEffect(() => {
    // console.log(selectedRoles, selectedRow)
  })
  const columns = [
    {
      title: '菜单选项',
      dataIndex: 'menuname',
      valueType: 'text',
      key: 'menuname',
      render: (text:any, record: any) => {
        return (
          <Space key={text}>
            <Checkbox
              defaultChecked={record.isClick === '0'? false : true} 
              onChange={(event) => {
                record.isClick = (event.target.checked === false ? '0' : '1');
                if(event.target.checked) {
                  if(!selectedRow.includes(record.menucode)) {
                    selectedRow.push(record.menucode);
                  }
                } else {
                  if(selectedRow.includes(record.menucode)) {
                    selectedRow.splice(selectedRow.indexOf(record.menucode), 1);
                  }
                }
                props.getRowMenucode(selectedRow)
              }}
            >
              {text}
            </Checkbox>
          </Space>
        )
      }
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
        rowKey="menucode"
        dataSource={props.data}
        columns={columns} 
      />
    </>
  );
};

export default UpdateTree;
