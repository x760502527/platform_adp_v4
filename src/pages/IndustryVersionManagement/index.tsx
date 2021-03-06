// 引入依赖库
import React, { useState, useRef, useEffect } from 'react';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Divider, Dropdown, Menu, Input,Form, Row, Col, Select, message, Popconfirm } from 'antd';

// 引入相关子组件
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm'
import Tree from './components/Tree';
import UpdateTree from './components/UpdateTree';

// 引入CSS
import "antd/dist/antd.css";
import "../../assets/css/IndustryVersionManagement/index.css"
import "../../assets/css/common/common.css";

// 引入相关接口
import { TableListItem, UpdateTableParams } from './data.d';

// 引入封装网络请求获取所有项
import { getRule, addRule, removeRule, updateRule, queryMenu } from './service';

// 从Select组件中拿到Option
const { Option } = Select;

// 创建TableList组件：
const TableList: React.FC<{}> = () => {
  // 定义创建/更新表格的hook
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  // 根据角色不同显示不同搜索框的hook
  const [showTenantSearch, hideTenantSearch] = useState<boolean>(true);
  const [showIndustyName, hideIndustryName] = useState<boolean>(false)
  // 新建的行业版本名称的hook
  const [industryVersionName, changeName] = useState<string>('');
  // 新建的行业版本备注的hook
  const [note, changeNote] = useState<string>('');
  // 查询框中角色属性值的hook
  const [roleProps, changeRoleProps] = useState<number>();
  // 分页器的状态hook
  const [total, handlerTotal] = useState<number>(0);
  // 每一条数据recordItem的hook
  const [record, changeRecord] = useState<UpdateTableParams>({});
  // 新建model中的表格数据
  const [sourceData, changeSourceData] = useState<menuListItem[]>([]);
  // 修改model中的表格数据
  const [updateSourceData, setUpdateSourceData] = useState<menuListItem[]>([]);
  // 选中的每行的menucode
  let rowMenucode:string[] = [];
  let roleMenucode:string[] = [];
  // 默认的选中权限数据/菜单数据
  const [selectedRoles, setRoles] = useState<string[]>([])
  const [selectedMenu, setSelectedMenu] = useState<string[]>([]);
  // 创建表单的实例
  const [form] = Form.useForm();
  const getRowMenucode = (code:string[]) => {
    rowMenucode = code.slice(0);
  }
  const getRoleMenucode = (code:string[]) => {
    roleMenucode = code.slice(0);
  }
  // 清空新建行业版本输入框中的内容
  const clearMenus = () => {
    queryMenu().then(res => {
      if(res.success) {
        changeSourceData(res.data)
      }
    }).catch(err => {
      message.error('菜单获取失败，请刷新页面后重试');
    });
    changeName('');
    changeNote('');
    rowMenucode.length = 0;
    roleMenucode.length = 0;
    handleModalVisible(false);
  }
  // 修改菜单权限时获取初始点击状态的menucode
  interface menuListItem {
    children: menuListItem[];
    key?: string;
    isClick: string;
    menucode: string;
    menuname: string;
    operation: menuListItem[];
  }
  // 编辑页面打开时执行，获取初始menucode
  const getInitMenucode = (sourceData:menuListItem[]) => {
    if(sourceData.length === 0) {
      return
    }
    sourceData.forEach(item => {
      if(item.children.length !== 0) {
        getInitMenucode(item.children);
      }
      if(item.isClick === '1') {
        if(!selectedMenu.includes(item.menucode)) {
          selectedMenu.push(item.menucode);
        }
      }
      item.operation.forEach(item => {
        if(item.isClick === '1') {
          if(!selectedRoles.includes(item.menucode)) {
            selectedRoles.push(item.menucode);
          }
        }
      })
    });
  }
  useEffect(() => {
    // 获取菜单树的方法
    queryMenu().then(res => {
      if(res.success) {
        changeSourceData(res.data)
      }
    }).catch(err => {
      message.error('菜单获取失败，请刷新页面后重试');
    });
  }, []);
  useEffect(() => {
    getInitMenucode(updateSourceData);
  }, [updateSourceData]);
  // 处理没有选中菜单但选中了权限的方法
  const handlerNoSelectedRow = (Row: string[], Role: string[]) => {
    let menuCodes:string;
    if(Row.length !== 0 &&  Role.length !== 0) {
      menuCodes = Row.join(',') + ',' + Role.join(',');
    } else if(Row.length !== 0 && Role.length === 0) {
      menuCodes = Row.join(',');
    } else {
      menuCodes = '';
    }
    return menuCodes;
  }
  // 创建行业版本的方法
  const onSubmit = (industyVersionName:string, note?: string) => {
    form.validateFields().then(res => {
      let menuCodes:string = handlerNoSelectedRow(rowMenucode, roleMenucode);
      let msg = addRule({industyVersionName, note, menuCodes});
      msg.then(res => {
        if(res.success) {
          message.success('创建行业版本成功');
          actionRef.current?.reloadAndRest();
          clearMenus();
        } else {
          message.error(res.mesg);
        }
      }).catch(err => {
        message.error('行业版本创建失败，请刷新页面后重试');
      })
    }).catch(err => {
      message.error('请输入行业版本名称');
    });
  }
  // 修改行业版本的方法
  const onSubmitUpdate = (record:TableListItem) => {
    console.log(rowMenucode, roleMenucode)
    let menuCodes:string = handlerNoSelectedRow(rowMenucode, roleMenucode);
    console.log(menuCodes)
    // let menuCodes = handlerNoSelectedRow(rowMenucode, roleMenucode);
    let params = {
      key: record.key,
      note: record.note,
      industyVersionName: record.industyVersionName,
      menuCodes
    }
    let msg = updateRule(params);
    msg.then(res => {
      if(res.success) {
        message.success('修改成功')
        handleUpdateModalVisible(false); 
        actionRef.current?.reloadAndRest();
      }
    }).catch(err => {
      message.error('行业版本更新失败，请刷新页面后重试');
    })
  }

  // 删除行业版本的方法
  const onSubmitDelete = async (record: TableListItem) => {
    let msg = removeRule(record.key);
    msg.then((res) => {
      if(res.success) {
        actionRef.current?.reloadAndRest();
      }
    }).catch(err => {
      message.error('行业版本删除失败，请刷新页面后重试');
    })
  }

  const actionRef = useRef<ActionType>();
  // 初始化每一列的渲染
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'industyTableid',
      sorter: true,
      hideInSearch: true
    },
    {
      title: '角色属性',
      dataIndex: 'roleProps',
      renderFormItem: (item, props) => {
        return (
          <Select 
          placeholder="请选择角色"
          onChange={ 
            (val:number) => { 
              changeRoleProps(val);
              if(val == 0) {
                hideIndustryName(false)
                hideTenantSearch(true)
              } else {
                hideIndustryName(false)
                hideTenantSearch(false)
              }
            }
          }>
            <Option value={0}>行业版本</Option>
            <Option value={1}>用户角色</Option>
          </Select>
        )
      }
    },
    {
      title: '租户',
      dataIndex: 'tenant',
      sorter: true,
      hideInSearch: showTenantSearch,
      hideInTable: true,
      formItemProps: {
        placeholder:"请输入租户账号"
      }
    },
    {
      title: '行业版本名称',
      dataIndex: 'industyVersionName',
      hideInSearch: showIndustyName
    },
    {
      title: '备注',
      dataIndex: 'note',
      hideInSearch: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      hideInSearch: true,
      render: (_, recorditem) => (
        <>
          <a
            onClick={() => {
              changeRecord(recorditem);
              queryMenu(recorditem.key).then(res => {
                console.log(res);
                // 设置修改菜单的数据
                setUpdateSourceData([...res.data]);
                // 然后显示更新组件
                handleUpdateModalVisible(true);
              }).catch(err => {
                console.log(err);
                message.error('请求菜单失败，请刷新页面后重试');
              })
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="你确定要删除此条行业版本信息吗?"
            onConfirm={() => onSubmitDelete(recorditem)}
            okText="确定"
            cancelText="取消"
          >
            <a
              style={{color:'#FF4B40'}} 
            >删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];
  // 定义新增和修改行业版本页面的表单input布局
  const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="行业版本列表"
        actionRef={actionRef}
        defaultData={[]}
        rowKey="key"
        pagination={{defaultCurrent:1,total}}
        columns={columns}
        rowSelection={{}}
        rowClassName={(record, index) => {return index%2=== 1?"rowWhite":"rowDeep"}}
        options={{
          density:true,
          fullScreen: false, 
          reload:true, 
          setting: true
        }}
        request={(params, sorter, filter) => {
          // 将角色属性添加到请求参数中
          let tableParams = Object.assign(params);
          tableParams.roleflag = roleProps;
          let data = getRule({...tableParams});
          data.then(res => {
            // 获取返回的total条数并渲染
            handlerTotal(res.total);
          })
          return getRule({...tableParams});
        }}
        toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async (e) => {
                    if (e.key === 'remove') {
                      action.reload();
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        tableAlertRender={({ selectedRowKeys, selectedRows }) => (
          false
        )}
      />
      <CreateForm 
        onCancel={() => handleModalVisible(false)} 
        modalVisible={createModalVisible}
        >
        <Form 
        form={form}
        name="control-ref"
        className="createForm"
        >
          <Row>
            <Col span="10">
              <Form.Item 
                name="industryVersionName" 
                label="行业版本名称" 
                rules={[{ required: true, message: '请输入内容!'}]}
                {...formLayout}
                >
                <Input 
                  value={industryVersionName} 
                  onChange={ val => changeName(val.target.value) }
                />  
              </Form.Item>
            </Col>
            <Col span="10" offset="2">
              <Form.Item 
              name="note" 
              label="备注"
              {...formLayout}>
                <Input 
                  value={note} 
                  onChange={ val => changeNote(val.target.value) } 
                />  
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Tree
              getRowMenucode={getRowMenucode} 
              getRoleMenucode={getRoleMenucode} 
              data={sourceData}
            />
          </Form.Item>
          <Divider />
          <Row justify={"end"}>
            <Col span="2" className="footer-button">
              <Form.Item name="button">
                <Button onClick={() => {
                  clearMenus()
                }}>取消</Button> 
              </Form.Item>
            </Col>
            <Col span="2" className="footer-button">
              <Form.Item name="button">
                <Button 
                  htmlType="submit" 
                  type="primary" 
                  onClick={() => onSubmit(industryVersionName, note)} 
                  >
                  提交
                </Button> 
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </CreateForm>
      <UpdateForm 
        onCancel={() => {
          queryMenu(record.key).then(res => {
            setUpdateSourceData([...res.data]);
            handleUpdateModalVisible(false)
          })
        }} 
        modalVisible={updateModalVisible}
        >
        <Form name="control-ref" className="updateForm">
          <Row>
            <Col span="10">
              <Form.Item 
                {...formLayout}
                name="industryVersionName" 
                label="行业版本名称" 
                rules={[{ required: true }]}
                initialValue={record.industyVersionName}
                >
                <Input 
                  onChange={(e) => {
                  record.industyVersionName = e.target.value;
                }} />
              </Form.Item>
             </Col>
            <Col span="10" offset="2">
              <Form.Item 
                {...formLayout}
                name="note" 
                label="备注" 
                initialValue={record.note}
                >
                <Input 
                  onChange={(e) => {
                    record.note = e.target.value
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <UpdateTree
              getRowMenucode={getRowMenucode} 
              getRoleMenucode={getRoleMenucode} 
              data={updateSourceData}
            />
            {/* <UpdateTree1
              getRowMenucode={getRowMenucode} 
              getRoleMenucode={getRoleMenucode} 
              data={updateSourceData}
            /> */}
          </Form.Item>
          <Divider />
          <Row justify={"end"}>
            <Col span="2" className="footer-button">
              <Form.Item name="button">
                <Button onClick={() => {
                  queryMenu(record.key).then(res => {
                    setUpdateSourceData([...res.data]);
                    handleUpdateModalVisible(false)
                  })
                  }}>取消</Button> 
              </Form.Item>
            </Col>
            <Col span="2" className="footer-button">
              <Form.Item name="button">
                <Button 
                  htmlType="submit" 
                  type="primary" 
                  onClick={() => onSubmitUpdate(record)} 
                  >
                  提交
                </Button> 
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </UpdateForm>
    </PageHeaderWrapper>
  );
};

export default TableList;
