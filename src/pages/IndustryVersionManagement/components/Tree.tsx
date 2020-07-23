import React, { useState } from 'react';
import { Table, Checkbox, Space } from 'antd';
// 菜单树的接口
interface TreeProps {
  getRowMenucode(data:any): void;
  getRoleMenucode(data:any): void;
  data: any;
}
// 菜单表格数据接口规范
interface TableList {
  children: TableList[];
  isClick: string;
  menucode: string;
  menuname: string;
  operation: TableList[];
}

let Tree: React.FC<TreeProps> = (props:TreeProps) => {
  // 当前的选中权限数据
  const [selectedRoles, setRoles] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<TableList[]>([]);
  // 选中项
  const rowSelection = {
    checkStrictly: false,
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      props.getRowMenucode(selectedRowKeys);
      console.log(selectedRowKeys);
    },
    onSelect: (record:any, selected:any, selectedRows:any, nativeEvent:any) => {
      setSelectedRows(selectedRows)
      // 改变record数据中的点击状态
      record.isClick = selected ? '1' : '0';
      // 取消勾选后赋权不可选，清空赋权数据
      if(!selected) {
        record.operation.forEach((item:any) => {
          if(selectedRoles.indexOf(item.menucode) !== -1) {
            selectedRoles.splice(selectedRoles.indexOf(item.menucode), 1);
            setRoles([...selectedRoles]);
            props.getRoleMenucode(selectedRoles)
          }
        });
      } else {
        record.operation.forEach((item:any) => {
          if(item.isClick === '1') {
            console.log('执行了')
            selectedRoles.push(item.menucode);
          }
        });
        setRoles([...selectedRoles]);
        props.getRoleMenucode(selectedRoles)
      }
    }
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
                    disabled={selectedRows.indexOf(record) === -1 ? true : false}
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
                      setRoles(selectedRoles);
                      props.getRoleMenucode(selectedRoles)
                      console.log(selectedRoles)
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
        rowSelection={{
          ...rowSelection
        }}
        dataSource={props.data}
        columns={columns} 
      />
    </>
  );
};

export default Tree;
