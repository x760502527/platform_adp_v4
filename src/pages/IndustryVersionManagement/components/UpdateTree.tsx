import React, { useState, useEffect } from 'react';
import { Table, Checkbox, Space } from 'antd';

interface TreeProps {
  getRowMenucode(data:any): void;
  getRoleMenucode(data:any): void;
  data: any;
  selectedRoles: string[];
  selectedMenu: string[];
}

interface menuListItem {
  children: menuListItem[];
  key?: string;
  isClick: string;
  menucode: string;
  menuname: string;
  operation: menuListItem[];
}

let UpdateTree: React.FC<TreeProps> = (props:TreeProps) => {
  // 当前的选中权限数据
  const [selectedRoles, setRoles] = useState<string[]>([])
  // 选中的菜单
  const [selectedRow, setRows] = useState<string[]>([]);

  const getInitMenucode = (sourceData:menuListItem[]) => {
    if(sourceData.length === 0) {
      return
    }
    sourceData.forEach(item => {
      if(item.children.length !== 0) {
        getInitMenucode(item.children);
      }
      if(item.isClick === '1') {
        if(!selectedRow.includes(item.menucode)) {
          selectedRow.push(item.menucode);
        }
      }
      item.operation.forEach(item => {
        if(item.isClick === '1') {
          if(!selectedRoles.includes(item.menucode)) {
            selectedRoles.push(item.menucode);
          }
        }
      })
      setRoles([...selectedRoles]);
      setRows([...selectedRow]);
    });
  }
  useEffect(() => {
    getInitMenucode(props.data);
  }, [props.data])
  
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
                if(record.isClick === '0') {
                  if(selectedRow.indexOf(record.menucode) !== -1) {
                    selectedRow.splice(selectedRow.indexOf(record.menucode), 1);
                  }
                  record.operation.forEach((item:any) => {
                    if(selectedRoles.indexOf(item.menucode) !== -1) {
                      selectedRoles.splice(selectedRoles.indexOf(item.menucode), 1);
                    }
                  });
                } else {
                  if(selectedRow.indexOf(record.menucode) === -1) {
                    selectedRow.push(record.menucode);
                  }
                  record.operation.forEach((item:any) => {
                    if(item.isClick === '1') {
                      selectedRoles.push(item.menucode);
                    }
                  });
                }
                setRoles([...selectedRoles]);
                setRows([...selectedRow])
                props.getRoleMenucode(selectedRoles);
                props.getRowMenucode(selectedRow);
                console.log(selectedRoles, selectedRow)
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
                    disabled={record.isClick === '0' ? true : false}
                    defaultChecked={item.isClick === '0'? false : true} 
                    onChange={(event) => {
                      item.isClick = (event.target.checked === false ? '0' : '1');
                      if(item.isClick === '1') {
                        if(!selectedRoles.includes(item.menucode)) {
                          selectedRoles.push(item.menucode);
                        }
                      } else {
                        if(selectedRoles.includes(item.menucode)) {
                          selectedRoles.splice(selectedRoles.indexOf(item.menucode), 1);
                        }
                      }
                      setRoles([...selectedRoles]);
                      setRows([...selectedRow])
                      props.getRoleMenucode(selectedRoles);
                      props.getRowMenucode(selectedRow);
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
