import React, { useState, useRef } from 'react';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Divider, Dropdown, Menu, Input,Form, Row, Col, Select } from 'antd';
// 引入相关组件
import CreateForm from './components/CreateForm';
import Tree from './components/Tree';
// 引入CSS
import "antd/dist/antd.css";
// 引入接口
import { TableListItem } from './data.d';
// 引入封装网络请求
import { getRule } from './service'

const { Option } = Select;
const FormItem = Form.Item;

// 创建TableList组件：
const TableList: React.FC<{}> = () => {
  // 定义创建/更新表格的hook
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showTenantSearch,hideTenantSearch] = useState<boolean>(true)
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
      renderFormItem: () => {
        return (
          <Select 
          placeholder="请选择角色" 
          onChange={val => { hideTenantSearch(val == 'version' ? true : false)}}>
            <Option value="version">行业版本</Option>
            <Option value="role">用户角色</Option>
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
      formItemProps: {
        placeholder:"请输入行业版本名称"
      }
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
              // setStepFormValues(record);
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <a 
            style={{color:'#FF4B40'}} 
          >删除</a>
        </>
      ),
    },
  ];
  const defaultValue:string = '';
  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="行业版本列表"
        actionRef={actionRef}
        defaultData={[]}
        rowKey="key"
        columns={columns}
        rowSelection={{}}
        request={(params) => getRule({ ...params})}
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
        modalVisible={createModalVisible 
         }
        >
        <Form name="control-ref">
          <Row>
            <Col span="12">
              <Form.Item name="note" label="行业版本名称" rules={[{ required: true }]}>
                <Input value={defaultValue} />  
              </Form.Item>
            </Col>
          </Row>
          <FormItem>
            <Tree />
          </FormItem>
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
          <FormItem>
            <Tree />
          </FormItem>
        </Form>
      </CreateForm>
    </PageHeaderWrapper>
  );
};

export default TableList;
