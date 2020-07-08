// 引入依赖库
import React, { useState, useRef } from 'react';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Divider, Dropdown, Menu, Input,Form, Row, Col, Select, message, Popconfirm } from 'antd';

// 引入相关子组件
import CreateForm from './components/CreateForm';
import Tree from './components/Tree';

// 引入CSS
import "antd/dist/antd.css";
import "../../assets/css/IndustryVersionManagement/index.css"
import "../../assets/css/common/common.css";

// 引入接口
import { TableListItem } from './data.d';

// 引入封装网络请求获取所有项
import { getRule, addRule, removeRule } from './service';

// 从Select组件中拿到Option
const { Option } = Select;

// 创建TableList组件：
const TableList: React.FC<{}> = () => {
  // 定义创建/更新表格的hook
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  // 根据角色不同显示不同搜索框的hook
  const [showTenantSearch, hideTenantSearch] = useState<boolean>(true);
  const [showIndustyName, hideIndustryName] = useState<boolean>(true)
  // 新建的行业版本名称的hook
  const [industryVersionName, changeName] = useState<string>('');

  // 查询框中角色属性值的hook
  const [roleProps, changeRoleProps] = useState<number>(-1);

  // 分页器的状态hook
  const [total, handlerTotal] = useState<number>(0);

  // 创建行业版本的方法
  const onSubmit = (val:string) => {
    if(val == '') {
      return
    }
    let msg = addRule({industyVersionName: val});
    msg.then(res => {
      if(res.success) {
        actionRef.current?.reloadAndRest();
        handleModalVisible(false);
        changeName('');
      }
    }).catch(err => {
      message.error('行业版本创建失败，请刷新页面后重试');
    })
  }

  // 删除行业版本的方法
  const confirm = async (record: TableListItem) => {
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
              } else if(val == 1) {
                hideIndustryName(false)
                hideTenantSearch(false)
              } else {
                hideIndustryName(true)
                hideTenantSearch(true)
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
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="你确定要删除此条行业版本信息吗?"
            onConfirm={() => confirm(record)}
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
                      // await handleRemove(selectedRows);
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
        name="control-ref"
        className="createForm"
        >
          <Row>
            <Col span="12">
              <Form.Item name="note" label="行业版本名称" rules={[{ required: true, message: '请输入内容!'}]}>
                <Input value={industryVersionName} onChange={ val => changeName(val.target.value) } />  
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Tree />
          </Form.Item>
          <Divider />
          <Row justify={"end"}>
            <Col span="2" className="footer-button">
              <Form.Item name="button">
                <Button onClick={() => {handleModalVisible(false)}}>取消</Button> 
              </Form.Item>
            </Col>
            <Col span="2" className="footer-button">
              <Form.Item name="button">
                <Button htmlType="submit" type="primary" onClick={() => onSubmit(industryVersionName)} >提交</Button> 
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </CreateForm>
      <CreateForm onCancel={() => handleUpdateModalVisible(false)} modalVisible={updateModalVisible}>
        <Form name="control-ref">
          <Row>
            <Col span="10">
              <Form.Item name="note" label="角色编码" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
             </Col>
            <Col span="10" offset="2">
              <Form.Item name="note" label="角色名称" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Tree />
          </Form.Item>
        </Form>
      </CreateForm>
    </PageHeaderWrapper>
  );
};

export default TableList;
