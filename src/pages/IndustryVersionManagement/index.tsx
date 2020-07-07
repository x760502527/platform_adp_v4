import React, { useState, useRef } from 'react';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Divider, Dropdown, Menu, Input,Form, Row, Col, Select, Table } from 'antd';
// 引入相关组件
import CreateForm from './components/CreateForm';
import Tree from './components/Tree';
// 引入CSS
import "antd/dist/antd.css";
import "../../assets/css/IndustryVersionManagement/index.css"
import "../../assets/css/common/common.css";
// 引入接口
import { TableListItem } from './data.d';
// 引入封装网络请求获取所有项
import { getRule, addRule } from './service'
// 从Select组件中拿到Option
const { Option } = Select;

// 创建TableList组件：
const TableList: React.FC<{}> = () => {
  // 定义创建/更新表格的hook
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showTenantSearch,hideTenantSearch] = useState<boolean>(true);
  const [industryVersionName, changeName] = useState<string>('')
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
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <a 
            onClick={()=>{}}
            style={{color:'#FF4B40'}} 
          >删除</a>
        </>
      ),
    },
  ];
  const defaultValue:string = '';
  // const onFinish = (value:object[]) => {
  //   console.log(value);
  // }
  const onSubmit = async (val:string) => {
    let msg = addRule({industyVersionName: val});
    msg.then(res => {
      if(res.success) {
        actionRef.current.reloadAndRest();
        handleModalVisible(false);
      }
    })
  }
  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="行业版本列表"
        actionRef={actionRef}
        defaultData={[]}
        rowKey="key"
        columns={columns}
        rowSelection={{}}
        rowClassName={(record, index) => {return index%2=== 1?"rowWhite":"rowDeep"}}
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
                <Button onClick={() => {handleModalVisible(false);console.log(defaultValue)}}>取消</Button> 
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
